import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'

async function main() {
  const transport = new SSEClientTransport(new URL("https://mcp.kapruka.com/mcp/sse"))
  const client = new Client({ name: "test", version: "1.0.0" })
  await client.connect(transport)
  const result = await client.callTool({
    name: "kapruka_get_product",
    arguments: { product_id: "CAKE00KA002001" }
  })
  console.log(JSON.stringify(result, null, 2))
}

main().catch(console.error)
