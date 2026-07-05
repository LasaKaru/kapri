import { NextResponse } from 'next/server'
import { getOrderFromDb } from '@/lib/db'
import { callKaprukaTool } from '@/lib/kapruka-mcp'
import { parseClaudeResponse } from '@/lib/parse-mcp-response'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: { number: string } }) {
  try {
    // 1. Check local KV db (for newly placed dummy orders in this session)
    const localOrder = await getOrderFromDb(params.number)
    if (localOrder) {
      return NextResponse.json(localOrder)
    }

    // 2. Fetch directly from Kapruka MCP using robust local parsing
    const MCP_URL = 'https://mcp.kapruka.com/mcp'
    const ACCEPT = 'application/json, text/event-stream'
    
    const initRes = await fetch(MCP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: ACCEPT },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'initialize',
        params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'tracker', version: '1.0' } }
      })
    })
    const sessionId = initRes.headers.get('mcp-session-id')
    
    if (sessionId) {
      await fetch(MCP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: ACCEPT, 'mcp-session-id': sessionId },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })
      })
      
      const callRes = await fetch(MCP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: ACCEPT, 'mcp-session-id': sessionId },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 2, method: 'tools/call',
          params: { name: 'kapruka_track_order', arguments: { params: { order_number: params.number, response_format: 'json' } } }
        })
      })
      
      const rawBody = await callRes.text()
      // Extract the nested JSON string using robust regex
      const match = rawBody.match(/"text"\s*:\s*"(\{[\s\S]*?\})"/);
      if (match && match[1]) {
        try {
          const jsonStr = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
          const mcpData = JSON.parse(jsonStr);
          const parsed = parseClaudeResponse(JSON.stringify({ card: { type: 'tracker', ...mcpData } }));
          if (parsed.card && parsed.card.type === 'tracker') {
            return NextResponse.json(parsed.card)
          }
        } catch (e) {
          console.error("Failed to parse raw extracted JSON:", e);
        }
      }
    }

    // 3. Fallback: Not found
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
