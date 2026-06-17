# Kapri AI — The 3-Tier Intelligent Shopping Concierge

Welcome to **Kapri**, Kapruka's next-generation AI shopping assistant. Kapri transcends traditional chat interfaces by acting as a true concierge — it doesn't just return text; it fetches live products, manages complex checkouts, and renders interactive UI components directly in your chat stream.

## 🚀 The Problem
Modern e-commerce chat bots are little more than "search boxes wearing chat costumes." They return plain-text lists of products, force users to navigate away to make purchases, and struggle with the deep linguistic nuances of the Sri Lankan market.

## ✨ The Solution
Kapri solves this by blending emotional intelligence with hard e-commerce utility:
- **Trilingual Support via Split-Brain Architecture:** Native parsing of English, Sinhala, and "Tanglish" (Singlish). Kapri's core handles all complex MCP logic in English, while a dedicated Translation Layer translates the final output to the user's language using a 5-model Fallback Cascade.
- **Zero-Text UI:** A strict rule against plain-text product lists. Kapri intercepts backend data and renders interactive carousels, status cards, and checkout modals natively in the chat.
- **Direct Checkout:** Kapri handles phone validation, delivery checks, perishable warnings, and generates click-to-pay URLs. No Kapruka account required.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, React, Vanilla CSS.
- **AI Engines**: Anthropic Claude 3.5 Haiku (Primary), Google Gemini (Tier 2 Fallback & Translation Layer). Both tiers use a robust 5-model Gemini Fallback Cascade (`gemini-3.1-flash-lite`, etc.) to eliminate rate limit crashes.
- **Backend Integration**: Direct integration via the Kapruka Model Context Protocol (MCP) server.

## 🏃‍♂️ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd kapri
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Copy the `.env.example` file to `.env.local` and add your API keys.
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000` to start chatting with Kapri!
