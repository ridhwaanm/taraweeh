# Deployment Guide - Taraweeh Recordings

## Prerequisites

- Node.js 18+ installed
- Netlify account
- Git repository connected to Netlify

## Security Setup

### 1. Generate Production Secret

Before deploying, generate a secure secret for production:

```bash
openssl rand -base64 48
```

Copy the output - you'll need it for Netlify environment variables.

## Netlify Configuration

### 1. Environment Variables

In your Netlify dashboard, go to: **Site settings → Environment variables**

Add the following **REQUIRED** environment variables:

| Variable Name | Value | Required | Example |
|---------------|-------|----------|---------|
| `BETTER_AUTH_SECRET` | Generated secret from above | ✅ Yes | `YfIQy...TVSa7` |
| `BETTER_AUTH_URL` | Your production URL | Optional* | `https://taraweeh.netlify.app` |

> *BETTER_AUTH_URL is optional and will be auto-detected if not set

### 2. Build Settings

These should already be configured in `netlify.toml`:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 or higher

### 3. Deploy

Push your code to the connected Git repository:

```bash
git add .
git commit -m "Deploy with security improvements"
git push origin main
```

Netlify will automatically build and deploy your site.

## Post-Deployment

### 1. Create Admin User

After deployment, you'll need to create an admin user. You have two options:

**Option A: SSH into Netlify (if available):**
```bash
npm run create-admin your-email@example.com your-secure-password
```

**Option B: Locally update database then re-deploy:**
```bash
# Run locally with production database
npm run create-admin info@aswaatulqurraa.com secure-password
# Commit and push the updated database
git add db/taraweeh.db
git commit -m "Add admin user"
git push
```

### 2. Test Authentication

1. Visit your deployed site: `https://your-app.netlify.app/admin/login`
2. Sign in with the admin credentials
3. Verify you can access `/admin/recordings`, `/admin/huffadh`, `/admin/venues`

### 3. Test SoundCloud Import

1. Go to Recordings page
2. Click "Fetch from SoundCloud" button
3. Verify tracks are imported correctly
4. Try clicking again within 5 minutes - should show rate limit message

## Security Checklist

Before going live, verify:

- [ ] `BETTER_AUTH_SECRET` is set in Netlify (not using default)
- [ ] `.env` file is in `.gitignore` (should NOT be committed)
- [ ] Admin credentials are strong and secure
- [ ] Security headers are working (check with browser DevTools)
- [ ] Server-side authentication is working on all admin pages
- [ ] Rate limiting is active on SoundCloud fetch endpoint

## Monitoring

### Check Logs

View deployment and runtime logs in Netlify:
- **Deploy logs:** Site overview → Deploys → Click on deploy
- **Function logs:** Site overview → Functions → Click on function

### Common Issues

#### "BETTER_AUTH_SECRET environment variable is required"

**Cause:** Missing or incorrect environment variable in Netlify.

**Fix:**
1. Go to Site settings → Environment variables
2. Add `BETTER_AUTH_SECRET` with a secure value
3. Redeploy the site

#### "Unauthorized" on admin pages

**Cause:** Session cookies not being set correctly.

**Fix:**
- Verify `BETTER_AUTH_URL` matches your production URL
- Check browser console for CORS errors
- Clear browser cookies and try again

#### Rate limit errors on SoundCloud fetch

**Expected behavior:** Users can only fetch once every 5 minutes. Wait and try again.

#### Database locked errors

**Cause:** Multiple concurrent writes to SQLite database.

**Fix:** This is expected with serverless functions. The app handles this gracefully with retries.

## Security Notes

### What's Protected

✅ **Server-side authentication** on all admin pages
✅ **Rate limiting** on expensive operations (SoundCloud fetch)
✅ **SQL injection** prevention (prepared statements)
✅ **XSS protection** (React escaping)
✅ **Secure password hashing** (Better Auth crypto)
✅ **Security headers** (X-Frame-Options, CSP, etc.)

### What to Monitor

⚠️ **Login attempts** - Watch for brute force attacks
⚠️ **SoundCloud fetch usage** - Monitor rate limit effectiveness
⚠️ **Database size** - SQLite has limits (~1GB recommended max)

## Backup Strategy

### Database Backups

Your database is committed to Git, so you have version history. However, for production:

1. **Download database regularly:**
   - From Netlify Functions, the database is ephemeral
   - Consider using Netlify Blobs or external storage for persistence

2. **Export data periodically:**
   ```bash
   sqlite3 db/taraweeh.db .dump > backup.sql
   ```

## Maintenance

### Adding New Admin Users

```bash
# Locally
npm run create-admin new-admin@example.com secure-password

# Commit and deploy
git add db/taraweeh.db
git commit -m "Add new admin user"
git push
```

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update safely
npm update

# Test thoroughly before deploying
npm run dev
```

## Support

For issues or questions:
- Check Netlify logs first
- Review browser console for client-side errors
- Verify environment variables are set correctly

---

**Last Updated:** 2025-11-07
**Version:** 1.0.0
