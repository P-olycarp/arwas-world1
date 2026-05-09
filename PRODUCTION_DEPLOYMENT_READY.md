# 🚀 PRODUCTION DEPLOYMENT GUIDE FOR ARWAS WORLD

**Status**: Ready for deployment with minor fixes applied
**Last Updated**: May 9, 2026

---

## ✅ FIXES APPLIED

1. **FeaturedCollection className Bug** - Fixed invalid conditional classNames that were returning `false` instead of empty strings
2. **Production .env Files** - Created template configurations for both frontend and backend
3. **API Configuration** - Verified all backend routes are properly registered and CORS is configured

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Step 1: Configure Environment Variables

#### Backend (.env)
You've already created `/backend/.env`. Fill in your actual values:

```env
NODE_ENV=production
PORT=5000

# ⚠️ CRITICAL: Update these values
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/arwas_world
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

# M-Pesa (get from https://developer.safaricom.co.ke/)
MPESA_CONSUMER_KEY=your_key_here
MPESA_CONSUMER_SECRET=your_secret_here
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=https://your-backend-url.com/api/orders/mpesa-callback

# SendGrid (get from https://sendgrid.com/)
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_URL=https://yourdomain.com/admin

# Security: Generate with: openssl rand -base64 32
JWT_SECRET=your_strong_32_character_secret_here
```

#### Frontend (.env)
You've already created `/frontend/.env`. For production:

```env
VITE_API_URL=/api
VITE_APP_NAME=ARWAS World
```

**Note**: Using `/api` is correct for production - the frontend and backend will share the same domain.

---

### Step 2: Required External Services Setup

#### 📦 MongoDB Atlas Setup
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0 tier is fine for starting out)
3. Create a database user with strong password
4. Whitelist your deployment platform's IP addresses
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/arwas_world`

#### 💬 M-Pesa Integration
1. Go to: https://developer.safaricom.co.ke/
2. Register and create an application
3. Get Consumer Key and Consumer Secret
4. Use Business Short Code: `174379`
5. Get Pass Key from the app
6. **Important**: Update callback URL to your production backend

#### 📧 SendGrid Email Service
1. Go to: https://sendgrid.com/ (free tier available)
2. Create account and verify sender email
3. Generate API key with Mail Send permissions
4. Add to `.env` file

---

### Step 3: Backend Deployment

#### Option A: Railway.app (Recommended for beginners)
1. Push code to GitHub
2. Sign up at https://railway.app
3. Create new project → Connect GitHub repo
4. Set environment variables from `.env`
5. Deploy!

#### Option B: Heroku
1. Create Heroku account
2. Install Heroku CLI
3. Run:
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```
4. Set environment variables: `heroku config:set KEY=value`

#### Option C: Custom VPS (DigitalOcean, Linode)
1. SSH into server
2. Install Node.js and npm
3. Clone repo and install dependencies
4. Set up `.env` file
5. Install PM2: `npm install -g pm2`
6. Start server: `pm2 start backend/server.js --name arwas-api`
7. Set up reverse proxy (Nginx) to forward requests

---

### Step 4: Frontend Deployment

#### Option A: Vercel (Recommended - Already configured)
1. Go to: https://vercel.com
2. Import your GitHub repository
3. Set environment variable:
   - `VITE_API_URL`: `https://your-backend-domain.com/api`
4. Deploy!

#### Option B: Netlify
1. Go to: https://netlify.com
2. Connect GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variable: `VITE_API_URL`

#### Option C: Railway.app
1. Create frontend app in Railway
2. Build command: `npm run build`
3. Start command: `npm run preview`
4. Set `VITE_API_URL` environment variable

---

### Step 5: Production Verification Checklist

After deployment, verify these endpoints:

```bash
# 1. Backend health check
curl https://your-backend.com/api/health

# 2. Products endpoint
curl https://your-backend.com/api/products

# 3. Frontend loads (check for 200 status)
curl -I https://your-frontend.com

# 4. Check CORS headers on API
curl -I -H "Origin: https://your-frontend.com" https://your-backend.com/api/products
```

---

## 🔒 Security Checklist for Production

- [ ] Never commit `.env` files (already in .gitignore)
- [ ] Use HTTPS only (all hosting platforms provide free SSL)
- [ ] Set `NODE_ENV=production` in backend
- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Whitelist MongoDB IP addresses
- [ ] Configure CORS_ORIGIN to your exact domain (not `*`)
- [ ] Enable MongoDB authentication
- [ ] Rotate API keys regularly
- [ ] Set up monitoring/logging (e.g., Sentry.io)

---

## 🐛 Troubleshooting

### Products Not Showing
- Check browser console for errors
- Verify backend is running: `curl https://your-backend.com/api/products`
- Check CORS configuration
- Verify MongoDB is connected

### Images Not Loading
- Ensure `/uploads` directory exists on backend
- Check image paths use `/uploads/filename` format
- Verify backend is serving static files correctly

### M-Pesa Not Working
- Verify callback URL is updated to production URL
- Test with sandbox credentials first
- Check SendGrid API key is valid

### Email Sending Fails
- Verify SENDGRID_API_KEY is set correctly
- Check sender email is verified in SendGrid
- Review SendGrid email logs

---

## 📊 Performance Optimization

1. **Frontend**:
   - Vite build creates minified production bundle
   - CSS is tree-shaken automatically
   - Images should be optimized before uploading

2. **Backend**:
   - MongoDB indexes are automatic
   - Consider caching frequently accessed products
   - Use compression middleware (already included)

---

## 🎯 Next Steps After Deployment

1. **Monitor**: Set up error logging (Sentry, LogRocket)
2. **Analytics**: Add Google Analytics to track user behavior
3. **Backups**: Set up MongoDB backups
4. **CDN**: Consider adding CloudFlare for image caching
5. **Testing**: Run end-to-end tests on live site

---

## 🆘 Get Help

- Backend Issues: Check `/backend/server.js` logs
- Frontend Issues: Check browser console (F12)
- API Issues: Test with curl or Postman
- Deployment Issues: Check platform's deployment logs

**Support Contacts**:
- Railway: dashboard.railway.app
- Vercel: vercel.com/dashboard
- MongoDB: cloud.mongodb.com

---

**You're ready to go live! 🎉**
