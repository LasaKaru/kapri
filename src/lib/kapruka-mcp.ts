/**
 * Minimal server-side client for the Kapruka MCP server.
 *
 * Calls a single tool over the Streamable-HTTP transport using raw fetch:
 *   1. initialize            → capture the mcp-session-id header
 *   2. notifications/initialized
 *   3. tools/call            → parse the JSON-RPC result out of the SSE body
 *
 * This is used by server routes that need to call Kapruka directly (e.g. the
 * UI checkout form placing a real order) without going through an LLM tier.
 * Note: every Kapruka tool wraps its arguments in a `params` object.
 */

const MCP_URL = 'https://mcp.kapruka.com/mcp'
const ACCEPT = 'application/json, text/event-stream'

/** Pull the JSON-RPC payload out of an SSE response body (event: message / data: {…}). */
function parseSSE(body: string): unknown {
  for (const line of body.split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('data:')) {
      const json = trimmed.slice(5).trim()
      if (json) {
        try { return JSON.parse(json) } catch { /* keep scanning */ }
      }
    }
  }
  return null
}

/** Unwrap the MCP tool result envelope into the tool's JSON payload. */
function unwrapToolResult(rpc: unknown): unknown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = rpc as any
  const content = r?.result?.content
  if (Array.isArray(content)) {
    for (const block of content) {
      if (block?.type === 'text' && typeof block.text === 'string') {
        try { return JSON.parse(block.text) } catch { return block.text }
      }
    }
  }
  return r?.result ?? null
}

export type KaprukaToolResult = { ok: true; data: unknown } | { ok: false; error: string }

/**
 * Call one Kapruka MCP tool. `params` is the inner object (it is wrapped in the
 * required `params` envelope for you). Returns the parsed tool JSON.
 */
export async function callKaprukaTool(
  name: string,
  params: Record<string, unknown>,
  timeoutMs = 30000,
): Promise<KaprukaToolResult> {
  try {
    // 1. initialize
    const initRes = await fetch(MCP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: ACCEPT },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: { name: 'kapri-web', version: '1.0' },
        },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })
    const sessionId = initRes.headers.get('mcp-session-id')
    if (!sessionId) return { ok: false, error: 'MCP initialize failed: no session id' }

    // 2. initialized notification
    await fetch(MCP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: ACCEPT, 'mcp-session-id': sessionId },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
      signal: AbortSignal.timeout(timeoutMs),
    })

    // 3. tools/call
    const callRes = await fetch(MCP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: ACCEPT, 'mcp-session-id': sessionId },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 2, method: 'tools/call',
        params: { name, arguments: { params } },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    })

    if (callRes.status === 429) {
      return { ok: false, error: 'Kapruka rate limit reached. Please try again shortly.' }
    }

    const rpc = parseSSE(await callRes.text())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const asAny = rpc as any
    if (asAny?.error) return { ok: false, error: String(asAny.error.message ?? 'MCP error') }
    if (asAny?.result?.isError) {
      const msg = asAny.result.content?.[0]?.text ?? 'Tool returned an error'
      return { ok: false, error: String(msg) }
    }
    return { ok: true, data: unwrapToolResult(rpc) }
  } catch (err) {
    return { ok: false, error: (err as Error).message || 'MCP request failed' }
  }
}
