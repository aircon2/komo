# Quick Deploy Guide for searchkomo.tech

## 🚀 Fastest Path to Production

### Prerequisites
- GitHub account
- Vercel account (free): https://vercel.com
- Railway account (free): https://railway.app
- Domain: `searchkomo.tech` (already have from MLH)

---

## Step 1: Deploy Backend to Railway (5 minutes)

1. **Go to Railway**: https://railway.app
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select your `komo` repository**
5. **Configure**:
   - Root Directory: `unified-search/backend`
   - Railway will auto-detect Node.js
6. **Add Environment Variables** (in Railway dashboard):
   ```
   SLACK_ACCESS_TOKEN=your_token_here
   NOTION_TOKEN=your_token_here
   GEMINI_API_KEY=your_key_here
   PORT=4000
   FRONTEND_URL=https://searchkomo.tech
   ```
7. **Deploy** → Wait for "Deployed" status
8. **Copy your Railway URL** (e.g., `https://komo-backend-production.up.railway.app`)

---

## Step 2: Deploy Frontend to Vercel (5 minutes)

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel**: https://vercel.com
2. **Sign up** with GitHub
3. **Add New Project**
4. **Import your `komo` repository**
5. **Configure**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `unified-search/frontend`
   - Build Command: `npm run build` (auto)
   - Output Directory: `.next` (auto)
6. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://your-railway-url.railway.app` (from Step 1)
7. **Deploy**

### Option B: Via CLI

```bash
cd unified-search/frontend
npm i -g vercel
vercel login
vercel
# Follow prompts, then:
vercel --prod
```

**Add environment variable in Vercel dashboard**:
- Go to Project → Settings → Environment Variables
- Add: `NEXT_PUBLIC_API_URL` = your Railway backend URL

---

## Step 3: Add Custom Domain (5 minutes)

1. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Domains**
   - Click **Add Domain**
   - Enter: `searchkomo.tech`
   - Click **Add**

2. **Configure DNS** (in MLH tech.domains):
   - Vercel will show you DNS records
   - Usually add a **CNAME** record:
     - Name: `@` or `searchkomo.tech`
     - Value: `cname.vercel-dns.com` (or what Vercel shows)
   - Or add **A** records (IPs shown in Vercel)

3. **Wait 5-60 minutes** for DNS propagation

4. **Verify**: Vercel will show "Valid Configuration" ✅

---

## Step 4: Test Everything

1. Visit `https://searchkomo.tech`
2. Add Slack/Notion apps
3. Search for something
4. Verify results appear
5. Check browser console for errors

---

## Troubleshooting

### Frontend shows "Failed to fetch"
- Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Verify backend is running (check Railway logs)
- Check Railway URL is accessible

### Backend not starting
- Check Railway logs for errors
- Verify all environment variables are set
- Check `PORT` is set to `4000`

### Domain not working
- Wait longer (DNS can take 24 hours)
- Check DNS records match Vercel's requirements
- Verify SSL certificate (auto on Vercel)

---

## Environment Variables Checklist

### Railway (Backend):
- ✅ `SLACK_ACCESS_TOKEN`
- ✅ `NOTION_TOKEN`
- ✅ `GEMINI_API_KEY`
- ✅ `PORT=4000`
- ✅ `FRONTEND_URL=https://searchkomo.tech`

### Vercel (Frontend):
- ✅ `NEXT_PUBLIC_API_URL` = your Railway URL

---

## That's It! 🎉

Your app should now be live at `https://searchkomo.tech`

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

