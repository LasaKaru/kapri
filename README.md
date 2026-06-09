<div align="center">

# 🛍️ Kapri — AI Shopping Concierge for Kapruka.lk

**A full-screen, multilingual (English · සිංහල · Tanglish) AI shopping agent built on the public Kapruka MCP server.**

Discover gifts, browse a real catalog, quote delivery to any Sri Lankan city, personalise a cake, write a gift message, and place a real guest-checkout order — all inside one immersive conversation.

`Next.js 14` · `React 18` · `Vercel AI SDK 6` · `Anthropic Claude` · `Gemini 2.5 Flash (fallback)` · `Kapruka MCP` · `Vercel KV` · `Zod`

</div>

---

## ✨ Features

- **Understands vague intent** — "a nice gift for my mother under Rs. 5000" triggers a curated product carousel, not a text list.
- **Speaks Sinhala, Tanglish, and English** — the model detects language and responds in kind; city names in Sinhala resolve to real Kapruka delivery cities.
- **True multi-item cart** — persistent cart (localStorage-backed), visible badge, drawer with quantity controls.
- **Delivery validation** — city autocomplete, date picker, live perishable warnings for cakes/flowers, flat-fee display.
- **Gift message enhancer** — AI-rewritten gift messages in English or Sinhala.
- **End-to-end checkout** — collects recipient, sender, delivery details, and calls `kapruka_create_order` for a real pay link.
- **Order tracking** — paste a `VIMP…` order number to get a live progress timeline.
- **Voice input** — Web Speech API with `si-LK` locale for Sinhala voice prompts.
- **Seasonal banners** — auto-detects Avurudu, Wesak, Poson, Deepavali, Christmas, and Valentine's Day.
- **Graceful fallback** — three-tier AI chain ensures the app always responds even without API keys.

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Client ["Browser"]
        UI["Next.js 14 App Router<br/>(React 18 Client Components)"]
        LS["localStorage<br/>(Cart · Lang · Orders)"]
    end

    subgraph Server ["Next.js API Routes"]
        CHAT["/api/chat"]
        IMG["/api/product-image"]
        ORD["/api/orders"]
    end

    subgraph AI ["AI Providers"]
        T1["Tier 1: Claude<br/>via Anthropic SDK"]
        T2["Tier 2: Gemini 2.5 Flash<br/>via @ai-sdk/mcp"]
        T3["Tier 3: Scripted Engine<br/>(no API key needed)"]
    end

    KV["Vercel KV<br/>(Order Storage)"]
    MCP["Kapruka MCP Server<br/>mcp.kapruka.com/mcp"]

    UI -- "POST /api/chat" --> CHAT
    UI -- "GET /api/product-image" --> IMG
    UI -- "POST/GET /api/orders" --> ORD
    UI <--> LS

    CHAT -- "Try first" --> T1
    CHAT -. "Fallback" .-> T2
    CHAT -. "Offline fallback" .-> T3

    T1 -- "MCP beta proxy" --> MCP
    T2 -- "Direct HTTP" --> MCP

    ORD <--> KV
    IMG -- "Proxy + cache" --> MCP

    style Client fill:#f3f0fa,stroke:#442A73
    style Server fill:#fef9e7,stroke:#d4a017
    style AI fill:#e8f5e9,stroke:#2e7d32
```

> The browser never touches Anthropic, Google, or Kapruka directly — all calls are proxied through Next.js API routes to keep secrets server-side.

---

## 🧠 AI Provider Fallback Chain

```mermaid
flowchart TD
    REQ((Request)) --> CHECK1{ANTHROPIC_API_KEY<br/>set?}

    CHECK1 -- YES --> T1["✅ Tier 1: Claude<br/>via Anthropic MCP beta"]
    CHECK1 -- NO --> CHECK2

    T1 -- "Runtime error" --> CHECK2{GOOGLE_API_KEY<br/>set?}

    CHECK2 -- YES --> T2["🔄 Tier 2: Gemini 2.5 Flash<br/>via @ai-sdk/mcp<br/>(static Zod schemas)"]
    CHECK2 -- NO --> T3

    T2 -- "Runtime error" --> T3["🛡️ Tier 3: Scripted Engine<br/>(keyword rules, no network)"]

    T3 --> RES((Response))
    T1 --> RES
    T2 --> RES

    style T1 fill:#d4edda,stroke:#28a745
    style T2 fill:#fff3cd,stroke:#856404
    style T3 fill:#f8d7da,stroke:#721c24
    style RES fill:#f3f0fa,stroke:#442A73
```

Set only the keys you have. The app degrades gracefully through all three tiers.

---

## 🛒 End-to-End Shopping Workflow

```mermaid
sequenceDiagram
    actor User
    participant Kapri as Kapri UI
    participant API as /api/chat
    participant MCP as Kapruka MCP
    participant KV as Vercel KV

    Note over User,MCP: 1️⃣ Discovery
    User->>Kapri: "chocolate birthday cake under Rs 3000"
    Kapri->>API: POST { messages, cart }
    API->>MCP: kapruka_search_products
    MCP-->>API: Product results
    API-->>Kapri: EngineResponse { card: carousel }
    Kapri-->>User: Renders <ProductCarousel>

    Note over User,MCP: 2️⃣ Cart
    User->>Kapri: Click "Add to cart"
    Kapri->>Kapri: Save to localStorage

    Note over User,MCP: 3️⃣ Delivery Check
    User->>Kapri: "deliver to Kandy on Friday"
    Kapri->>API: POST { messages, cart }
    API->>MCP: kapruka_check_delivery
    MCP-->>API: Rates & availability
    API-->>Kapri: EngineResponse { card: delivery }
    Kapri-->>User: Renders <DeliveryStatus>

    Note over User,KV: 4️⃣ Checkout & Payment
    User->>Kapri: Complete <CheckoutFlow>
    Kapri->>API: POST { messages, cart }
    API->>MCP: kapruka_create_order
    MCP-->>API: Order ref + pay link
    API-->>Kapri: EngineResponse { card: checkout }
    Kapri-->>User: <CheckoutCard> + <PaymentSheet>
    User->>Kapri: Click "Pay Now"
    Kapri->>KV: Store order (VIMP...)

    Note over User,KV: 5️⃣ Tracking
    User->>Kapri: "track VIMP34456"
    Kapri->>KV: Lookup order
    KV-->>Kapri: Order data
    Kapri-->>User: <OrderTracker> timeline
```

---

## 🧩 ToolRenderer Dispatch Table

`App.tsx → renderCard()` maps `CardData.type` to the appropriate component:

| `CardData.type` | Component | Description |
|---|---|---|
| `carousel` | `<ProductCarousel>` | Horizontal scroll grid of product cards with add-to-cart |
| `bundle` | `<BundleCard>` | AI gift bundle (cake + flowers + card by theme/budget) |
| `delivery` | `<DeliveryStatus>` | Delivery city/date validation with perishable warnings |
| `tracker` | `<OrderTracker>` | Post-payment progress timeline with delivery stages |
| `checkout` | `<CheckoutCard>` | Order summary with price-lock countdown + pay button |

Loading state: `<SkeletonCarousel>` renders while `searchPending` is true.

---

## 🛠️ Key Design Decisions

### 1. Anthropic MCP beta proxy
```typescript
// src/app/api/chat/route.ts
await client.beta.messages.create({
  betas: ['mcp-client-2025-11-20'],
  mcp_servers: [{ type: 'url', url: 'https://mcp.kapruka.com/mcp', name: 'kapruka' }],
})
```
The Kapruka MCP server IP-allowlists Anthropic and Vercel. Routing through Anthropic's infrastructure means the app works from **any environment** — local dev, CI, or production.

### 2. Static Zod schemas for Gemini
```typescript
// src/lib/gemini-route.ts
const tools = await mcpClient.tools({ schemas: KAPRUKA_SCHEMAS })
```
Gemini rejects dynamically-discovered tool schemas. Explicit Zod schemas bypass discovery while the MCP client still executes the real tools.

### 3. Structured JSON protocol
The system prompt instructs every AI model to respond **only** with valid JSON matching `EngineResponse`. `parseClaudeResponse` handles code-fence wrapping and normalises MCP price objects `{ amount, currency }` into plain numbers.

### 4. Client-only rendering (`ssr: false`)
The App component is loaded via `next/dynamic` with `ssr: false` to prevent React hydration mismatches — a chat interface has zero SEO benefit from server rendering.

### 5. localStorage cart persistence
Cart state lives in `localStorage` under `kapri_cart`. On every `send()` the full cart is serialised into the API request body, then injected into the system prompt — so the model always has authoritative cart context.

---

## 💻 Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 14.2 |
| Language | TypeScript | 5 |
| UI | React | 18.3 |
| AI — Primary | `@anthropic-ai/sdk` | 0.102 |
| AI — Fallback | `ai` + `@ai-sdk/google` | 6.0 |
| MCP Client | `@ai-sdk/mcp` | 1.0 |
| Schema Validation | Zod | 3.25 |
| Order Storage | `@vercel/kv` | 3.0 |
| Hosting | Vercel | — |

---

## 🎨 Brand System

| Token | Value | Use |
|---|---|---|
| Purple 700 | `#442A73` | Primary brand, headers, user bubbles |
| Yellow 400 | `#F9DB09` | CTAs, accents, season banner |
| Surface | `#F6F4FA` | App background |
| Ink | `#1B1230` | Body text |
| Success | `#1F9D57` | Delivery available, order confirmed |
| Warning | `#D98A00` | Perishable item notice |
| Error | `#D63B3B` | Delivery unavailable, order error |

---

## 📂 Project Layout

```
kapri/
├── src/
│   ├── app/
│   │   ├── page.tsx                      # Dynamic import (ssr:false) + branded loader
│   │   ├── layout.tsx                    # HTML shell, Inter + Noto Sans Sinhala fonts
│   │   ├── globals.css                   # Design tokens, animations, scrollbar styles
│   │   └── api/
│   │       ├── chat/route.ts             # 3-tier AI routing (Claude → Gemini → Engine)
│   │       ├── product-image/route.ts    # og:image proxy with in-memory cache
│   │       └── orders/
│   │           ├── route.ts              # POST: save order to Vercel KV
│   │           └── [number]/route.ts     # GET: fetch order by VIMP number
│   │
│   ├── components/
│   │   ├── App.tsx                       # Root orchestration: state, send(), renderCard()
│   │   ├── EmptyState.tsx                # Welcome screen with category/occasion carousels
│   │   │
│   │   ├── cards/                        # Generative UI — every tool result renders here
│   │   │   ├── ProductCard.tsx           # Single product tile (image, price, add-to-cart)
│   │   │   ├── ProductCarousel.tsx       # Horizontal scroll grid of ProductCards
│   │   │   ├── ProductDetail.tsx         # Full-screen product overlay with variants
│   │   │   ├── BundleCard.tsx            # AI gift bundle (cake + flowers + card)
│   │   │   ├── DeliveryStatus.tsx        # Delivery validation result card
│   │   │   ├── CheckoutCard.tsx          # Order summary before payment
│   │   │   ├── OrderTracker.tsx          # Post-payment progress timeline
│   │   │   └── SkeletonCarousel.tsx      # Loading shimmer state
│   │   │
│   │   ├── overlays/                     # Full-screen modal flows
│   │   │   ├── CartDrawer.tsx            # Slide-in cart with quantity controls
│   │   │   ├── CheckoutFlow.tsx          # Multi-step checkout (recipient → delivery → gift)
│   │   │   └── PaymentSheet.tsx          # Pay link + price-lock countdown
│   │   │
│   │   └── ui/                           # Reusable primitives
│   │       ├── Header.tsx                # Logo, language toggle, cart badge
│   │       ├── Bubbles.tsx               # UserBubble, KapriRow, KapriText, Typing
│   │       ├── Chip.tsx                  # Quick-reply suggestion chips
│   │       ├── Composer.tsx              # Message input + voice button
│   │       ├── Icons.tsx                 # Hand-crafted SVG icon set (30+ icons)
│   │       └── SeasonBanner.tsx          # Occasion-aware seasonal greeting bar
│   │
│   └── lib/
│       ├── types.ts                      # All TypeScript interfaces
│       ├── data.ts                       # CATALOG, BUNDLES, CATEGORIES, OCCASIONS, SEASON
│       ├── system-prompt.ts              # Cart-aware dynamic system prompt builder
│       ├── parse-mcp-response.ts         # Claude JSON extractor + price normaliser
│       ├── gemini-route.ts               # Tier-2 Gemini handler (static schemas + unwrap)
│       ├── engine.ts                     # Tier-3 scripted engine (keyword rules)
│       └── db.ts                         # Vercel KV helpers (save/get orders)
│
├── public/
│   └── kapruka-logo.jpg                  # Brand logo
├── next.config.mjs
├── tsconfig.json
├── .env.local.example
└── package.json
```

---

## 🏆 Rubric Coverage (100 pts)

| Category | Pts | How Kapri scores |
|---|---|---|
| **Experience & Polish** | 30 | Full-screen app shell; optimistic message UI; skeleton loaders; mobile-first (380px); localStorage state sync; no layout shift; smooth card transitions; safe-area insets |
| **Visual Richness** | 20 | Zero raw-text product lists — every result is a `<ProductCarousel>`, `<BundleCard>`, `<DeliveryStatus>`, or `<OrderTracker>` generative component |
| **Personality** | 15 | Named "Kapri"; warm, proactive Sri Lankan voice; seasonal occasion awareness (Avurudu, Poya, birthdays, anniversaries) |
| **Usefulness** | 15 | Budget parsing (`max_price`); vague-intent clarification; delivery validation with perishable warnings; Sinhala city name aliases |
| **End-to-end completeness** | 15 | Discovery → cart → delivery check → checkout form → `kapruka_create_order` → real pay link → order tracking |
| **Creativity** | 5 | AI Gift Bundle Builder; Sinhala voice input (`si-LK`); gift message AI-enhancer in EN + Sinhala |
| **Total** | **100** | |

### Bonus Features

| Bonus | Status |
|---|---|
| Multi-item cart | ✅ Persistent cart, quantity controls, header badge |
| Delivery-date constraints | ✅ Calendar widget + `check_delivery` + perishable rules |
| Gift messaging | ✅ Free-text + AI "Enhance" rewrite (English + Sinhala) |
| Tanglish conversation | ✅ Model detects and responds in mixed Sinhala-English |
| Sinhala language | ✅ Voice input (`si-LK`), Sinhala city aliases, Sinhala responses |

---

## 🧪 Try These Prompts

| Language | Prompt |
|---|---|
| English | `I need a gift for my mother, under Rs. 5,000` |
| Tanglish | `Mata ammata cake ekak gannako — Colombo ekata` |
| Tanglish | `Avurudu hamper bundle ekak hadanna under Rs. 8,000` |
| Sinhala | `අම්මට තෑග්ගක් — රු. 5000ට අඩුවෙන්` |
| Tracking | `Track my order VIMP34456CB2` |
| Voice | tap 🎤 and speak in Sinhala or English |

---

## 🚀 Running Locally

### Prerequisites
- **Node.js 18.18+** (Node 20 LTS recommended)
- **Anthropic API key** → [console.anthropic.com](https://console.anthropic.com) *(or Google AI key as fallback)*

### Setup
```bash
# 1. Clone
git clone https://github.com/LasaKaru/kapri.git
cd kapri

# 2. Install
npm install

# 3. Configure
cp .env.local.example .env.local
```

Edit `.env.local`:
```bash
# Primary (recommended) — server-side only
ANTHROPIC_API_KEY=sk-ant-api03-...

# Fallback (optional) — activates if Anthropic key is absent
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# Kapruka MCP endpoint (public, no auth required)
KAPRUKA_MCP_URL=https://mcp.kapruka.com/mcp
```

```bash
# 4. Run
npm run dev          # → http://localhost:3000
```

The app works **without any API key** (Tier 3 scripted engine). For live Kapruka data, add `ANTHROPIC_API_KEY`.

---

## ☁️ Deploying to Vercel

1. Push the repo and import at [vercel.com/new](https://vercel.com/new).
2. Add environment variables (**Production + Preview**):

   | Variable | Required | Notes |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | Primary | Best Sinhala + tool reliability |
   | `GOOGLE_GENERATIVE_AI_API_KEY` | Fallback | Activates if Anthropic key is absent or fails |
   | `KAPRUKA_MCP_URL` | Optional | Defaults to `https://mcp.kapruka.com/mcp` |

3. Deploy → smoke test on a phone at **380px**: empty state → search → add to cart → checkout.

---

## 🛡️ Responsible Use

The Kapruka MCP creates **real guest-checkout orders**. Kapri:
- Never spams `kapruka_create_order` — the limit is **30 orders/hour/IP**.
- Stops at the **pay link** — payment is completed by the user in the browser.
- Respects the **60 requests/min** rate limit across all tools.

**Important:** Do not complete real payments during development. Stop at the checkout URL.

---

## ❓ FAQ

**Q: Why does order tracking show a demo order when I track a real Kapruka number (like VIMP27778)?**

This is a prototype not connected to Kapruka's private internal database. Here's what happens:

1. The app checks **Vercel KV** for orders placed inside this demo.
2. If not found (because `VIMP27778` is a real Kapruka order from the outside world), it returns `null`.
3. Rather than showing "Order Not Found", the app falls back to a `DEMO_ORDER` template so you can see the tracking UI.
4. It dynamically replaces the order number with yours so it feels realistic.
5. When Kapruka provides a real tracking API, we can swap the KV call in `OrderTracker.tsx`.

---

## 📋 Changelog

### v1.0 — Kapruka Agent Challenge Entry

#### ✨ Core AI & Architecture
- **Agentic Chat Engine:** Full-screen, generative UI shopping agent connected to the Kapruka MCP.
- **3-Tier AI Fallback:** Anthropic → Gemini → Scripted Engine, ensuring 100% uptime.
- **Multi-lingual System Prompt:** Understands and responds in Sinhala, English, and Tanglish.
- **Vercel KV Integration:** Redis-backed order storage for tracking demo orders.
- **Client-Only Rendering:** `next/dynamic` with `ssr: false` eliminates hydration mismatches.

#### 🛍️ Shopping & Discovery
- **Generative UI Cards:** `<ProductCarousel>`, `<BundleCard>`, `<ProductDetail>` with images, pricing, and stock badges.
- **Persistent Cart:** localStorage-backed multi-item cart with slide-out drawer and quantity controls.
- **Voice Input:** Web Speech API with `si-LK` locale for Sinhala voice commands.
- **Category & Occasion Carousels:** Touch-friendly, horizontally scrolling image rows with swipe buttons.
- **Seasonal Awareness:** Auto-detects Avurudu, Wesak, Poson, Deepavali, Christmas, Valentine's Day.

#### 🚚 Checkout & Delivery
- **Multi-Step Checkout:** Accordion overlay — Recipient → Delivery → Sender → Gift Message.
- **Smart Delivery Validation:** City autocomplete, flat-fee display, 2-day lead time for remote areas.
- **Perishable Warnings:** Auto-flags fresh cakes/flowers with delivery reminders.
- **Form Validation:** Real-time regex validation for Sri Lankan mobile numbers (`07X` / `+947X`), address length, and required fields.

#### 🎁 Post-Purchase
- **AI Gift Message Enhancer:** "Magic wand" rewrites messages in Warm, Witty, or Formal tones (EN + Sinhala).
- **Order Tracking Timeline:** Visual progress tracker with delivery stage indicators.
- **Graceful Tracking Fallback:** Shows realistic demo data when tracking external orders.

---

## 📜 License

MIT — competition entry, open-sourced for the Sri Lankan dev community.
