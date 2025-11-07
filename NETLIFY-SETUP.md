# Netlify Quick Setup Guide

## 🚀 Deploy in 3 Steps

### Step 1: Generate Production Secret

Run this command and copy the output:

```bash
openssl rand -base64 48
```

### Step 2: Set Environment Variables in Netlify

1. Go to: **Netlify Dashboard → Your Site → Site settings → Environment variables**
2. Click **Add a variable**
3. Add the following:

```
Name: BETTER_AUTH_SECRET
Value: [paste the secret from Step 1]
```

**Optional (auto-detected if not set):**
```
Name: BETTER_AUTH_URL
Value: https://your-app.netlify.app
```

### Step 3: Deploy

```bash
git add .
git commit -m "Deploy with security improvements"
git push origin main
```

Netlify will automatically build and deploy.

---

## ✅ Post-Deployment Checklist

After your first deployment:

1. **Test the site**: Visit `https://your-app.netlify.app`
2. **Test admin login**: Go to `/admin/login`
3. **Sign in with**: `info@aswaatulqurraa.com` / `velcro-deskbound-zoology`
4. **Verify admin pages work**: `/admin/recordings`, `/admin/huffadh`, `/admin/venues`
5. **Test SoundCloud fetch**: Click button, verify rate limiting works

---

## 🔐 Security - What's Protected

✅ Server-side authentication on all admin pages  
✅ Rate limiting (5 minutes between SoundCloud fetches)  
✅ SQL injection prevention (prepared statements)  
✅ XSS protection (React escaping)  
✅ Secure password hashing  
✅ Security headers (X-Frame-Options, etc.)  

---

## 🛠️ Common Issues

### "BETTER_AUTH_SECRET environment variable is required"

**Fix:** You forgot to set the environment variable in Netlify.

1. Go to Site settings → Environment variables
2. Add `BETTER_AUTH_SECRET` (generate with `openssl rand -base64 48`)
3. Redeploy

### Can't log in / "Unauthorized"

**Fix:** Clear cookies and try again. If still failing:

1. Check that `BETTER_AUTH_URL` matches your actual URL (or remove it to auto-detect)
2. Check Netlify function logs for errors
3. Verify the admin user exists in the database

### "Please wait X seconds before fetching again"

**Expected:** Rate limiting is working! Users can only fetch from SoundCloud once every 5 minutes.

---

## 📝 Admin Credentials

| Email | Password |
|-------|----------|
| `info@aswaatulqurraa.com` | `velcro-deskbound-zoology` |

**⚠️ Change these after first login if you want different credentials**

---

## 🔄 Adding More Admin Users

```bash
npm run create-admin new-email@example.com new-password
git add db/taraweeh.db
git commit -m "Add new admin user"
git push
```

---

## 📚 Full Documentation

- **Deployment Guide**: See `DEPLOYMENT.md`
- **Security Audit**: See `SECURITY-AUDIT.md`
- **Environment Variables**: See `.env.example`

---

**Need Help?**
Check Netlify deployment logs and function logs in your dashboard.
