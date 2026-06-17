# Pitch Deck Outline

Use this outline to build a 5 to 6 slide PDF presentation for the judges.

## Slide 1: Title Slide
- **Visual:** Kapri Logo + Kapruka Logo.
- **Title:** Kapri AI — The Intelligent Shopping Concierge
- **Subtitle:** Bringing human-level service and zero-friction checkouts to Sri Lankan e-commerce.

## Slide 2: The Problem
- **Headline:** E-commerce chat is broken.
- **Points:** 
  1. Most AI bots are just "search boxes wearing chat costumes."
  2. They return walls of plain-text links.
  3. They don't understand local languages or colloquialisms (Tanglish).
  4. They force users to navigate away from the chat to actually buy things.

## Slide 3: Our Solution (The Concierge)
- **Headline:** A concierge that actually shops for you.
- **Points:**
  1. **Split-Brain Trilingual Engine:** A unique architecture where the core AI reasons and searches in English, while a dedicated Translation Layer seamlessly converses with the user in Sinhala, English, or Tanglish. This completely eliminates localization hallucinations.
  2. **Zero-Text UI:** Renders beautiful, interactive UI cards (Carousels, Delivery Trackers) directly inside the chat.
  3. **In-Chat Checkout:** Validates delivery, applies rates, and generates direct click-to-pay URLs.

## Slide 4: The Magic Under the Hood
- **Headline:** Enterprise-Grade Architecture.
- **Points:**
  1. **3-Tier Reliability Engine:** Claude 3.5 (Primary) → Google Gemini (Fallback) → Local Script (Offline Safety Net). 
  2. **Infinite Uptime Fallback Cascade:** Uses a 5-model Gemini cascade (`gemini-3.1-flash-lite`, etc.) to automatically bypass API rate limits.
  3. **MCP Integration:** Direct integration with Kapruka's backend via the Model Context Protocol.
  4. **Token Optimization:** Custom middleware (`stripCardJson`) reduces API token costs by ~40%.

## Slide 5: Business Impact & Why It Wins
- **Headline:** Built for Conversion.
- **Points:**
  1. **Reduced Friction:** Guest checkouts with minimal steps directly in the chat window.
  2. **Cultural Resonance:** Speaking the user's language (literally and figuratively) builds immense brand loyalty.
  3. **Scalability:** The architecture handles thousands of concurrent sessions with highly optimized LLM token costs.

## Slide 6: Future Roadmap
- **Headline:** What's Next?
- **Points:**
  1. Voice input and real-time audio interaction.
  2. Direct WhatsApp API integration.
  3. Hyper-personalized AI gift recommendations based on historical purchase data.
