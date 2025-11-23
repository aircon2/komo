# Deployment Guide for searchkomo.tech

This guide will help you deploy komo to Vercel with your custom domain `searchkomo.tech`.

## Architecture Overview

- **Frontend**: Next.js app → Deploy to Vercel
- **Backend**: Express.js API → Deploy to Railway (recommended) or Render (SQLite-friendly)

**Why separate backend?** Your backend uses SQLite (`better-sqlite3`), which requires a persistent file system. Vercel's serverless functions are stateless, so SQLite won't work there. Railway and Render support persistent storage.

---

## Option 1: Frontend on Vercel + Backend on Railway (Recommended)

### Step 1: Deploy Frontend to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Navigate to frontend directory**:
   ```bash
   cd unified-search/frontend
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy**:
   ```bash
   vercel
   ```
   - Follow prompts:
     - Set up and deploy? **Yes**
     - Which scope? (select your account)
     - Link to existing project? **No**
     - Project name? `komo-frontend` (or any name)
     - Directory? `./` (current directory)
     - Override settings? **No**

5. **Add environment variables** in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-url.railway.app` (we'll get this after backend deploy)

6. **Redeploy** after adding env vars:
   ```bash
   vercel --prod
   ```

### Step 2: Deploy Backend to Railway

1. **Sign up** at [railway.app](https://railway.app) (free tier available)

2. **Create new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo" (recommended) or "Empty Project"

3. **If using GitHub**:
   - Connect your GitHub account
   - Select the `komo` repository
   - Railway will auto-detect the backend

4. **If using Empty Project**:
   - Click "New" → "GitHub Repo"
   - Select your repo
   - Set root directory: `unified-search/backend`

5. **Add environment variables** in Railway:
   - Go to your service → Variables
   - Add:
     ```
     SLACK_ACCESS_TOKEN=your_slack_token
     NOTION_TOKEN=your_notion_token
     GEMINI_API_KEY=your_gemini_key
     PORT=4000
     ```

6. **Deploy**:
   - Railway will auto-deploy on push
   - Or click "Deploy" manually
   - Wait for deployment to complete

7. **Get your backend URL**:
   - Railway provides a URL like: `https://komo-backend-production.up.railway.app`
   - Copy this URL

8. **Update frontend env var**:
   - Go back to Vercel
   - Update `NEXT_PUBLIC_API_URL` to your Railway URL
   - Redeploy frontend

### Step 3: Configure Custom Domain on Vercel

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter: `searchkomo.tech`
   - Click "Add"

2. **Configure DNS** (in your domain provider - MLH tech.domains):
   - Vercel will show you DNS records to add
   - Usually:
     - Type: `A` or `CNAME`
     - Name: `@` or `searchkomo.tech`
     - Value: Vercel's IP or CNAME (shown in dashboard)

3. **Wait for DNS propagation** (5-60 minutes)

4. **Verify**:
   - Vercel will show "Valid Configuration" when ready
   - Visit `https://searchkomo.tech`

### Step 4: Update CORS on Backend

Your backend needs to allow requests from your Vercel domain:

1. **Update backend CORS** (if needed):
   ```typescript
   // In backend/src/index.ts
   app.use(cors({
     origin: [
       'https://searchkomo.tech',
       'https://www.searchkomo.tech',
       'http://localhost:3000' // for local dev
     ]
   }));
   ```

2. **Redeploy backend** on Railway

---

## Option 2: Frontend on Vercel + Backend on Render

### Step 1: Deploy Frontend (same as Option 1)

### Step 2: Deploy Backend to Render

1. **Sign up** at [render.com](https://render.com) (free tier available)

2. **Create new Web Service**:
   - Click "New" → "Web Service"
   - Connect GitHub repo
   - Select your `komo` repository

3. **Configure**:
   - Name: `komo-backend`
   - Root Directory: `unified-search/backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm run dev` (or create a production start script)

4. **Add environment variables**:
   ```
   SLACK_ACCESS_TOKEN=your_slack_token
   NOTION_TOKEN=your_notion_token
   GEMINI_API_KEY=your_gemini_key
   PORT=4000
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Render will build and deploy
   - Get your URL: `https://komo-backend.onrender.com`

6. **Update frontend** with Render URL

---

## Option 3: Both on Vercel (Requires Backend Changes)

If you want everything on Vercel, you'll need to:

1. **Replace SQLite** with a cloud database (PostgreSQL, MongoDB, etc.)
2. **Convert Express routes** to Vercel serverless functions
3. **Update file storage** (SQLite DB) to cloud storage

This is more complex but possible. Let me know if you want help with this approach.

---

## Quick Deploy Commands

### Frontend (Vercel):
```bash
cd unified-search/frontend
vercel --prod
```

### Backend (Railway):
- Auto-deploys on git push
- Or use Railway CLI: `railway up`

---

## Troubleshooting

### Frontend can't connect to backend:
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is running (check Railway/Render logs)
- Check CORS settings on backend

### SQLite errors:
- Railway/Render provide persistent storage
- If using Vercel serverless, you'll need to switch to a cloud database

### Domain not working:
- Wait for DNS propagation (can take up to 24 hours)
- Check DNS records match Vercel's requirements
- Verify SSL certificate is issued (automatic on Vercel)

### Environment variables not working:
- Make sure to redeploy after adding env vars
- Check variable names match exactly (case-sensitive)
- For Next.js, `NEXT_PUBLIC_*` vars are exposed to client

---

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in both services
- [ ] CORS configured for production domain
- [ ] Custom domain added to Vercel
- [ ] DNS records configured
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Test search functionality
- [ ] Test Slack integration
- [ ] Test Notion integration
- [ ] Verify AI summaries work

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

