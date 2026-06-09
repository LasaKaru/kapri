# Kapruka Design System

A brand & UI design system for **Kapruka** — Sri Lanka's largest e-commerce and gifting
platform — and **Kapri (කාප්‍රි)**, its full-screen, multilingual AI shopping concierge.

This system captures the royal-purple-and-yellow brand, the generative-UI chat surface, and
the reusable primitives needed to design new Kapruka product screens, prototypes, decks, and
marketing without re-deriving the look from scratch.

---

## Sources

Everything here was reverse-engineered from real product code, not guesswork. Explore these
to go deeper:

- **GitHub — `LasaKaru/Kapruka-Agent-Challenge`**
  <https://github.com/LasaKaru/Kapruka-Agent-Challenge>
  Next.js 16 / React 19 implementation of *Kapri*, the AI shopping concierge. Brand tokens
  live in `tailwind.config.ts` and `src/app/globals.css`; the generative-UI components live
  in `src/components/gen-ui/`. The `CLAUDE.md` and `README.md` in that repo are the canonical
  brand & behaviour contract — read them if you want the original tone and the "golden rules."
- **Logo** — supplied by the user (`assets/kapruka-logo.jpg`), plus a vector recreation
  (`assets/kapruka-logo.svg`).
- **Live platform** — the public Kapruka MCP server (`mcp.kapruka.com/mcp`) powers the real
  catalog, delivery quotes and guest checkout that Kapri shops against.

> The reader is not assumed to have access to the private repo or MCP — but the URLs are
> recorded so anyone who does can build with higher fidelity.

---

## What Kapruka is

Kapruka is Sri Lanka's #1 online store and gifting service — cakes, flowers, chocolates,
hampers, electronics, jewellery and more, delivered to any city on the island. The name
*Kapruka* (කප්රුක) refers to the mythical wish-fulfilling tree — "the tree that gives you
everything you ask for." That metaphor is the soul of the brand: **you ask, it delivers.**

**Kapri** is the brand's AI shopping concierge — not a chat widget in a corner, but a
*full-window conversational storefront*. It speaks the way Sri Lankans actually shop:
**English, සිංහල (Sinhala script), and Tanglish** (romanised Sinhala — e.g. *"Mata ammata
cake ekak gannako — Colombo ekata"*). Every answer is a rich **generative-UI component**
(product carousels, delivery cards, checkout, order trackers) — never a wall of text.

### Products / surfaces represented here
1. **Kapri — AI Shopping Concierge** (`ui_kits/kapri/`) — the full-screen chat storefront:
   header, empty state, message bubbles, product carousels, delivery + checkout cards,
   cart drawer, order tracker. This is the primary surface.

---

## CONTENT FUNDAMENTALS — how Kapruka writes

The voice is **a knowledgeable Sri Lankan friend who shops Kapruka every day** — warm,
witty, proactive, and never robotic. Persona name: **Kapri (කාප්‍රි)**.

**Address & person.** Second person, friendly — "you", "your mother", "let me check". Kapri
refers to itself as "I" / "me", lightly, never corporate ("we at Kapruka…" is avoided).

**Tone.** Warm and celebratory, with genuine Sri Lankan flavour. It celebrates moments —
*"Bohoma santhosai! 🎉"* on a completed purchase — and is gently reassuring on errors
(*"Ane, small hiccup on my end! Let me try a different route for you."*). It **never says
"I cannot"** — it always offers an alternative path.

**Multilingual mirroring (the signature rule).** Kapri replies in the *same register* the
user wrote in:
- Pure English in → English out: *"I need a gift for my mother, under Rs. 5,000."*
- Sinhala script in → full Sinhala out: *"අම්මට තෑග්ගක් — රු. 5000ට අඩුවෙන්."*
- Tanglish in → Tanglish out, matching their mix ratio: *"Mata me items hoyagaththa!"*

**Casing.** Sentence case everywhere in prose. UPPERCASE is reserved for tiny eyebrow
labels only ("CATEGORIES", "OCCASIONS", "ORDER ITEMS") with wide letter-spacing. The
wordmark *kapruka* is always lowercase.

**Brevity after tools.** After showing products/cards, Kapri writes **one short bridge
sentence** and stops — the card does the talking. It never re-lists product names, prices
or IDs in text.

**Currency & locale.** Prices are always `Rs. 4,500` (formatted `Rs. ${n.toLocaleString('en-LK')}`).
Phone numbers are Sri Lankan (`07x…` / `+947x…`). Dates render as `Sat, 14 Jun 2026`.
Occasion-aware: Avurudu (Sinhala/Tamil New Year ~Apr 13–14), Poya days, Wesak, Mother's Day,
Deepavali, Christmas.

**Emoji.** Yes — used purposefully and sparingly as warmth/wayfinding, not decoration. The
core set: 🛍️ (Kapri's avatar), 🎁 🎂 🌹 🍫 🧺 (categories), 🎉 (celebration), 🔍 (searching),
🇱🇰 (local pride), 💜 (brand love). One or two per message, never a string of them.

**Signature sign-off.** Occasionally closes a key message with *"— Kapri 🛍️"*.

**Words to avoid.** Star ratings/reviews (the catalog has none), "low stock" on cakes
(made-to-order — always in stock), raw error/stack messages, the words "cannot"/"unable".

---

## VISUAL FOUNDATIONS

**Color.** Two-pillar brand: **royal purple `#442A73`** (purple-700) and **electric yellow
`#F9DB09`** (yellow-400), with **white** as the essential third. Purple carries structure —
headers, the app chrome, user message bubbles, primary buttons, prices. Yellow is the
*spark* — reserved for CTAs ("Pay Now"), the cart badge, "LIVE" pills and the Kapri badge;
because it's used sparingly it always pops. A full purple 50→900 and yellow 100→600 scale is
tokenised. Surfaces sit on a faint lilac `#F6F4FA` (purple-50), never pure white-grey.
Status colours — green `#1F9D57`, amber `#D98A00`, red `#D63B3B` — are **functional only**
(delivery available / advisory / unavailable); they never decorate. The brand explicitly
**avoids** orange and green as accents, and never uses blue-purple "AI" gradients.

**Type.** **Inter** for all Latin UI; **Noto Sans Sinhala** for සිංහල script — and the
font stack always lists Inter first then Noto so a single Tanglish string renders each glyph
from the right font. Weights run 400/500/600/700; headings are bold (700) purple, body is
14px ink, meta is 12px muted, micro-labels 10px. Sinhala/Tanglish text gets `line-height: 1.6`
for breathing room. The wordmark itself is a heavy, rounded geometric sans (Trebuchet-like)
— lowercase, tight tracking, with the yellow "u" rendered as a smile arc.

**The wordmark's smile.** *kapruka*'s lowercase "u" is drawn as a yellow upward arc — a
literal smile. It's the brand's most recognisable motif: optimism, gifting, delight.

**Backgrounds.** Flat brand colour fills, not gradients or photos. The app background is the
faint lilac surface; chrome (header, cart header, card headers, checkout header) is solid
purple-700. Product imagery sits inside cards on a purple-50 placeholder. No textures, no
repeating patterns, no hero photography in the chrome — the colour *is* the brand.

**Cards.** White, generously rounded (`--radius-lg` 20px / `rounded-2xl`), hairline
`#E7E3EF` border, and a **purple-tinted** drop shadow (`0 4px 20px rgba(68,42,115,.12)`) —
never a neutral grey shadow. Product cards lift `-3px` on hover and deepen their shadow.
Status cards (delivery) carry a 2px coloured border + soft tinted header.

**Corner radii.** Everything is rounded: chips & ID pills 8px, buttons & inputs 14px, cards
& bubbles 20px, drawers/large surfaces 28px, pills/avatars/badges fully round. Nothing in
the UI has a sharp 0px corner. Message bubbles round all corners *except* the one nearest
their sender (`rounded-tr-sm` for user, `rounded-tl-sm` for Kapri) — a subtle "tail."

**Shadows.** Three-step purple-tinted system (sm `rgba(36,21,68,.06)` → md `.10` → lg `.16`)
plus a warmer product-card variant. Used for lift and focus, never for borders.

**Borders.** Hairline `#E7E3EF` (--line) for subtle separation; 2px purple/green/red for
emphasis on status surfaces. Inputs show a purple border + soft purple focus ring on focus.

**Motion.** Framer-Motion micro-interactions, all *quick and soft* — never bouncy-cartoonish
except the cart badge, which springs in (`stiffness 400, damping 18`). Messages slide in
from their side (user from right `x:16`, Kapri from left `x:-16`) with a spring. Cards
fade-and-scale up (`opacity 0→1, scale .95→1`). The empty-state logo "breathes" (scale
1↔1.04, 3s loop). Skeleton loaders shimmer (1.6s linear). Buttons `active:scale-95` on press.
Easing is ease-out / soft-spring; durations 150–400ms. Reduced-motion should fall back to
the visible end-state.

**Hover & press states.** Primary purple buttons darken to purple-600 on hover; secondary
(outlined) fill purple at 5%; yellow CTAs darken to yellow-500. Cards lift on hover. Chips
gain a purple border + purple-50 fill on hover. **Press** universally shrinks `scale-95`.
Focus is a 2px ring at 20–50% purple opacity, never a default browser outline.

**Transparency & blur.** Used deliberately: the cart-drawer scrim is `black/40` with
`backdrop-blur-sm`; floating pills/badges over product images use `bg-purple-700/80` +
`backdrop-blur-sm` so text stays legible on any photo. Otherwise surfaces are fully opaque.

**Imagery vibe.** Product photography is bright, clean, e-commerce catalog style — true
colour, white/neutral backgrounds, no heavy filters or grain. Warm and inviting, never
moody. Images always live inside rounded cards, object-cover, with a purple-50 fallback.

**Layout rules.** Mobile-first, `100dvh` full-height app shell that never page-scrolls — only
the message list scrolls. Fixed chrome: purple header pinned top, chat input pinned bottom,
cart drawer slides in from the right over a scrim. Content max-widths keep message bubbles at
~82–90% and cards at `max-w-sm`. 4px spacing grid throughout.

---

## ICONOGRAPHY

**Primary icon set: [Lucide](https://lucide.dev)** — the React app imports `lucide-react`
throughout. Outline style, ~2px stroke, rounded line-caps/joins — which pairs naturally with
the brand's rounded geometry. Use Lucide for all functional UI icons. In these design-system
files Lucide is loaded from CDN (`unpkg.com/lucide@latest`) and rendered via
`data-lucide="name"` + `lucide.createIcons()`.

Real icons in use (lucide names): `shopping-cart`, `shopping-bag`, `send`, `mic` / `mic-off`,
`sparkles`, `chevron-left` / `chevron-right` / `chevron-down`, `external-link`, `check` /
`check-circle` / `check-circle-2`, `x` / `x-circle`, `plus`, `minus`, `trash-2`, `truck`,
`package`, `calendar`, `clock`, `map-pin`, `phone`, `camera`, `video`, `gift`,
`alert-triangle`, `refresh-cw`.

**Emoji as iconography.** Emoji are a deliberate second layer — used for *category and
occasion wayfinding* and warmth, where a coloured pictograph reads faster than a line icon:
🎂 Cakes · 🌹 Flowers · 🍫 Chocolates · 🧺 Hampers · 💍 Jewellery · 📱 Electronics · 🧸 Toys ·
🎉 Birthday · 💞 Anniversary · 🎓 Graduation. Kapri's avatar is 🛍️. Use emoji for categories
and celebration; use Lucide for actions and status.

**Logo.** `assets/kapruka-logo.jpg` is the primary brand asset — the purple-background
wordmark with the yellow smile. Because it ships *with* its purple field, it's placed
directly inside purple-700 chrome (the header, the empty-state badge) where it blends
seamlessly. `assets/kapruka-logo.svg` is a vector recreation for when a scalable mark is
needed. Never recolour the smile — it's always brand yellow.

> No custom SVG icon set or icon font is shipped by the product; Lucide + emoji cover
> everything. Don't hand-draw icons — use Lucide names.

---

## Index / manifest

**Root**
- `styles.css` — global entry point (import this); an `@import` manifest only.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills wrapper so this system can be used inside Claude Code.

**`tokens/`** — design tokens, each `@import`ed by `styles.css`
- `colors.css` · `typography.css` · `spacing.css` (spacing + radii + shadows + motion) ·
  `fonts.css` (Inter + Noto Sans Sinhala) · `base.css` (element resets + utilities).

**`assets/`**
- `kapruka-logo.jpg` (primary wordmark) · `kapruka-logo.svg` (vector recreation).

**`guidelines/`** — foundation specimen cards for the Design System tab (Type, Colors,
Spacing, Brand).

**`components/core/`** — reusable React primitives (see each `*.prompt.md`):
- `Button` · `IconButton` · `Badge` · `Chip` · `ProductCard` · `MessageBubble` ·
  `CategoryTile` · `DeliveryStatus`.

**`ui_kits/kapri/`** — the AI Shopping Concierge surface: `index.html` (interactive
click-through) plus per-screen JSX (`AppShell`, `ChatEmptyState`, `ProductCarousel`,
`CheckoutCard`, `OrderTracker`, `CartDrawer`).

**`kapri-app/`** — the **flagship public demo**: a complete, immersive, end-to-end Kapri
shopping experience. Open `kapri-app/index.html`. It composes the brand system into a real
product: multilingual chat (English / සිංහල / Tanglish) with language detection, rich
product carousels, an AI gift-bundle builder, a multi-item cart with cake-icing messages, a
4-step checkout with a searchable delivery-city picker, a delivery-address capture,
delivery-date constraints, a live availability + rate check (blocks unavailable dates and
suggests the next one), and an AI gift-message enhancer (warm / witty / formal), a working
pay-link card with price-lock countdown, and a Track-Order flow (by VIMP number). Factored
into small files: `data.jsx` (catalog) · `ui.jsx` (chrome) · `genui.jsx` (cards) ·
`checkout.jsx` (cart + checkout) · `engine.jsx` (NLU) · `app.jsx`.

> **Kapruka MCP mapping.** The demo's flows mirror the real Kapruka MCP tool surface
> (`mcp.kapruka.com/mcp`), so it can be wired to live data 1:1: *Search Products* →
> product carousel · *List Product Categories* → category chips · *Get Product Details* →
> product card · *List Delivery Cities* → searchable city picker · *Check Delivery
> Availability and Rate* → the in-checkout availability/rate card (with `next_available_date`)
> · *Create Order (Guest Checkout)* → the place-order step → pay-link card → a
> Kapruka-branded **payment sheet** (card entry → processing → "Payment successful" →
> order confirmed → tracking enabled). *In production this button opens the real
> `checkout_url` returned by the MCP — Kapruka's own gateway handles payment, so no
> third-party card processor is needed.*
> · *Track Order* → the VIMP order tracker. Tapping any product card opens a full
> **product-details** modal (gallery, description, spec rows, quantity + cake-icing, add to
> cart) — mapping to *Get Product Details*. Field shapes (recipient, delivery address +
> city + date, sender, gift message) match the create-order payload.

---

Built for Sri Lanka 💜 — purple, yellow, and a smile.
