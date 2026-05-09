# 🚀 ARWAS WORLD - PRODUCTION READINESS CHECKLIST

## ✅ Pre-Deployment Verification (COMPLETED)

### Code Quality
- [x] Removed hardcoded localhost URLs from all frontend components
- [x] Updated environment variable usage for API endpoints
- [x] Fixed vite.config.js proxy configuration
- [x] Updated .env.example files with production examples
- [x] Removed error messages referencing localhost

---

## 📋 REQUIRED TASKS BEFORE GOING LIVE

### 1️⃣ Backend Environment Setup

Before deploying, create a `.env` file in the `/backend` folder:

```env
NODE_ENV=production
PORT=5000

# Database - Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arwas_world

# Server Configuration
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

# M-Pesa Integration (Get from Daraja Console)
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=https://your-backend-url.com/api/orders/mpesa-callback

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@arwas-world.com
SENDGRID_FROM_NAME=ARWAS World
ADMIN_EMAIL=admin@arwas-world.com
ADMIN_URL=https://yourdomain.com/admin

# Security
JWT_SECRET=generate_a_strong_random_secret_key_here_minimum_32_characters
```

**⚠️ IMPORTANT**: Never commit `.env` file - it's in .gitignore

### 2️⃣ Frontend Environment Setup

Create a `.env` file in the `/frontend` folder:

```env
# Production URL
VITE_API_URL=https://your-backend-api.com/api
VITE_APP_NAME=ARWAS World
```

For development, keep using:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ARWAS World
```

### 3️⃣ Database Setup - MongoDB Atlas

- [ ] Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
- [ ] Create a new cluster:
  - Cloud Provider: AWS
  - Region: Choose closest to your users (us-east-1 recommended)
  - Tier: M0 (free) or M10+ for production
  - Cluster name: `arwas-world`
- [ ] Create database user with strong password
- [ ] Whitelist IP addresses (allow your deployment platform's IPs)
- [ ] Get connection string in format: `mongodb+srv://user:password@cluster.mongodb.net/arwas_world`
- [ ] Add to backend `.env` as `MONGODB_URI`

### 4️⃣ M-Pesa Integration Setup

- [ ] Go to: https://developer.safaricom.co.ke/
- [ ] Register account and create an app
- [ ] Get credentials:
  - Consumer Key
  - Consumer Secret
  - Business Short Code (default: 174379)
  - Pass Key
- [ ] Update backend `.env` with these values
- [ ] **Important**: Update `MPESA_CALLBACK_URL` to your production backend URL
  - Format: `https://your-backend-domain.com/api/orders/mpesa-callback`

### 5️⃣ Email Service Setup - SendGrid

- [ ] Create SendGrid account: https://sendgrid.com/
- [ ] Create an API key with Mail Send permissions
- [ ] Get sender email verified
- [ ] Add to backend `.env`:
  - `SENDGRID_API_KEY`
  - `SENDGRID_FROM_EMAIL`
  - `SENDGRID_FROM_NAME`
  - `ADMIN_EMAIL`

### 6️⃣ Backend Deployment

#### Option A: Deploy to Railway.app (Recommended)

1. Create account at https://railway.app/
2. Connect your Git repository
3. Create new project from repo
4. Add environment variables from `.env`
5. Railway will auto-detect and build Node app
6. Get your backend URL: `https://your-backend-name.railway.app`

#### Option B: Deploy to Render.com

1. Create account at https://render.com/
2. Create new "Web Service"
3. Connect Git repository
4. Runtime: Node
5. Build command: `npm install`
6. Start command: `node server.js`
7. Add all environment variables
8. Deploy

#### Option C: Deploy to Vercel (Backend as Serverless Function)

1. Requires refactoring backend into serverless functions
2. More complex but highly scalable
3. Recommended for high-traffic applications

**After backend deployment:**
- Update `CORS_ORIGIN` in backend `.env` to match frontend domain
- Update `MPESA_CALLBACK_URL` to your production backend URL
- Test `/api/health` endpoint: `https://your-backend-url.com/api/health`

### 7️⃣ Frontend Deployment

#### Option A: Deploy to Vercel (Recommended for React/Vite)

1. Create account at https://vercel.com/
2. Connect your Git repository
3. Select `/frontend` folder as root
4. Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_APP_NAME=ARWAS World
   ```
5. Build Settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Deploy

#### Option B: Deploy to Netlify

1. Create account at https://netlify.com/
2. Connect Git repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

#### Option C: Deploy to Railway.app (Same server as backend)

1. Create separate service in Railway
2. Root: `/frontend`
3. Runtime: Node
4. Build: `npm run build`
5. Start: `npm run preview` or use static host

**Frontend deployment URL example:**
- `https://arwas-world.vercel.app`
- `https://arwas-world.netlify.app`

### 8️⃣ Post-Deployment Testing

After deployment, verify:

- [ ] **Backend Health**: Visit `https://your-backend-url.com/api/health`
  - Should return: `{ "status": "Backend is running ✓" }`

- [ ] **Frontend Loads**: Visit `https://your-frontend-url.com`
  - Should display home page without console errors
  - Navigation should work

- [ ] **API Connection**: 
  - Open browser DevTools → Network tab
  - Browse to /shop or trigger product fetch
  - Verify API calls go to production backend, not localhost
  - Should see 200 responses from `/api/products`, etc.

- [ ] **Product Images Load**:
  - Uploaded product images should display
  - Images should come from backend `/uploads` endpoint

- [ ] **M-Pesa Payment Flow**:
  - Add product to cart
  - Go to checkout
  - Test M-Pesa payment initiation
  - Verify callback works

- [ ] **Admin Dashboard** (if applicable):
  - Visit `/admin`
  - Should use production API
  - Verify can access admin features

- [ ] **No Localhost References**:
  - Check DevTools console - no localhost URLs
  - Check Network tab - all API calls to production

---

## 🔒 Security Checklist

- [ ] **HTTPS Enabled**: All URLs use `https://` (not `http://`)
- [ ] **CORS Configured**: Backend only accepts requests from production frontend
- [ ] **JWT Secret**: Generated strong random secret (32+ chars)
- [ ] **Sensitive Data**: No API keys, secrets in frontend code
- [ ] **Environment Variables**: All set in deployment platform, not in code
- [ ] **Database**: 
  - IP whitelist configured
  - Strong password set
  - Regular backups enabled
- [ ] **API Rate Limiting**: Consider adding to prevent abuse
- [ ] **HTTPS Certificates**: Auto-renewal enabled (Vercel/Railway/Netlify handle this)

---

## 📊 Performance Optimization (Optional but Recommended)

- [ ] **Frontend Build**: Run `npm run build` locally to verify no errors
- [ ] **Bundle Size**: Check that dist folder is reasonable size (< 500KB)
- [ ] **Image Optimization**: Consider compressing product images
- [ ] **CDN**: Enable CDN in Vercel/Netlify for faster static delivery
- [ ] **Database Indexing**: Ensure MongoDB has indexes on frequently queried fields
- [ ] **Caching**: Configure cache headers for static assets (already done for `/uploads`)

---

## 🚨 Troubleshooting Production Issues

### Issue: "CORS error" or "API not found"
- **Solution**: Check CORS_ORIGIN in backend matches frontend domain
- Verify backend URL in frontend `.env` is correct

### Issue: "Images not loading"
- **Solution**: Check backend `/uploads` folder is accessible
- Verify image paths are correct in database
- Check CORS headers allow image access

### Issue: "M-Pesa payment failing"
- **Solution**: Verify M-Pesa credentials are correct
- Check MPESA_CALLBACK_URL is accessible and correct
- Ensure backend can reach M-Pesa API endpoints

### Issue: "Database connection timeout"
- **Solution**: Whitelist deployment platform's IP in MongoDB Atlas
- Verify MONGODB_URI connection string is correct
- Check database user has correct permissions

### Issue: "Build fails during deployment"
- **Solution**: Check Node version compatibility
- Run `npm install` locally to verify no dependency issues
- Check all required environment variables are set

---

## 📞 Support URLs (Keep for Reference)

- **MongoDB Atlas Support**: https://www.mongodb.com/support
- **SendGrid Docs**: https://docs.sendgrid.com/
- **M-Pesa Daraja Docs**: https://developer.safaricom.co.ke/documentation
- **Railway Docs**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **React/Vite Docs**: https://vitejs.dev/

---

**Last Updated**: May 8, 2026
**Status**: Ready for Production 🎉
