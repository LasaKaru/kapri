# 🔑 Kapri API Key Guide: The Best & Most Cost-Effective Models

For this application, because the AI only needs to read the system prompt, understand the user, and output a structured JSON response (tool calling), you **do not** need the expensive "heavyweight" models (like Claude Opus or Gemini Pro). 

You should use the **fastest, cheapest "flash" tier models**.

Here are the absolute best, most cost-effective models to use for Kapri:

## 1. Primary AI (Anthropic) — Claude 3.5 Haiku
This is the perfect primary model. It is Anthropic's fastest and cheapest model, but it is extremely smart and handles the JSON output format flawlessly.

- **Cost:** ~$0.25 per 1 million input tokens / ~$1.25 per 1 million output tokens.
- **Estimated real-world cost:** Less than $0.001 per message. A $5 top-up will last you thousands of conversations.
- **Where to buy:** Go to [console.anthropic.com](https://console.anthropic.com), add a minimum of $5 to your billing balance, and generate an API key.

## 2. Fallback AI (Google) — Gemini 1.5 Flash
This is Google's equivalent to Haiku. It is incredibly fast and ridiculously cheap. In fact, Google offers a generous free tier that you can use right now without paying a cent.

- **Cost:** **Free** for up to 15 requests per minute! (If you exceed that, the paid tier is only ~$0.075 per 1 million tokens).
- **Where to get it:** Go to [Google AI Studio](https://aistudio.google.com/app/apikey). You can generate an API key immediately for free. You don't even need to attach a credit card unless you want to upgrade to the paid tier.

---

## Summary Recommendation for the tightest budget:

1. **Gemini 1.5 Flash:** Get the **FREE** API key from Google AI Studio. Put it in your environment variables as `GOOGLE_GENERATIVE_AI_API_KEY`.
2. **Claude 3.5 Haiku:** Add just **$5** to the Anthropic Console. Put the key in your environment variables as `ANTHROPIC_API_KEY`.

With this setup, the app will run primarily on the $5 Anthropic balance (costing fractions of a cent per chat). If that ever fails or runs out, it will seamlessly fall back to your completely free Gemini key. And if both fail or you have no internet, your shiny new offline Scripted Engine (Tier 3) will handle the chat for free!
