import { createMCPClient } from '@ai-sdk/mcp'

async function main() {
  const mcpClient = await createMCPClient({
    transport: { type: 'http', url: 'https://mcp.kapruka.com/mcp' },
  })
  
  const tools = await mcpClient.tools({ schemas: {
    kapruka_get_product: {
      inputSchema: {
        type: "object",
        properties: {
          params: { type: "object", properties: { product_id: { type: "string" } } }
        }
      }
    }
  } })
  
  const result = await tools.kapruka_get_product.execute({ params: { product_id: "CAKE00KA002001" } })
  console.log(JSON.stringify(result, null, 2))
}

main().catch(console.error)
