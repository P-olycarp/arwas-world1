# 🚀 QUICK START: GO LIVE IN 5 STEPS

**Status**: Everything is ready. Follow these steps to go live.

---

## Step 1: Get Your Credentials (30 mins)

### MongoDB
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account → Create cluster (M0 tier)
3. Create database user with strong password
4. Whitelist your IP or use 0.0.0.0 (less secure)
5. Click "Connect" → "Drivers" → Copy connection string
6. Replace `<password>` and `<username>` in the string

**Result**: `mongodb+srv://user:pass@cluster.mongodb.net/arwas_world`

### SendGrid (Email)
1. Visit https://sendgrid.com → Sign up for free
2. Verify sender email address
3. Go to "Settings" → "API Keys" → "Create API Key"
4. Copy the API key (you'll only see it once)

**Result**: Your SendGrid API key

### M-Pesa (Payments - Optional for launch)
1. Visit https://developer.safaricom.co.ke/
2. Create account and app
3. Copy Consumer Key, Consumer Secret, Pass Key
4. Business Short Code: `174379` (or your own)

**Result**: M-Pesa credentials

---

## Step 2: Update Backend Configuration (10 mins)

**File**: `/backend/.env`

Replace these values:
```env
# ⬇️ REPLACE THESE ⬇️

MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/arwas_world
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_PASSKEY=your_passkey_here

SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

JWT_SECRET=generate_strong_random_string_32_chars_min
```

**Generate JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 3: Deploy Backend (15-30 mins)

### Option A: Railway (Easiest)
```bash
# 1. Create account at https://railway.app
# 2. Connect your GitHub repository
# 3. In Railway dashboard:
#    - Set environment variables from .env file
#    - Copy Backend URL (will look like: https://arwas-api.railway.app)
# 4. Done!
```

### Option B: Heroku
```bash
npm install -g heroku
heroku login
heroku create your-app-name-api
git push heroku main
heroku config:set MONGODB_URI=value CORS_ORIGIN=value [etc...]
```

### Option C: Your Own VPS
```bash
ssh user@your-server.com
cd /your/app/path
npm install
# Create .env file with your values
npm install -g pm2
pm2 start backend/server.js
```

**After deployment**: 
- Test: `curl https://your-backend.com/api/health`
- Should see: `{"status": "Backend is running ✓"}`

**Save this URL**: You'll need it for the frontend

---

## Step 4: Deploy Frontend (10-20 mins)

### Option A: Vercel (Recommended)
```bash
# 1. Go to https://vercel.com
# 2. Click "Import Project"
# 3. Select your GitHub repository
# 4. In "Environment Variables", add:
#    Key: VITE_API_URL
#    Value: https://your-backend.com/api
# 5. Click Deploy
# 6. Done!
```

### Option B: Netlify
```bash
# 1. Go to https://netlify.com
# 2. Connect GitHub → Select repository
# 3. Build settings:
#    - Build command: npm run build
#    - Publish directory: dist
# 4. Add environment variable: VITE_API_URL
# 5. Deploy
```

**After deployment**: 
- Go to your frontend URL
- Products should load
- No console errors
- Admin panel should be accessible

---

## Step 5: Connect Custom Domain (5-10 mins)

### For Vercel/Netlify:
1. In dashboard, go to "Settings" or "Domain"
2. Add your custom domain
3. Follow instructions to update DNS records
4. Wait 5-30 minutes for DNS to propagate

### DNS Records Needed:
```
Type: CNAME
Name: yourdomain.com
Value: cname.vercel.com (or your provider's CNAME)
```

---

## ✅ VERIFICATION CHECKLIST

After deployment, verify everything:

### Backend
- [ ] `curl https://your-backend.com/api/health` returns status OK
- [ ] `curl https://your-backend.com/api/products` returns product list
- [ ] Products have correct image paths (`/uploads/...`)

### Frontend
- [ ] Homepage loads without errors
- [ ] Hero image displays
- [ ] Navigation bar works
- [ ] Shop page shows products
- [ ] Product images display
- [ ] Add to cart button works
- [ ] Cart page accessible
- [ ] Admin login page loads
- [ ] No red errors in console (F12)

### Mobile
- [ ] Homepage responsive on phone
- [ ] Menu works on mobile
- [ ] Products display correctly
- [ ] Touch interactions smooth

---

## 🎯 You're Live! 

**Congratulations! Your website is now live.** 🎉

### What's Next:
1. **Test everything** - Go through the checklist above
2. **Monitor errors** - Add Sentry.io (free tier available)
3. **Add analytics** - Google Analytics (free)
4. **Optimize images** - Compress product images for faster loading
5. **Set up backups** - MongoDB Atlas has automatic backups

---

## 🆘 Troubleshooting

### Products Not Showing
```bash
# 1. Check backend is running:
curl https://your-backend.com/api/health

# 2. Check MongoDB connection - look at backend logs
# 3. Check CORS - should see headers in browser Network tab

# 4. If all else fails, restart backend service
```

### Images Not Loading
```bash
# 1. Check if /uploads directory exists on backend
# 2. Verify image paths start with /uploads/
# 3. Check CORS allows image requests
```

### API Errors
```bash
# Check CORS_ORIGIN in backend .env matches your frontend domain exactly
# Example:
# CORS_ORIGIN=https://www.yourdomain.com  ← exactly as your domain appears in browser
```

### Deployed But Blank Page
```bash
# 1. Open DevTools (F12) → Console tab
# 2. Check for red errors
# 3. Check Network tab → look for failed requests
# 4. Verify VITE_API_URL environment variable is set
```

---

## 📞 Get Help

| Issue | Where to Look |
|-------|---------------|
| Backend won't start | Railway/Heroku/VPS logs |
| Frontend build fails | Vercel/Netlify deploy logs |
| Can't connect to MongoDB | MongoDB Atlas Network tab |
| CORS errors | Backend server.js CORS config |
| Images 404 | Backend /uploads directory |

---

**You've got this! Go live with confidence! 💪**
