# Kapruka MCP — Integration Reference

Complete reference for the **Kapruka MCP server** as used by the Kapri app:
every tool, its parameters, real request/response samples (both `markdown`
and `json`), error shapes, rate limits, and exactly how each tool maps into
the app's UI. Use this when extending the app or debugging the integration.

> All sample responses below were captured live from the production server
> on 2026-06-11. Catalog data (prices, stock) changes over time.

---

## 1. Connection

| | |
|---|---|
| **Endpoint** | `https://mcp.kapruka.com/mcp` |
| **Transport** | Streamable HTTP (also accepts SSE) |
| **Auth** | None (free public tier) |
| **Protocol** | MCP `2025-03-26` |
| **Server** | `kapruka_mcp` v1.27.0 |

### Minimal client config

```json
{
  "mcpServers": {
    "kapruka": { "url": "https://mcp.kapruka.com/mcp" }
  }
}
```

### How the app connects (two tiers)

The app reaches the same server through two different code paths, depending on
which API key is configured (see `src/app/api/chat/route.ts`):

| Tier | When | How it talks to Kapruka | File |
|---|---|---|---|
| **Tier 1 — Anthropic** | `ANTHROPIC_API_KEY` set | Anthropic's **MCP connector** proxies the calls server-side (beta `mcp-client-2025-11-20`). Works from any IP. | `src/app/api/chat/route.ts` → `callAnthropic` |
| **Tier 2 — Gemini** | `GOOGLE_GENERATIVE_AI_API_KEY` set | `@ai-sdk/mcp` opens a **direct HTTP** connection from the server. | `src/lib/gemini-route.ts` → `callGemini` |
| **Tier 3 — Scripted** | no key | No MCP; offline catalog in `src/lib/data.ts`. | `src/lib/engine.ts` |

> ⚠️ **Tier 1 client IP:** with the Anthropic connector, Kapruka sees
> *Anthropic's* egress IP, not the end user's — so the per-IP rate limits below
> are shared across all Anthropic MCP traffic. Tier 2 uses the deployment's
> (e.g. Vercel) server IP. Neither tier exposes the end user's IP to Kapruka.

---

## 2. Calling convention — the `params` wrapper (critical)

The server is built on FastMCP/Pydantic and declares **every** tool with a
single required object argument named `params`. Tool arguments **must** be
wrapped:

```jsonc
// ✅ correct — arguments nested under "params"
{ "name": "kapruka_search_products",
  "arguments": { "params": { "q": "chocolate cake", "limit": 3, "response_format": "json" } } }

// ❌ wrong — flat arguments → validation error
{ "name": "kapruka_search_products",
  "arguments": { "q": "chocolate cake", "limit": 3 } }
```

Flat arguments fail with:

```json
{ "content": [{ "type": "text", "text":
  "Error executing tool kapruka_search_products: 1 validation error for kapruka_search_productsArguments\nparams\n  Field required [type=missing, ...]" }],
  "isError": true }
```

This is why `src/lib/gemini-route.ts` wraps every Zod schema in a `params`
object. The Tier 1 Anthropic connector handles this from the live tool schema
automatically.

**`response_format`** — every tool takes `"markdown"` (default) or `"json"`.
The app always requests `"json"` so it can build UI cards. Pass it *inside*
`params`.

---

## 3. Rate limits & caching (free tier)

| Limit | Value |
|---|---|
| Requests / minute / client IP (all tools) | **60** |
| `kapruka_create_order` / hour / client IP | **30** (on top of the per-minute cap) |
| Server-side read cache (product/category reads) | up to **30 min** |
| Write endpoints (`create_order`) | never cached |
| Cart size | 1–30 items, qty 1–99 each |
| Checkout link lifetime | **60 min**, prices locked |

Standard `RateLimit-*` headers are on every response:

```
ratelimit-limit: 60
ratelimit-remaining: 59
ratelimit-reset: 60
```

On `429`, back off until `ratelimit-reset` seconds elapse. **App guidance:**
Tier 1 already sets a 120 s client timeout + 1 retry and falls through to
Tier 2/3 on failure; if you add direct calls, read `ratelimit-remaining` and
degrade gracefully (the scripted engine in `engine.ts` is the always-on
fallback).

---

## 4. Tools

Seven tools. For each: parameters, a real request, and the live response in
both `markdown` and `json`.

---

### 4.1 `kapruka_search_products` 🔍

Search the catalog by keyword. Cursor-paginated (capped at 3 pages/query).
Query must be ≥ 3 chars and contain non-stopword terms.

| Param | Type | Default | Notes |
|---|---|---|---|
| `q` | string (3–200) | — | **required**. e.g. `"birthday cake"` |
| `category` | string | null | e.g. `"cakes"`, `"Flowers"` (case-insensitive) |
| `min_price` / `max_price` | number | null | in `currency` |
| `in_stock_only` | bool | false | |
| `sort` | enum | `relevance` | `relevance` \| `price_asc` \| `price_desc` \| `newest` \| `bestseller` |
| `limit` | int (1–50) | 10 | app uses **8** for carousels |
| `cursor` | string | null | from a previous `next_cursor` |
| `currency` | string | LKR | LKR, USD, GBP, AUD, CAD, EUR |
| `include_stubs` | bool | false | include CATSYM category landing pages |
| `response_format` | string | markdown | |

**Request**

```json
{ "name": "kapruka_search_products",
  "arguments": { "params": {
    "q": "chocolate cake", "max_price": 8000, "limit": 3, "response_format": "json" } } }
```

**Response — `json`**

```json
{
  "results": [
    {
      "id": "CAKE00KA002078",
      "name": "Pastel Love Chocolate Cake",
      "summary": "cakes - Kaprukacakes, Chocolate, ... The Pastel Love Chocolate Cake Is A Delightful Treat...",
      "price": { "amount": 6200, "currency": "LKR" },
      "compare_at_price": null,
      "in_stock": true,
      "stock_level": "low",
      "image_url": "https://static2.kapruka.com/product-image/width=330,quality=93,f=auto/shops/cakes/productImages/zoom/1769072608591_dsc06638.jpg",
      "category": { "id": "cat_general", "name": "General", "slug": "general" },
      "rating": null,
      "ships_internationally": true,
      "url": "https://www.kapruka.com/buyonline/pastel-love-chocolate-cake/kid/cake00ka002078"
    }
    // ... more results
  ],
  "next_cursor": "eyJ1IjoiTXc9PSIsInAiOjJ9",
  "applied_filters": { "q": "chocolate cake", "limit": 3, "max_price": 8000 }
}
```

**Response — `markdown`**

```markdown
## Kapruka search: "chocolate cake"
Showing 3 results (LKR)

**1. Pastel Love Chocolate Cake**
   ID: `CAKE00KA002078` · LKR 6,200 · In stock (low) · ships internationally
   [View product](https://www.kapruka.com/buyonline/pastel-love-chocolate-cake/kid/cake00ka002078)
...
*More results available. Pass `cursor="eyJ1IjoiTXc9PSIsInAiOjJ9"` for the next page.*
```

**Empty result** (note: search relevance varies — `"chocolate cake"` returns
hits but `"birthday cake"` may not):

```json
{ "result": "No products found for 'birthday cake'." }
```

**App mapping:** → `carousel` card. Each result maps to a `Product`
(`id`, `name`, `summary`, `price.amount`→`price`, `image_url`→`img`,
`in_stock`→`inStock`, `stock_level==="low"`→`low`). See
`parse-mcp-response.ts` → carousel normalisation.

---

### 4.2 `kapruka_get_product` 📦

Full details for one product by ID.

| Param | Type | Default | Notes |
|---|---|---|---|
| `product_id` | string (3–80) | — | **required**. e.g. `"CAKE00KA002078"` |
| `currency` | string | LKR | |
| `type` | string | null | rare hint, e.g. `"specialgifts"` |
| `response_format` | string | markdown | |

> IDs starting with `CATSYM` are category landing pages, not purchasable — the
> tool flags those.

**Request**

```json
{ "name": "kapruka_get_product",
  "arguments": { "params": { "product_id": "CAKE00KA002078", "response_format": "json" } } }
```

**Response — `json`** (truncated)

```json
{
  "id": "cake00KA002078",
  "name": "Pastel Love Chocolate Cake",
  "description": "CAKE00KA002078 Weight: 2.77 Lbs (1.25 KG) ... soft blue with pink heart decorations ...",
  "summary": "CAKE00KA002078 Weight: 2.77 Lbs ...",
  "price": { "amount": 6200, "currency": "LKR" },
  "compare_at_price": null,
  "in_stock": true,
  "stock_level": "low",
  "category": { "id": "cat_cakes", "name": "cakes", "slug": "cakes", "path": "cakes" },
  "variants": [
    { "id": "cake00KA002078_default", "name": "Default", "sku": "cake00KA002078",
      "price": { "amount": 6200, "currency": "LKR" }, "in_stock": true,
      "stock_level": "low", "attributes": { "weight": "2.77" } }
  ],
  "images": [
    "https://www.kapruka.com/shops/cakes/productImages/zoom/1769072608591_dsc06638.jpg",
    "https://www.kapruka.com/shops/specialGifts/additionalImages/cake00ka002078_1.jpg"
  ],
  "attributes": { "type": "cakes", "subtype": "Cakes", "weight": "2.77", "vendor": "Kapruka Cakes Cake" },
  "shipping": { "ships_from": "LK", "ships_internationally": true, "restricted_countries": [] },
  "rating": null,
  "url": "https://www.kapruka.com/buyonline/pastel-love-chocolate-cake/kid/cake00ka002078"
}
```

**Response — `markdown`**

```markdown
## Pastel Love Chocolate Cake
**ID**: `cake00KA002078`
**Price**: LKR 6,200
**Stock**: In stock (low)
**Category**: cakes
**Vendor**: Kapruka Cakes Cake
**Weight**: 2.77 lbs
**International shipping**: Yes
...
[View on Kapruka](https://www.kapruka.com/buyonline/pastel-love-chocolate-cake/kid/cake00ka002078)
```

**App mapping:** → single-item `carousel` card (the app reuses the carousel
renderer for detail requests).

**Gotchas:** `rating` is always `null` (never show stars). For cakes,
`stock_level: "low"` is normal (made-to-order) — don't warn about it. The `id`
casing from this endpoint may differ (`cake00KA...`) but is case-insensitive.

---

### 4.3 `kapruka_list_categories` 🗂️

Top-level category names + browse URLs. Cached 30 min. (66 categories at time
of writing.)

| Param | Type | Default | Notes |
|---|---|---|---|
| `depth` | int (1–2) | 1 | sub-category levels |
| `response_format` | string | markdown | |

**Request**

```json
{ "name": "kapruka_list_categories",
  "arguments": { "params": { "depth": 1, "response_format": "json" } } }
```

**Response — `json`** (truncated)

```json
{
  "categories": [
    { "name": "Automobile", "url": "https://www.kapruka.com/online/automobile" },
    { "name": "Chocolates", "url": "https://www.kapruka.com/online/chocolates" },
    { "name": "cakes", "url": "https://www.kapruka.com/online/cakes" },
    { "name": "flowers", "url": "https://www.kapruka.com/online/flowers" }
    // ... 66 total
  ]
}
```

**Response — `markdown`**

```markdown
## Kapruka Categories

- [Automobile](https://www.kapruka.com/online/automobile)
- [Chocolates](https://www.kapruka.com/online/chocolates)
- [cakes](https://www.kapruka.com/online/cakes)
- [flowers](https://www.kapruka.com/online/flowers)
...
```

**Useful category names** (pass verbatim as the `category` filter on search):
`cakes`, `flowers`, `Chocolates`, `Giftset`, `Softtoy`, `combopack`,
`Perfumes`, `Jewellery`, `Cosmetics`, `Electronic`, plus occasions
`birthday`, `anniversary`, `mother`, `wedding`, `graduation`, `valentine`,
`christmas`.

**App mapping:** → no card; the model replies conversationally (`card: null`).

---

### 4.4 `kapruka_list_delivery_cities` 📍

Search deliverable cities by canonical name or vernacular alias. Always pass a
`query`.

| Param | Type | Default | Notes |
|---|---|---|---|
| `query` | string (≤50) | null | partial match on name/aliases |
| `limit` | int (1–50) | 25 | |
| `response_format` | string | markdown | |

**Request**

```json
{ "name": "kapruka_list_delivery_cities",
  "arguments": { "params": { "query": "colombo", "limit": 10, "response_format": "json" } } }
```

**Response — `json`**

```json
{
  "cities": [
    { "name": "Colombo 01", "aliases": ["Colombo1"] },
    { "name": "Colombo 03", "aliases": ["Kolpity colpity colombo3"] },
    { "name": "Colombo 06", "aliases": ["wellawatta walawtha wellawatha colombo6"] }
  ],
  "total_matched": 15,
  "showing": 10
}
```

**Response — `markdown`** (query `"kandy"`)

```markdown
## Kapruka delivery cities — 'kandy' (1 of 1)

- **Kandy**  _aliases: galagedara_
```

**App mapping:** → no card; the model lists matches in text (`card: null`).
Use the **canonical `name`** (e.g. `"Colombo 03"`) as the `city` arg for
`check_delivery` and `create_order`.

---

### 4.5 `kapruka_check_delivery` 🚚

Check deliverability + flat rate (LKR) for a city/date. Single flat rate per
order regardless of item count.

| Param | Type | Default | Notes |
|---|---|---|---|
| `city` | string (2–100) | — | **required**, canonical name |
| `delivery_date` | string `YYYY-MM-DD` | today (LK) | |
| `product_id` | string | null | enables a perishable warning for CAKE*/FLOWER*/COMBO* |
| `response_format` | string | markdown | |

**Request**

```json
{ "name": "kapruka_check_delivery",
  "arguments": { "params": {
    "city": "Galle", "delivery_date": "2026-06-15",
    "product_id": "CAKE00KA002078", "response_format": "json" } } }
```

**Response — `json` (available)**

```json
{
  "city": "Galle",
  "now": "2026-06-11T07:44:33+05:30",
  "checked_date": "2026-06-15",
  "available": true,
  "rate": 1090,
  "currency": "LKR",
  "reason": null,
  "next_available_date": null,
  "perishable_warning": "Product CAKE00KA002078 looks like a perishable item (cake/flower/combo). Same-day or next-day delivery is recommended; freshness on 2026-06-15 is not guaranteed."
}
```

**Response — `json` (NOT available — slots full)**

```json
{
  "city": "Colombo 03",
  "now": "2026-06-11T07:44:33+05:30",
  "checked_date": "2026-06-11",
  "available": false,
  "reason": "We've scheduled your delivery for tomorrow (12 / June). Today's slots for Colombo 03 are full",
  "next_available_date": "2026-06-12",
  "rate": 300,
  "currency": "LKR",
  "perishable_warning": null
}
```

**Response — `markdown`**

```markdown
## Delivery to Galle on 2026-06-15
**Available** — flat rate LKR 1,090

Note: Product `CAKE00KA002078` looks like a perishable item (cake/flower/combo).
Same-day or next-day delivery is recommended; freshness on 2026-06-15 is not guaranteed.
```

**Sample flat rates:** Colombo zones 300 · Galle 1,090 (rates vary by city).

**App mapping:** → `delivery` card:
`city`, `rate`, `available`, `reason`, `next_available_date`→`nextDate`,
`perishable_warning`→`perishableWarning`. The perishable warning is **advisory
only** — `available:true` still means it can be delivered.

---

### 4.6 `kapruka_create_order` 🛒

Create a **guest-checkout** order; returns a click-to-pay URL. No account
needed. Prices locked 60 min. **30 calls/hour/IP.** A fresh idempotency key is
generated per call (retries on transient errors return the same URL).

**Params** (all under `params`):

| Field | Type | Notes |
|---|---|---|
| `cart` | array (1–30) | each: `product_id` (req), `quantity` (1–99, default 1), `icing_text` (cakes only, ≤120) |
| `recipient` | object | `name` (req), `phone` (req — `077...` or `+9477...`) |
| `delivery` | object | `address` (req, ≥3), `city` (req, canonical), `date` (req, `YYYY-MM-DD`, today+), `location_type` (`house`\|`apartment`\|`office`\|`other`, default `house`), `instructions` (≤250) |
| `sender` | object | `name` (req), `anonymous` (bool, default false) |
| `gift_message` | string | ≤300 |
| `currency` | string | LKR (default), USD, GBP, AUD, CAD, EUR |
| `response_format` | string | markdown |

> ⚠️ **`additionalProperties: false`** — the server **rejects unknown fields**.
> Do **not** send `recipient.email`, `sender.phone`, `sender.email`, or
> `delivery.type` (the field is `location_type`). This was a real bug fixed in
> the app.

**Request**

```json
{ "name": "kapruka_create_order",
  "arguments": { "params": {
    "cart": [{ "product_id": "CAKE00KA002078", "quantity": 1, "icing_text": "Happy Birthday Nimal" }],
    "recipient": { "name": "Nimal Perera", "phone": "0771234567" },
    "delivery": { "address": "45 Galle Road", "city": "Colombo 03",
                  "date": "2026-06-15", "location_type": "house" },
    "sender": { "name": "Saman", "anonymous": false },
    "gift_message": "Happy Birthday machan!",
    "currency": "LKR", "response_format": "json" } } }
```

**Response — `json`**

```json
{
  "summary": {
    "items_total": 6340,
    "delivery_fee": 300,
    "addons_total": 0,
    "currency": "LKR",
    "grand_total": 6640
  },
  "checkout_url": "https://www.kapruka.com/tools/continue_order.jsp?id=VFOD08KM3GJA",
  "expires_at": "2026-06-10T18:47:56+05:30",
  "order_ref": "ORD-20260610-3GJA"
}
```

**Response — `markdown`**

```markdown
## Order created — `ORD-20260611-OS9N`

**Grand total:** LKR 6,640

| | |
|---|---|
| Items | LKR 6,340 |
| Delivery | LKR 300 |

**[Open checkout to pay](https://www.kapruka.com/tools/continue_order.jsp?id=IDMO5P2SOS9N)**

_Checkout link expires at 2026-06-11T08:44:47+05:30. Prices are locked for that window._
```

> Note `items_total` (6,340) ≠ list price (6,200) — Kapruka may add a small
> handling/icing amount. Always trust `summary.grand_total`.

**App mapping:** → `checkout` card (`OrderData`):
`order_ref`→`ref`, `checkout_url`→`url`, `summary.items_total`→`subtotal`,
`summary.delivery_fee`→`rate`, `summary.grand_total`→`total`, plus the
collected recipient/delivery/sender. The `CheckoutCard` "Pay Now on Kapruka"
button opens `url` in a new tab. See `parse-mcp-response.ts` → checkout
normalisation.

**`order_ref` is NOT the tracking number.** After the customer pays in the
browser, Kapruka emails a separate **VIMP…** order number — that is what
`kapruka_track_order` expects.

---

### 4.7 `kapruka_track_order` 📦

Status + timestamped progress for a paid order by its **VIMP** number.

| Param | Type | Default | Notes |
|---|---|---|---|
| `order_number` | string (4–40) | — | **required**, e.g. `"VIMP34456CB2"` (from the confirmation email, **not** `order_ref`) |
| `response_format` | string | markdown | |

**Request**

```json
{ "name": "kapruka_track_order",
  "arguments": { "params": { "order_number": "VIMP34456CB2", "response_format": "json" } } }
```

**Response — `json`** (truncated)

```json
{
  "order_number": "VIMP34456CB2",
  "pnref": "2976049",
  "status": "delivered",
  "status_display": "Delivered",
  "order_date": "Thu May 21 23:49:53 EDT 2026",
  "delivery_date": "23 / MAY / 2026",
  "shipped_date": "23 May 2026 07:47:52 GMT",
  "amount": { "value": "4970", "currency": "LKR" },
  "payment_method": "0000",
  "comments": "Delivery successfully completed.",
  "recipient": { "name": "NETHMI HEMASOORIYA", "phone": "0716608447", "address": "...", "city": "COLOMBO 08" },
  "greeting_message": "NO PERSONAL MESSAGE",
  "special_instructions": "",
  "progress": [
    { "step": "Order Confirmed and Awaiting preparation", "timestamp": "MAY 22, 2026 9:28 AM" },
    { "step": "Order Received", "timestamp": "May 22, 2026 10:19 AM" },
    { "step": "Kapruka Warehouse, Order is preparing", "timestamp": "MAY 22, 2026 7:07 PM" },
    { "step": "Order has been out for delivery", "timestamp": "MAY 23, 2026 8:43 AM" },
    { "step": "Order has been delivered", "timestamp": "MAY 23, 2026 1:17 PM" }
  ],
  "live_tracking_available": true,
  "has_delivery_video": false,
  "has_delivery_photo": false,
  "items": []
}
```

**Response — `markdown`**

```markdown
## Order `VIMP34456CB2` — Delivered

| | |
|---|---|
| Total | {'value': '4970', 'currency': 'LKR'} |
| Payment | 0000 |
| Ordered | Thu May 21 23:49:53 EDT 2026 |
| Delivery date | 23 / MAY / 2026 |

**Delivering to**
- NETHMI HEMASOORIYA
- D SILVA MAWATHA, ORION CITY, ..., COLOMBO 08

**Progress**
- MAY 22, 2026 9:28 AM — Order Confirmed and Awaiting preparation
- ...
- MAY 23, 2026 1:17 PM — Order has been delivered

_live tracking available on the Kapruka order page._
```

**Status → progress stage mapping** used by the app (`parse-mcp-response.ts`):

| `status` | UI `stage` |
|---|---|
| `received` | 0 |
| `confirmed` / `processing` / `preparing` | 1 |
| `shipped` / `out-for-delivery` / `dispatched` | 2 |
| `delivered` / `completed` | 3 |

**App mapping:** → enriched `tracker` card:
`order_number`→`number`, `status_display`→`statusDisplay`, `status`→`stage`,
`live_tracking_available`→`live`, `delivery_date`→`deliveryDate`,
`recipient.name`→`recipient`, `amount.value`→`amount`. Rendered by
`OrderTracker`. (Field quirks in raw data: `phone` may have a trailing
`<BR`; `amount` is an object `{value, currency}`; `items` is often `[]`.)

---

## 5. How the app uses MCP — card contract

The Tier 1 model is instructed (in `src/lib/system-prompt.ts`) to reply with
**JSON only**, calling MCP tools and shaping results into a card. The route
reads the **last** text block (tool turns interleave preamble + tool calls +
final answer) and `parse-mcp-response.ts` normalises it.

```jsonc
{
  "text": "short natural-language reply (user's language)",
  "lang": "en | si | tl",
  "card": null | <one of the shapes below>,
  "chips": ["quick reply 1", "quick reply 2"]
}
```

| Tool called | Card type | Rendered by |
|---|---|---|
| `search_products`, `get_product` | `carousel` | `ProductCarousel` / `ProductCard` |
| `list_categories` | `null` (text) | — |
| `list_delivery_cities` | `null` (text) | — |
| `check_delivery` | `delivery` | `DeliveryStatus` |
| `create_order` | `checkout` | `CheckoutCard` (Pay button → real `checkout_url`) |
| `track_order` | `tracker` | `OrderTracker` |

Card TypeScript shapes live in `src/lib/types.ts` (`CardData`).

### 5.1 The "Split-Brain" English-Only Rule
Regardless of what language the user is speaking (Sinhala, Tanglish, or English), the AI model is strictly instructed to **always translate the user's intent into clean English search terms** before calling Kapruka tools.
For example, if the user says "උපන් දින කේක්" (Sinhala for birthday cake), the AI will call `kapruka_search_products(q: "birthday cake")`. This "Split-Brain" Translation architecture ensures 100% reliability with the Kapruka database, which is primarily in English.

### Request shape the app POSTs to `/api/chat`

```json
{
  "messages": [{ "role": "user", "text": "Show me chocolate cakes" }],
  "cart": [{ "p": { "id": "CAKE00KA002078", "name": "...", "price": 6200 }, "qty": 1 }],
  "lastVimp": "VIMP34456CB2"
}
```

> Note the history field is **`text`**, not `content`.

---

## 6. Reliability notes (learned the hard way)

1. **Disable parallel tool use.** The Kapruka MCP session deadlocks when the
   model fires two tool calls in one response — one call hangs until the
   connector's **300 s** timeout (`"Timed out while waiting for response to
   ClientRequest"`). The app sets
   `tool_choice: { type: 'auto', disable_parallel_tool_use: true }`. Always do
   this for multi-tool flows (city lookup → delivery check → order).
2. **Read the last text block, not the first.** MCP tool turns return multiple
   `text` blocks; `.find()` grabs the preamble ("Let me check…") and drops the
   answer. Use the **last** one.
3. **Handle `pause_turn`.** The server-side MCP loop pauses after ~10
   iterations; re-send with the assistant turn appended to resume.
4. **Stream + timeout.** Use `messages.stream().finalMessage()` with a client
   timeout so a stuck Tier-1 call fails over to Tier 2/3 instead of hanging.
5. **`additionalProperties: false`** on `create_order` — never send fields not
   in the schema (no emails, no `delivery.type`).

---

## 7. Known gaps / future work

- **UI checkout form** *(now wired to MCP)* — `CheckoutFlow.place()` POSTs to
  **`/api/orders/create`** (`src/app/api/orders/create/route.ts`), which calls
  `kapruka_create_order` via the raw-MCP helper `src/lib/kapruka-mcp.ts` and
  returns the real `checkout_url`. The resulting `checkout` card opens the live
  pay link; the simulated `PaymentSheet` is skipped when `order.url` is present.
  If the order can't be placed (genuine network/rate-limit failure), the form
  falls back to the original client-side simulation so the demo never breaks.
  - Caveat: the Kapruka server is lenient about unknown `product_id`s, so a
    cart built from the **offline** Tier-3 catalog (`CAKE-2291`-style IDs) may
    still produce an order. Prefer carts whose items came from live MCP search.
  - Bare `"Colombo"` from the form's offline city list is mapped to
    `"Colombo 03"` before the call (it isn't a canonical Kapruka city).
- **`track_order` items** are usually `[]` from the server, so the tracker
  card's item list falls back to placeholder data.
- **Tier 2 (Gemini)** schemas were aligned to the `params` wrapper but require
  a `GOOGLE_GENERATIVE_AI_API_KEY` to exercise end-to-end.

---

## 8. Quick raw-HTTP test (no SDK)

```bash
# 1. initialize → capture mcp-session-id from response headers
SID=$(curl -s -D - -o /dev/null -X POST https://mcp.kapruka.com/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}' \
  | grep -i mcp-session-id | tr -d '\r' | awk '{print $2}')

# 2. send initialized notification
curl -s -X POST https://mcp.kapruka.com/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -H "mcp-session-id: $SID" \
  -d '{"jsonrpc":"2.0","method":"notifications/initialized"}' -o /dev/null

# 3. call a tool (note the params wrapper)
curl -s -X POST https://mcp.kapruka.com/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -H "mcp-session-id: $SID" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"kapruka_search_products","arguments":{"params":{"q":"chocolate cake","limit":2,"response_format":"json"}}}}'
```

Responses stream back as `event: message` SSE lines; the JSON payload is in
each `data:` line.
