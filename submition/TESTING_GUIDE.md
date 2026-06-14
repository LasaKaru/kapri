# Kapri Testing Guide

Welcome to Kapri! To experience the magic of our 3-Tier AI Concierge, we highly recommend trying the following prompts in our deployed URL.

These prompts are specifically designed to showcase Kapri's advanced capabilities, including its language routing, real-time backend integrations (MCP), and interactive UI rendering.

### Test 1: Language Routing & NLP
**Type:** `"Ammata birthday cake ekak ganna one"`
- **What it tests:** The custom Language Detection Engine. Kapri will recognize the 'Tanglish' (Singlish) input, route it properly, and respond in the same casual colloquial tone. 

### Test 2: MCP Search & Zero-Text UI
**Type:** `"Find me earbuds under 5000"`
- **What it tests:** The `kapruka_search_products` MCP integration. Notice how Kapri does **not** reply with a wall of text. It intercepts the JSON from the backend and renders a beautiful, swipeable interactive carousel.

### Test 3: The Validation & Checkout Flow
*(After selecting a product from the carousel in Test 2, click 'Checkout' or type the following)*
**Type:** `"Send it to Kandy tomorrow"`
- **What it tests:** 
  1. The `kapruka_list_delivery_cities` MCP endpoint (validates that Kandy is a legitimate destination).
  2. The `kapruka_check_delivery` endpoint (fetches the exact flat delivery rate for Kandy).
  3. It will render a Checkout summary card with an exact, calculated estimated total.

### Test 4: Order Tracking
**Type:** `"Track my order VIMP8899"`
- **What it tests:** The `kapruka_track_order` endpoint. Kapri will pull the live status of the order directly from the Kapruka backend and render a visual timeline of the delivery progress.
