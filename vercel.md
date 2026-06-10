# ☁️ Deploying Kapri to Vercel — Step-by-Step Guide

> Vercel is the **recommended** platform for Kapri since it's the creator of Next.js and offers the best integration.

---

## Prerequisites

- [x] A **GitHub** (or GitLab/Bitbucket) account with your Kapri repo pushed
- [x] A **Vercel** account → [vercel.com/signup](https://vercel.com/signup) (free tier works)
- [x] Your **API keys** ready:
  - `ANTHROPIC_API_KEY` (primary) → [console.anthropic.com](https://console.anthropic.com)
  - `GOOGLE_GENERATIVE_AI_API_KEY` (fallback, optional) → [aistudio.google.com](https://aistudio.google.com/apikey)

---

## Step 1: Push Your Code to GitHub

```bash
# If not already a git repo
cd kapri
git init
git add .
git commit -m "Initial commit — Kapri AI Shopping Concierge"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/kapri.git
git branch -M main
git push -u origin main
```

> **Important:** Make sure `.env.local` is in your `.gitignore` — never push API keys to GitHub!

---

## Step 2: Import Project on Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Click **"Import Git Repository"**
3. Select your **kapri** repository from the list
4. If you don't see it, click **"Adjust GitHub App Permissions"** to grant Vercel access

---

## Step 3: Configure Build Settings

Vercel auto-detects Next.js. Verify these settings:

| Setting | Value |
|---|---|
| **Framework Preset** | Next.js |
| **Root Directory** | `./ ` (leave as default) |
| **Build Command** | `next build` (auto-detected) |
| **Output Directory** | `.next` (auto-detected) |
| **Install Command** | `npm install` (auto-detected) |
| **Node.js Version** | 18.x or 20.x |

---

## Step 4: Set Environment Variables

Click **"Environment Variables"** and add:

| Variable | Value | Environment |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Production, Preview |
| `GOOGLE_GENERATIVE_AI_API_KEY` | `AIza...` | Production, Preview |
| `KAPRUKA_MCP_URL` | `https://mcp.kapruka.com/mcp` | Production, Preview |

> **⚠️ Security:** Never use the `NEXT_PUBLIC_` prefix for API keys. They must stay server-side only.

> **💡 Tip:** The app works with just `ANTHROPIC_API_KEY`. Gemini is a fallback. Even without any key, Tier 3 (scripted engine) still works.

---

## Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1–2 minutes)
3. Vercel will give you a URL like `https://kapri-xxxxx.vercel.app`

---

## Step 6: Verify Deployment

### Quick Smoke Test

1. Open your deployed URL on a phone at **380px width** (or Chrome DevTools mobile view)
2. Test this flow:
   - ✅ Empty state loads with category/occasion carousels
   - ✅ Seasonal banner appears (if in season)
   - ✅ Type "Birthday cake under Rs. 5000" → product carousel renders
   - ✅ Add a product to cart → badge updates
   - ✅ Open cart drawer → click Checkout → multi-step form works
   - ✅ Type "Track my order VIMP34456" → order tracker renders

### Check Logs

- Go to **Vercel Dashboard → Your Project → Deployments → Latest → Logs**
- Look for `[Tier1-Anthropic]` or `[Tier2-Gemini]` to confirm which AI tier is active

---

## Step 7: Custom Domain (Optional)

1. Go to **Vercel Dashboard → Your Project → Settings → Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `kapri.yourdomain.com`)
4. Update your DNS:
   - **CNAME** → `cname.vercel-dns.com`
   - Or **A record** → `76.76.21.21`
5. SSL is auto-provisioned (free)

---

## Vercel KV (Order Storage)

If you want order tracking to persist across deploys:

1. Go to **Vercel Dashboard → Storage → Create Database**
2. Under "Marketplace Database Providers", select **Upstash** (this is what powers Vercel KV)
3. Click **Add Integration** / **Connect to Project** → select your Kapri project
4. Vercel auto-injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment variables
5. Redeploy: `vercel --prod` or push a new commit

---

## Updating Your Deployment

```bash
# Make changes locally, then:
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel auto-deploys on every push to `main`. Preview deployments are created for pull requests.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Build fails with TypeScript errors | Run `npm run build` locally first to catch errors |
| "500 Internal Server Error" on chat | Check Vercel Logs — likely a missing `ANTHROPIC_API_KEY` |
| Products don't load | Kapruka MCP might be rate-limited (60 req/min). Wait and retry. |
| Hydration error in browser | Already fixed with `ssr: false` in `page.tsx` — just hard refresh |
| Chat returns scripted responses only | No API keys set — add `ANTHROPIC_API_KEY` in env vars and redeploy |

---

## CLI Deployment (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Set environment variables via CLI:
```bash
vercel env add ANTHROPIC_API_KEY production
vercel env add GOOGLE_GENERATIVE_AI_API_KEY production
```
