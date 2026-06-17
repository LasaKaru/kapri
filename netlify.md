# 🌐 Deploying Kapri to Netlify — Step-by-Step Guide

> Netlify requires a few extra configuration steps since Kapri uses Next.js API routes and server-side features.

---

## Prerequisites

- [x] A **GitHub** (or GitLab/Bitbucket) account with your Kapri repo pushed
- [x] A **Netlify** account → [app.netlify.com/signup](https://app.netlify.com/signup) (free tier works)
- [x] Your **API keys** ready:
  - `ANTHROPIC_API_KEY` (primary) → [console.anthropic.com](https://console.anthropic.com)
  - `GOOGLE_GENERATIVE_AI_API_KEY` (fallback, optional) → [aistudio.google.com](https://aistudio.google.com/apikey)

---

## Step 1: Install the Netlify Next.js Plugin

Netlify needs its official plugin to handle Next.js server-side features (API routes, SSR).

```bash
cd kapri
npm install @netlify/plugin-nextjs
```

---

## Step 2: Create `netlify.toml`

Create a `netlify.toml` file in the root of your project:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
  NEXT_USE_NETLIFY_EDGE = "true"

# API routes need serverless functions
[functions]
  directory = ".netlify/functions-internal"
  node_bundler = "esbuild"

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache static assets
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Step 3: Push Code to GitHub

```bash
git add .
git commit -m "Add Netlify configuration"
git push origin main
```

> **Important:** Make sure `.env.local` is in your `.gitignore` — never push API keys!

---

## Step 4: Create a New Site on Netlify

1. Go to **[app.netlify.com](https://app.netlify.com)**
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** as your Git provider
4. Authorize Netlify to access your GitHub repos
5. Select your **kapri** repository

---

## Step 5: Configure Build Settings

Verify these settings match:

| Setting | Value |
|---|---|
| **Branch to deploy** | `main` |
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |
| **Functions directory** | `.netlify/functions-internal` (auto-detected) |

> **Note:** The `@netlify/plugin-nextjs` plugin automatically converts your Next.js API routes (`/api/chat`, `/api/orders`, `/api/product-image`) into Netlify serverless functions.

---

## Step 6: Set Environment Variables

1. Go to **Site Configuration → Environment Variables**
2. Click **"Add a variable"** and add each one:

| Variable | Value | Scopes |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | All scopes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | `AIza...` | All scopes (Required for Sinhala/Tanglish Translation) |
| `KAPRUKA_MCP_URL` | `https://mcp.kapruka.com/mcp` | All scopes |

> **⚠️ Security:** Never use the `NEXT_PUBLIC_` prefix for API keys. They must stay server-side only.

> **💡 Tip:** The app works with just `ANTHROPIC_API_KEY`. Even without any key, Tier 3 (scripted engine) still works.

---

## Step 7: Deploy

1. Click **"Deploy site"**
2. Watch the build log — it should take 2–3 minutes
3. Netlify gives you a URL like `https://kapri-random.netlify.app`

---

## Step 8: Verify Deployment

### Quick Smoke Test

1. Open your deployed URL
2. Test this flow:
   - ✅ Empty state loads with category/occasion carousels
   - ✅ Seasonal banner appears (if in season)
   - ✅ Type "Birthday cake under Rs. 5000" → product carousel renders
   - ✅ Add a product to cart → badge updates
   - ✅ Open cart drawer → click Checkout → form works
   - ✅ Type "Track my order VIMP34456" → order tracker renders

### Check Function Logs

1. Go to **Netlify Dashboard → Your Site → Functions**
2. You should see Next.js server-side functions listed
3. Click any function to view invocation logs

---

## Step 9: Custom Domain (Optional)

1. Go to **Netlify Dashboard → Your Site → Domain Management**
2. Click **"Add a domain"**
3. Enter your domain (e.g., `kapri.yourdomain.com`)
4. Update your DNS:
   - **CNAME** → `kapri-random.netlify.app`
   - Or use Netlify DNS (they'll guide you through nameserver changes)
5. Click **"Verify"** then **"Provision SSL"**
6. SSL is auto-provisioned via Let's Encrypt (free)

---

## Step 10: Order Storage (Without Vercel KV)

Since Netlify doesn't have Vercel KV, you have a few options for persistent order storage:

### Option A: Use an External Redis Provider (Recommended)

1. Sign up at **[upstash.com](https://upstash.com)** (free tier: 10K commands/day)
2. Create a new Redis database
3. Add these environment variables to Netlify:

| Variable | Value |
|---|---|
| `KV_REST_API_URL` | `https://xxxxx.upstash.io` |
| `KV_REST_API_TOKEN` | `AXxx...` |

The app uses `@vercel/kv` which is compatible with any Upstash Redis instance.

### Option B: Session-Only Storage

Without KV, the app falls back gracefully:
- Orders are stored in `localStorage` (browser-side)
- Order tracking uses the `DEMO_ORDER` fallback for unknown VIMP numbers
- The core shopping experience is fully functional

---

## Updating Your Deployment

```bash
# Make changes locally, then:
git add .
git commit -m "Update: description of changes"
git push origin main
```

Netlify auto-deploys on every push to `main`. Deploy previews are created for pull requests.

---

## Netlify CLI Deployment (Alternative)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to existing site
netlify link

# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

Set environment variables via CLI:
```bash
netlify env:set ANTHROPIC_API_KEY "sk-ant-api03-..."
netlify env:set GOOGLE_GENERATIVE_AI_API_KEY "AIza..."
```

---

## Key Differences: Netlify vs Vercel for Kapri

| Feature | Netlify | Vercel |
|---|---|---|
| **Next.js support** | Via `@netlify/plugin-nextjs` | Native (built-in) |
| **API routes** | Converted to serverless functions | Native server-side |
| **Cold starts** | Slightly slower (~200ms) | Minimal (~50ms) |
| **KV/Redis** | External (Upstash recommended) | Vercel KV (built-in) |
| **Edge functions** | ✅ Supported | ✅ Supported |
| **Deploy previews** | ✅ Per PR | ✅ Per PR |
| **Free tier limits** | 300 build min/month, 125K fn invocations | 100 GB bandwidth, 100K fn invocations |

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Build fails: "Plugin not found" | Run `npm install @netlify/plugin-nextjs` and push again |
| API routes return 404 | Ensure `netlify.toml` has the `[[plugins]]` block |
| "Function invocation failed" | Check function logs in Netlify dashboard — likely missing API key |
| Products don't load | Kapruka MCP rate limit (60 req/min). Wait and retry. |
| Order tracking shows demo data | KV not configured — add Upstash credentials (see Step 10) |
| Build timeout | Increase timeout in `netlify.toml`: add `[build] timeout = 600` |
| Hydration error | Already fixed with `ssr: false` — just clear cache and hard refresh |
