---
name: kapruka-design
description: Use this skill to generate well-branded interfaces and assets for Kapruka — Sri Lanka's #1 e-commerce & gifting platform — and its Kapri AI shopping concierge. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping in English, සිංහල, and Tanglish.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out
and create static HTML files for the user to view. If working on production code, you can
copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build
or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_
production code, depending on the need.

## Where things live
- `styles.css` — the one global entry point. Link it; it `@import`s every token + font.
- `tokens/` — colors, typography, spacing/radii/shadows/motion, fonts, base utilities.
- `assets/` — `kapruka-logo.jpg` (primary wordmark) and `kapruka-logo.svg` (vector).
- `guidelines/` — foundation specimen cards (Type, Colors, Spacing, Brand).
- `components/core/` — React primitives: Button, IconButton, Badge, Chip, ProductCard,
  MessageBubble, CategoryTile, DeliveryStatus, Icon. Each has a `.d.ts` + `.prompt.md`.
- `ui_kits/kapri/` — the AI Shopping Concierge: interactive `index.html` + JSX screens.

## Non-negotiable brand rules
- **Purple `#442A73` + Yellow `#F9DB09` + White.** No orange, no green accents, no
  blue-purple "AI" gradients. Status colors (green/amber/red) are functional only.
- **Yellow is the spark** — use it for the single highest-emphasis CTA per view and the
  cart/LIVE badges. Never yellow text on white.
- **Rounded everything**, purple-tinted shadows (never neutral grey).
- **Icons:** Lucide (outline, 2px). Emoji for category/occasion wayfinding only.
- **Voice:** warm, witty, Sri Lankan; mirror the user's language (English / සිංහල /
  Tanglish). Sentence case. One short bridge line after showing a card — never re-list
  products as text. Currency is `Rs. 4,500`.

## Using the components
In a card/HTML file, link `styles.css`, load `_ds_bundle.js`, then read components off the
window namespace (run the design-system check to get the exact namespace name) — e.g.
`const { Button, ProductCard } = window.<Namespace>`. Do not `<script src>` the `.jsx`
directly. See each component's `.prompt.md` for usage.
