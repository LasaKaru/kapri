# Kapri AI — Kapruka Agent Challenge Features & Submission Mapping

This document maps the features of **Kapri** directly to the Kapruka Agent Challenge judging rubric and bonus criteria. We built Kapri to not just meet the requirements, but to completely over-deliver on every single metric.

---

## 🏆 Alignment with the Judging Rubric (100 pts)

### 1. Experience & polish (30 pts)
*Does it look and feel genuinely amazing?*
- **Full-Screen Immersive Chat:** We ditched the "tiny corner widget". Kapri is a full-screen, mobile-first web app (optimized for 380px viewports) that feels like a native iOS/Android application.
- **Optimistic UI & Skeleton Loaders:** No layout shifts or freezing while waiting for the LLM. We use graceful skeleton carousels and smooth transitions while tools are executing in the background.
- **Voice Search & Dictation:** A built-in microphone button allows users to simply speak their search queries or chat naturally. It features robust support for local dialects (like Sinhala dictation via the `si-LK` Web Speech API).
- **Interactive Onboarding:** A polished empty state with horizontally scrolling category and occasion pills so users don't face a blank screen.

### 2. Visual richness (20 pts)
*Products shown beautifully — not a wall of text.*
- **Zero Raw-Text Product Lists:** Whenever Kapri searches for a product, it completely strips the heavy JSON and intercepts it to render a rich, interactive React `<ProductCarousel>`.
- **Interactive Compare Mode:** Allows dynamic side-by-side comparison of products (with cached images and detailed specs) directly inside the chat flow to help users make quick decisions.
- **Image Search & Visual Discovery:** Built-in capabilities that prioritize rich image fetching for every product search, making product discovery highly visual and engaging.
- **Generative UI Cards:** Every tool response maps to a beautiful UI element:
  - `<DeliveryStatus>` card showing flat fees and perishable warnings.
  - `<OrderTracker>` timeline showing a visual progress bar of the live delivery state.
  - `<CheckoutCard>` showing real totals and a live 60-minute price-lock countdown.

### 3. Personality (15 pts)
*An agent people actually enjoy talking to.*
- **Sri Lankan Nuance:** Kapri was prompted to be warm, proactive, and witty, heavily leaning into Sri Lankan culture (knowing about Avurudu, Wesak, and local gifting habits).
- **Seasonal Awareness:** The UI auto-detects and adjusts its greeting banner for local holidays and occasions.
- **Dynamic Language Switching:** If you speak Tanglish, Kapri responds in Tanglish. It detects your vibe and matches it.

### 4. Usefulness (15 pts)
*Does it really help someone shop and decide?*
- **Budget Negotiation:** Kapri can dynamically filter results using `max_price` if a user says, "My budget is only Rs. 5000."
- **Vague Intent Parsing:** "Get my mom something nice" doesn't break the bot; it triggers a curated search for cakes and flowers.
- **Delivery Validation:** Uses `kapruka_list_delivery_cities` and `kapruka_check_delivery` to validate real Sri Lankan cities, warning the user if cakes/flowers cannot be shipped to remote areas.

### 5. End-to-end completeness (15 pts)
*Discovery all the way through to a working checkout.*
- **Real `kapruka_create_order` Execution:** We take the user from discovery to cart, to delivery details, and finally hit the real Kapruka API.
- **In-App Secure Payment:** Clicking "Pay" opens the real Kapruka checkout URL inside a **sandboxed iframe** (`<PaymentFrame>`). The user completes real transactions on Kapruka's payment gateway without ever leaving Kapri.
- **Post-Purchase Tracking:** Users can paste their `VIMP...` tracking number, and Kapri pulls live Kapruka data to render a visual delivery timeline.

### 6. Creativity (5 pts)
*Show us something we didn't see coming.*
- **"Magic Wand" Gift Message Enhancer:** Users can type a basic message, and Kapri uses a background LLM call to rewrite it into a Warm, Witty, or Formal message (in both English and Sinhala).
- **AI Bundle Builder:** Generates curated gift bundles (e.g., Cake + Flowers + Card) matching specific themes.

---

## ⭐ Bonus Points — (We nailed all of them)

| Bonus Requirement | How Kapri Delivers It |
| :--- | :--- |
| **🛒 Multi-item carts** | Persistent `localStorage` cart with a slide-out `<CartDrawer>` and quantity controls. The cart is always injected into the LLM context so Kapri knows exactly what you're holding. |
| **📅 Delivery-date constraints** | A custom date-picker and delivery flow that passes the date to `kapruka_check_delivery` to fetch real-time shipping fees and validate lead times. |
| **🎁 Gift messaging** | Fully supported in the checkout form, complete with our AI "Enhance" feature to rewrite messages. |
| **💬 Tanglish conversation** | Flawless support. The system detects Tanglish, translates the intent to English to query Kapruka accurately, and then translates the response *back* to Tanglish. |
| **🇱🇰 Sinhala-language support** | **Fully supported.** We use a **"Split-Brain" Translation Layer**. Claude searches Kapruka in English, and Gemini translates the response to perfect Sinhala before the user sees it. We even added **Tamil** support as an extra! |

---

## 🚀 Under the Hood: Built for Production

While the rubric focuses on the experience, we built the backend to be virtually indestructible:
1. **3-Tier Fallback Cascade:** 
   - Tier 1: Anthropic Claude Haiku 4.5
   - Tier 2: Gemini 5-Model Fallback Cascade (if Anthropic rate-limits)
   - Tier 3: Offline Scripted Engine (Guarantees 100% uptime).
2. **Vercel KV Serverless Caching:** Caches Kapruka product data and live tracking numbers to reduce API latency to milliseconds.
3. **Prompt Caching:** Implemented Anthropic `ephemeral` caching to drastically slash API token costs during long shopping sessions.
4. **Token Stripping Middleware:** Strips heavy JSON UI payloads from the chat history (`stripCardJson`), allowing endless conversation without hitting context limits.
5. **Parallel-Call Deadlock Fix:** Forced `disable_parallel_tool_use` to prevent the MCP session from hanging, ensuring checkout flows complete in under 15 seconds.
