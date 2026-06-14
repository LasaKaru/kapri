# Architecture & System Design Document

## 1. The 3-Tier Reliability Engine
To guarantee 100% uptime and manage API costs efficiently, Kapri routes requests through a three-tier architecture:

```mermaid
graph TD
    A["User Message"] --> B{"Anthropic/Claude API (Tier 1)"}
    B -- Success --> C["Generate Response + UI"]
    B -- "Timeout / Rate Limit" --> D{"Google Gemini API (Tier 2)"}
    D -- Success --> C
    D -- "Failure / Offline" --> E["Scripted Engine (Tier 3)"]
    E --> F["Instant Fallback Response"]
    
    style A fill:#4c1d95,stroke:#fff,stroke-width:2px,color:#fff
    style B fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff
    style D fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff
    style E fill:#ef4444,stroke:#b91c1c,stroke-width:2px,color:#fff
```

## 2. MCP Data Flow & Zero-Text UI
Kapri interfaces directly with Kapruka's backend using the Model Context Protocol (MCP). Rather than returning a massive block of unreadable JSON to the user, Kapri intercepts the data and forces a native UI render.

```mermaid
sequenceDiagram
    participant User
    participant Kapri
    participant MCP as mcp.kapruka.com
    
    User->>Kapri: "Earbuds under 5000"
    Kapri->>MCP: Call kapruka_search_products(q: "earbuds", max_price: 5000)
    MCP-->>Kapri: Return JSON Array [Product A, Product B...]
    Kapri->>Kapri: Block plain text rendering
    Kapri->>User: Inject Interactive Carousel UI
```

## 3. Token Optimization (stripCardJson)
To ensure long chat sessions do not hit the LLM context limits or run up expensive API bills, Kapri implements an aggressive token management strategy. When a heavy JSON payload (like a 4000-token product carousel) is sent to the client, the `stripCardJson` middleware activates. It strips the JSON from the active chat history array before the next user prompt is sent to the LLM. 

This results in a ~40% reduction in average API token usage per session without compromising the AI's contextual awareness of the conversation.
