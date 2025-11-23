# DNS Setup for searchkomo.tech

This guide will help you configure DNS records for your MLH tech.domains domain.

## Step 1: Get DNS Records from Vercel

1. **Deploy your frontend to Vercel** first (see [QUICK_DEPLOY.md](./QUICK_DEPLOY.md))
2. **In Vercel Dashboard**:
   - Go to your project → **Settings** → **Domains**
   - Click **Add Domain**
   - Enter: `searchkomo.tech`
   - Vercel will show you the DNS records to add

## Step 2: Configure DNS in MLH tech.domains

1. **Log in** to your MLH tech.domains account
2. **Navigate to DNS Management** for `searchkomo.tech`
3. **Add the records** that Vercel shows you

### Common Vercel DNS Records:

**Option A: CNAME (Recommended)**
```
Type: CNAME
Name: @ (or leave blank, or searchkomo.tech)
Value: cname.vercel-dns.com
TTL: 3600 (or default)
```

**Option B: A Records (If CNAME not supported)**
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel will show you the actual IPs)
TTL: 3600

Type: A
Name: @
Value: 76.223.126.88 (Vercel will show you the actual IPs)
TTL: 3600
```

**For www subdomain (optional):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

## Step 3: Verify DNS Propagation

1. **Wait 5-60 minutes** (can take up to 24 hours)
2. **Check DNS propagation**:
   ```bash
   # In terminal
   nslookup searchkomo.tech
   # or
   dig searchkomo.tech
   ```
3. **In Vercel Dashboard**:
   - Go to Domains
   - Status should change from "Pending" to "Valid Configuration" ✅

## Step 4: SSL Certificate

- Vercel automatically provisions SSL certificates
- Once DNS is valid, SSL will be issued automatically
- Your site will be available at `https://searchkomo.tech`

## Troubleshooting

### DNS not propagating
- Wait longer (up to 24 hours)
- Check that records match exactly what Vercel shows
- Verify TTL is set correctly
- Try using a DNS checker: https://dnschecker.org

### Vercel shows "Invalid Configuration"
- Double-check DNS records match Vercel's requirements
- Ensure no conflicting records exist
- Try removing and re-adding the domain in Vercel

### Can't access site
- Make sure DNS has propagated (check with `nslookup`)
- Verify SSL certificate is issued (check in Vercel dashboard)
- Clear browser cache
- Try accessing via `https://` (not `http://`)

## Need Help?

- Vercel DNS Docs: https://vercel.com/docs/concepts/projects/domains
- MLH tech.domains Support: Check MLH documentation or Discord

