# Railway Deployment Fix

## Problem
Railway was using Node.js v18, but `better-sqlite3@12.4.6` requires Node.js 20+.

## Solution
I've added multiple configuration files to ensure Railway uses Node.js 20:

1. **`nixpacks.toml`** - Tells Railway to use Node.js 20 and install build tools
2. **`package.json`** - Added `engines` field specifying Node.js >= 20
3. **`.nvmrc`** - Specifies Node.js version 20
4. **`Dockerfile`** - Alternative deployment method (if Railway supports Docker)

## Next Steps

### Option 1: Use Nixpacks (Recommended)
Railway should automatically detect `nixpacks.toml` and use Node.js 20.

1. **Commit and push** these new files:
   ```bash
   git add unified-search/backend/nixpacks.toml
   git add unified-search/backend/package.json
   git add unified-search/backend/.nvmrc
   git commit -m "Fix Railway deployment: Use Node.js 20"
   git push
   ```

2. **Redeploy** on Railway:
   - Railway should auto-detect the changes
   - Or manually trigger a redeploy

### Option 2: Use Dockerfile
If Nixpacks still doesn't work:

1. **In Railway Dashboard**:
   - Go to your service → Settings
   - Change "Build Command" to: (leave empty, Dockerfile handles it)
   - Change "Start Command" to: `npm start`
   - Or set "Dockerfile Path" to: `unified-search/backend/Dockerfile`

2. **Redeploy**

### Option 3: Manual Node Version Override
In Railway dashboard:
- Go to Variables
- Add: `NODE_VERSION=20`
- Redeploy

## Verify
After deployment, check Railway logs to confirm:
- Node.js version is 20.x
- `better-sqlite3` installs successfully
- Server starts without errors

## If Still Failing
1. Check Railway logs for specific errors
2. Try using Render instead (see DEPLOYMENT.md)
3. Consider switching to PostgreSQL instead of SQLite (more complex but more reliable for production)

