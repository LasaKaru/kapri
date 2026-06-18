# Changelog

A comprehensive log of the 69 commits and architectural milestones for the Kapri AI Shopping Concierge, tracking new features, improvements, bug fixes, and documentation updates.

## ✨ New Features
* **Multi-Tier LLM Architecture:** Implemented a robust 3-tier chat route with Anthropic MCP (Tier 1), Gemini fallback (Tier 2), and Scripted Engine (Tier 3).
* **Anthropic Prompt Caching:** Added `cache_control: { type: "ephemeral" }` to drastically reduce API costs and improve response times for system prompts.
* **Vercel KV Serverless Caching:** Migrated product and city memory from a local JSON file to Vercel KV (Upstash Redis) for persistent, stateless memory that survives server restarts.
* **Multi-Language & Translation Layer:** Added comprehensive language detection and translation middleware for Sinhala Unicode, Tamil Unicode, Singlish, and Tanglish.
* **Real Kapruka MCP Integration:** Wired the UI checkout form to place real Kapruka orders via the MCP server.
* **Order Tracking:** Surfaced real `kapruka_track_order` data dynamically into the UI tracking card.
* **Product Discovery UI:** Built dynamic 'Shop by Category' strip directly linked to the Kapruka MCP, complete with Product Comparisons and Budget Negotiation flows.
* **Interactive Chat Interface:** Added Bubbles UI with emoji parsing, typing indicators, and a floating Chat/Cart header.
* **Checkout Flow & Payments:** Built a multi-step checkout component with address validation, delivery scheduling, gift messaging, and a responsive in-app iframe modal for real Kapruka payments.
* **Analytics:** Integrated Vercel Speed Insights and Analytics instrumentation.

## 🚀 Improvements & Refactors
* **Gemini Fallback Cascade:** Implemented a multi-model fallback cascade for translation tasks to ensure robust 100% uptime for local languages.
* **Model Upgrade:** Switched Tier 1 engine to `claude-haiku-4-5-20251001` for faster MCP tool executions.
* **Asynchronous Scripted Engine:** Refactored the Tier 3 Scripted Engine to be fully asynchronous, enabling it to await data directly from Vercel KV.
* **Static Zod Tool Schemas:** Implemented static Zod schemas for the Gemini route to mirror the Kapruka MCP tool capabilities seamlessly.
* **UI & UX Polish:** Initialized core UI architecture, global design tokens, custom SVG `Ico` registry, and an animated onboarding overlay.

## 🐛 Bug Fixes
* **Language Auto-Detect Override:** Fixed a critical bug where Claude's internal `{ lang: 'en' }` JSON response would override the frontend's auto-detected Sinhala/Tamil state, locking the dropdown language to English.
* **Singlish vs Tanglish Keyword Clashes:** Fixed the language detection logic by introducing comparative hit-scoring (e.g., `sgHits` vs `tgHits`) to accurately separate Singlish and Tanglish inputs that share similar words.
* **MCP Parallel-Call Deadlock:** Fixed a stalling issue in the MCP tool execution loop by forcing `disable_parallel_tool_use: true` in Anthropic requests.
* **Vercel KV Environment Variables:** Fixed corrupted `.env.local` spaces caused by local shell scripts, ensuring Next.js could read `KV_REST_API_URL` and `KV_REST_API_TOKEN` correctly.
* **Mobile Padding:** Fixed mobile viewport padding in the `EmptyState` component and adjusted the purple neon borders on the Kapri avatar.
* **MCP Schema Alignment:** Ensured the internal tool calls exactly match the live Kapruka server schema requirements.

## 📚 Documentation
* **Architecture Overhaul:** Added comprehensive `README.md` complete with Mermaid architecture diagrams, fallback logic explanations, and project strategy.
* **Deployment Guides:** Created specialized deployment walkthroughs for Netlify and Vercel environments.
* **API Key Optimization:** Wrote an API key configuration guide to educate developers on cost-effective model usage.
* **MCP & Testing Docs:** Added `mcp.md` documentation, `submition/.env.example`, and testing instructions for the guest-checkout flow.

---

## 📅 Version History

**v1.0.5 - Jun 18, 2026**
- Refactored Scripted Engine to be fully asynchronous
- Integrated Vercel KV for persistent, stateless product caching
- Added Anthropic Prompt Caching (`ephemeral`) to drastically reduce API spend
- Fixed UI translation bugs and auto-detect overrides locking to English

**v1.0.4 - Jun 17, 2026**
- Added full support for Sinhala, Tamil, Singlish, and Tanglish
- Integrated Gemini translation fallback cascade for maximum resilience
- Fixed Singlish vs Tanglish detection scoring algorithm
- Replaced header language toggle button with a clean `<select>` dropdown

**v1.0.3 - Jun 15, 2026**
- Upgraded Anthropic engine to `claude-haiku-4-5-20251001`
- Wired real Kapruka checkout and payment gateway in a responsive iframe
- Integrated live Kapruka order tracking directly into the UI card
- Fixed MCP parallel-call deadlock by disabling concurrent tool use

**v1.0.2 - Jun 10, 2026**
- Implemented multi-tier 3-stage fallback architecture (Anthropic → Gemini → Scripted)
- Added dynamic 'Shop by Category' strip via live Kapruka MCP
- Built interactive Bubbles UI, Product Carousel, and EmptyState components
- Added automated cart and favorites management

**v1.0.1 - Jun 8, 2026**
- Initial Release & Design System Handoff
- Scaffolded Next.js 14 application and global design tokens
