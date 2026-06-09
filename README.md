# Kapri — AI Shopping Concierge for Kapruka

> **Kapruka Agent Challenge 2026** · Entry by [@LasaKaru](https://github.com/LasaKaru)  
> Prize: Apple M4 Mac Mini · Deadline: 30 June 2026

Kapri is a full-screen, multilingual AI shopping concierge built on top of the [Kapruka MCP](https://mcp.kapruka.com/mcp) — Sri Lanka's largest e-commerce platform. It guides shoppers from "I'm not sure what to buy" to a **real Kapruka guest-checkout pay link**, entirely through rich generative UI.

---

## What it does

- **Understands vague intent** — "a nice gift for my mother under Rs. 5000" triggers a curated product carousel, not a text list.
- **Speaks Sinhala, Tanglish, and English** — the model detects language and responds in kind; city names in Sinhala resolve to real Kapruka delivery cities.
- **True multi-item cart** — persistent cart (localStorage-backed), visible badge, drawer with quantity controls.
- **Delivery validation** — city autocomplete, date picker, live perishable warnings for cakes/flowers, flat-fee display.
- **Gift message enhancer** — AI-rewritten gift messages in English or Sinhala.
- **End-to-end checkout** — collects recipient, sender, delivery details, and calls `kapruka_create_order` for a real pay link.
- **Order tracking** — paste a `VIMP…` order number to get a live progress timeline.
- **Voice input** — Web Speech API with `si-LK` locale for Sinhala voice prompts.
- **Graceful fallback** — three-tier AI chain ensures the app always responds even without API keys.

---

## Architecture

```
Browser (Next.js 14 App Router)
│
│  POST /api/chat   { messages, cart }
│  GET  /api/product-image?url=…
│
└─► Next.js API Routes (Node.js)
    │
    ├─ Tier 1: Anthropic SDK  ──► claude-sonnet-4-6
    │          (MCP beta)          │
    │                              └─► Anthropic servers ──► mcp.kapruka.com/mcp
    │                                  (IP allowlisted)
    │
    ├─ Tier 2: AI SDK v6 ───────► gemini-2.5-flash
    │          (@ai-sdk/mcp)       │
    │                              └─► direct HTTP ──► mcp.kapruka.com/mcp
    │                                  (works on Vercel)
    │
    └─ Tier 3: Scripted Engine ──► keyword rules, no API key required
               (src/lib/engine.ts)  always returns a valid EngineResponse
```

The browser never touches Anthropic, Google, or Kapruka directly — all calls are proxied through the Next.js API routes to keep secrets server-side.

---

## Key Design Decisions

### 1. Anthropic MCP beta proxy (`betas: ['mcp-client-2025-11-20']`)
The Kapruka MCP server IP-allowlists Anthropic and Vercel. Using the Anthropic SDK's MCP client beta routes all MCP calls through Anthropic's own infrastructure — so the app works from any environment including local dev and CI.

```typescript
// src/app/api/chat/route.ts
await client.beta.messages.create({
  betas: ['mcp-client-2025-11-20'],
  mcp_servers: [{ type: 'url', url: 'https://mcp.kapruka.com/mcp', name: 'kapruka' }],
  // ...
})
```

### 2. Static Zod schemas for Gemini (`{ schemas: KAPRUKA_SCHEMAS }`)
Gemini rejects dynamically-discovered tool schemas. The fix is to pass explicit Zod schemas to `client.tools()`. The MCP client still executes the real tools — only schema discovery is bypassed.

```typescript
// src/lib/gemini-route.ts
const tools = await mcpClient.tools({ schemas: KAPRUKA_SCHEMAS })
const { text } = await generateText({ model: google('gemini-2.5-flash'), tools, stopWhen: stepCountIs(6) })
```

### 3. Structured JSON protocol over plain text
The system prompt instructs every AI model to respond **only** with valid JSON matching `EngineResponse`. `parseClaudeResponse` handles cases where the model wraps output in code fences, and normalises MCP price objects `{ amount, currency }` into plain numbers for the UI.

### 4. CSS custom properties instead of Tailwind theme
Brand colours (`--purple: #442A73`, `--yellow: #F9DB09`) are CSS variables in `globals.css`. Utility classes come from plain Tailwind without a custom theme — keeping the build lean and the brand locked.

### 5. localStorage cart persistence
Cart state lives in `localStorage` under `kapri_cart`. On every `send()` call the full cart is serialised and re-injected into the API request body, then into the system prompt — so the model always has authoritative cart context without relying on LLM memory.

### 6. MCP result envelope unwrapping
`@ai-sdk/mcp` wraps tool results as:
```json
{ "type": "content", "value": [{ "type": "text", "text": "{…json…}" }] }
```
`unwrapMCPResult()` in `gemini-route.ts` peels this envelope before passing data to the model.

---

## End-to-End Shopping Workflow

```
1. Discovery
   User: "chocolate birthday cake under Rs 3000"
   → POST /api/chat (Tier 1/2/3)
   → kapruka_search_products { q, max_price, category }
   → <ProductCarousel> renders live results with price, stock badge, image

2. Product Detail
   User taps a card → ProductDetail overlay
   → kapruka_get_product { product_id }
   → full description, images, variants, shipping info

3. Cart
   "Add to cart" → CartItem appended to cart array → localStorage saved
   → Header badge bounces → cart drawer available
   → Cart summary injected into next system prompt turn

4. Delivery
   User: "deliver to Kandy on Friday"
   → kapruka_list_delivery_cities (fuzzy match "Kandy")
   → kapruka_check_delivery { city, delivery_date }
   → <DeliveryStatus> shows flat fee, perishable warning if applicable

5. Checkout
   <CheckoutFlow> accordion collects:
     • Recipient name + phone
     • Delivery address, city, date, location type
     • Sender name (anonymous option)
     • Gift message (with AI-enhance button)
   → Server validates: stock, city, date, required fields
   → kapruka_create_order { cart, recipient, delivery, sender, gift_message }

6. Pay Link
   → <PaymentSheet> shows order ref, grand total, price-lock countdown
   → "Pay Now" opens checkout_url in new tab (real Kapruka payment page)

7. Tracking
   User: "track VIMP34456CB2"
   → kapruka_track_order { order_number }
   → <OrderTracker> progress timeline, delivery photo/video affordances
```

---

## ToolRenderer Dispatch Table

`App.tsx → renderCard()` maps `CardData.type` to the appropriate component:

| `CardData.type` | Component | Key props |
|---|---|---|
| `carousel` | `<ProductCarousel>` | `products`, `cartIds`, `onAdd`, `onOpen` |
| `bundle` | `<BundleCard>` | `bundle`, `products`, `cartIds`, `onAdd`, `onAddAll`, `onGiftMsg` |
| `delivery` | `<DeliveryStatus>` | `city`, `date`, `available`, `rate`, `reason`, `perishableWarning` |
| `tracker` | `<OrderTracker>` | `number`, `demo` (fallback order data) |
| `checkout` | `<CheckoutCard>` | `order`, `onPay`, `onEdit` |

Skeleton: `<SkeletonCarousel>` renders while `searchPending` is true (before the first tool result arrives).

---

## Project Layout

```
kapri/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts          # 3-tier AI routing (Anthropic → Gemini → Engine)
│   │   │   └── product-image/route.ts # og:image proxy with 30-min in-memory cache
│   │   ├── layout.tsx                 # HTML shell, Inter + Noto Sans Sinhala fonts
│   │   └── page.tsx                   # Renders <App> client component
│   │
│   ├── components/
│   │   ├── App.tsx                    # Root orchestration: all state, send(), renderCard()
│   │   ├── EmptyState.tsx             # Welcome screen with example prompts + categories
│   │   │
│   │   ├── cards/                     # Generative UI — every tool result is one of these
│   │   │   ├── ProductCard.tsx        # Single product tile (image, price, add-to-cart)
│   │   │   ├── ProductCarousel.tsx    # Horizontal scroll grid of ProductCards
│   │   │   ├── ProductDetail.tsx      # Full-screen product overlay
│   │   │   ├── BundleCard.tsx         # AI gift bundle (cake + flowers + card)
│   │   │   ├── DeliveryStatus.tsx     # Delivery city/date validation result
│   │   │   ├── CheckoutCard.tsx       # Order summary before payment
│   │   │   ├── OrderTracker.tsx       # Post-payment progress timeline
│   │   │   └── SkeletonCarousel.tsx   # Loading state while search runs
│   │   │
│   │   ├── overlays/                  # Full-screen modal flows
│   │   │   ├── CartDrawer.tsx         # Slide-in cart with quantity controls
│   │   │   ├── CheckoutFlow.tsx       # Multi-step checkout accordion
│   │   │   └── PaymentSheet.tsx       # Pay link + price-lock countdown
│   │   │
│   │   └── ui/                        # Reusable primitives
│   │       ├── Header.tsx             # Logo, language toggle, cart badge
│   │       ├── Bubbles.tsx            # UserBubble, KapriRow, KapriText, Typing
│   │       ├── Chip.tsx               # Quick-reply suggestion chips
│   │       ├── Composer.tsx           # Message input + voice button
│   │       ├── Icons.tsx              # SVG icon set
│   │       └── SeasonBanner.tsx       # Occasion-aware seasonal greeting
│   │
│   └── lib/
│       ├── types.ts                   # All TypeScript interfaces (Product, CartItem, CardData…)
│       ├── data.ts                    # CATALOG, BUNDLES, CATEGORIES, OCCASIONS, SEASON
│       ├── system-prompt.ts           # Cart-aware dynamic system prompt builder
│       ├── parse-mcp-response.ts      # Robust Claude JSON extractor + price normaliser
│       ├── gemini-route.ts            # Tier-2 Gemini handler (static schemas + unwrap)
│       └── engine.ts                  # Tier-3 scripted engine (keyword rules, no API key)
│
├── public/                            # Static assets
├── next.config.mjs                    # Image remote patterns (static2.kapruka.com)
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example                 # Environment variable template
└── package.json
```

---

## AI Provider Fallback Chain

```
ANTHROPIC_API_KEY set?
  └─ YES → Tier 1: claude-sonnet-4-6 via Anthropic MCP beta
       • Full agentic loop, multi-turn tool calls
       • MCP proxied through Anthropic's servers (no IP restriction)
       • Falls through on any error ↓

GOOGLE_GENERATIVE_AI_API_KEY set?
  └─ YES → Tier 2: gemini-2.5-flash via @ai-sdk/mcp
       • Static Zod schemas bypass Gemini's tool discovery limitation
       • Direct HTTP to mcp.kapruka.com (works on Vercel)
       • Falls through on any error ↓

Tier 3: Scripted engine (src/lib/engine.ts)
  • Keyword matching: search / cake / flower / budget intents
  • Returns carousel from CATALOG or delivery status from CITIES
  • Always succeeds — no network calls, no API key needed
```

Set only the keys you have. The app degrades gracefully through all three tiers.

---

## Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 14.2 |
| Language | TypeScript | 5 |
| UI | React | 18.3 |
| Styling | Tailwind CSS + CSS custom properties | 3 |
| AI — Primary | `@anthropic-ai/sdk` (Anthropic SDK) | 0.102 |
| AI — Fallback | `ai` + `@ai-sdk/google` (Vercel AI SDK) | 6.0 |
| MCP client | `@ai-sdk/mcp` | 1.0 |
| Schema validation | Zod | 3.25 |
| State | React `useState` + localStorage | — |
| Hosting | Vercel | — |
| Model — Tier 1 | `claude-sonnet-4-6` | current |
| Model — Tier 2 | `gemini-2.5-flash` | current |

---

## Rubric Coverage (100 pts)

| Category | Pts | How Kapri scores |
|---|---|---|
| **Experience & Polish** | 30 | Full-screen app shell; optimistic message UI; skeleton loaders; mobile-first (380px); localStorage state sync; no layout shift; smooth card transitions; safe-area insets |
| **Visual Richness** | 20 | Zero raw-text product lists — every result is a `<ProductCarousel>`, `<BundleCard>`, `<DeliveryStatus>`, or `<OrderTracker>` generative component |
| **Personality** | 15 | Named "Kapri"; warm, proactive Sri Lankan voice; seasonal occasion awareness (Avurudu, Poya, birthdays, anniversaries); occasion-specific gift suggestions |
| **Usefulness** | 15 | Budget parsing (`max_price`); vague-intent clarification; zero-result pivot with alternatives; delivery validation with perishable warnings; city name aliases (Sinhala/romanized) |
| **End-to-end completeness** | 15 | Discovery → cart → delivery check → checkout form → `kapruka_create_order` → real pay link → order tracking |
| **Creativity** | 5 | AI Gift Bundle Builder (cake + flowers + card by theme/budget); Sinhala voice input (`si-LK`); gift message AI-enhancer in EN + Sinhala |
| **Total** | **100** | |

### Bonus features

| Bonus | Status |
|---|---|
| Multi-item cart | ✅ Persistent cart, quantity controls, header badge |
| Delivery-date constraints | ✅ Calendar widget + `check_delivery` + perishable rules |
| Gift messaging | ✅ Free-text + AI "Enhance" rewrite (English + Sinhala) |
| Tanglish conversation | ✅ Model detects and responds in mixed Sinhala-English |
| Sinhala language | ✅ Voice input (`si-LK`), Sinhala city aliases, Sinhala responses |

---

## Running Locally

```bash
# 1. Clone
git clone https://github.com/LasaKaru/kapri.git
cd kapri

# 2. Install
npm install

# 3. Configure
cp .env.local.example .env.local
# Edit .env.local — add at least ANTHROPIC_API_KEY for live Kapruka data

# 4. Run
npm run dev
# → http://localhost:3000
```

The app works without any API key (Tier 3 scripted engine). For live Kapruka data, add `ANTHROPIC_API_KEY`.

---

## Deploying to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or: Vercel dashboard → **Import Git Repository** → set env vars → **Deploy**.

Add environment variables in the Vercel project settings:
- `ANTHROPIC_API_KEY` — required for live MCP data
- `GOOGLE_GENERATIVE_AI_API_KEY` — optional Gemini fallback

**Important:** Do not complete real payments during development. Stop at the checkout URL. Stay under 30 `kapruka_create_order` calls per hour per the Kapruka MCP terms.

---

## License

MIT — competition entry, open-sourced for the Sri Lankan dev community.
