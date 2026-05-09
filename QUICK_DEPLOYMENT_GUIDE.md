# 🚀 QUICK DEPLOYMENT GUIDE - Choose Your Platform

## 📊 Platform Comparison

| Platform | Backend | Frontend | Database | Ease | Cost |
|----------|---------|----------|----------|------|------|
| **Railway** | ✅ | ✅ | Optional | ⭐⭐⭐ | $7-50/mo |
| **Vercel + Railway** | Railway | Vercel | Atlas | ⭐⭐⭐ | $5-30/mo |
| **Render** | ✅ | ✅ | Optional | ⭐⭐⭐ | Free-20/mo |
| **Netlify + Express** | Netlify (Fx) | Netlify | Atlas | ⭐⭐ | Free-45/mo |

---

## 🚆 OPTION 1: Railway.app (RECOMMENDED - Easiest)

### Why Railway?
- Deploy both backend and frontend from same repo
- Auto-detects Node.js and React/Vite apps
- Free $5/month credit
- Simple environment variable management
- Excellent documentation

### Step-by-Step

#### 1. Create Railway Account
- Go to https://railway.app/
- Sign up with GitHub (easiest)

#### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Authorize GitHub
- Select your arwas-world repo

#### 3. Deploy Backend
1. Create new service → GitHub repo
2. Root directory: `backend`
3. Add environment variables (see template below)
4. Railway auto-detects Node.js, builds and deploys
5. Get backend URL from Railway dashboard

#### 4. Deploy Frontend
1. Create another service → GitHub repo
2. Root directory: `frontend`
3. Set `VITE_API_URL` environment variable
4. Railway handles React/Vite build automatically
5. Get frontend URL

#### 5. Final Steps
- Update backend `CORS_ORIGIN` to frontend URL
- Test both apps work together
- Point your domain using Railway's domain or custom domain

**Estimated time**: 20-30 minutes

---

## 🎯 OPTION 2: Vercel (Frontend) + Railway (Backend)

### Frontend on Vercel
1. Go to https://vercel.com
2. Connect GitHub repo
3. Root directory: `frontend`
4. Build: `npm run build`, Output: `dist`
5. Set environment variables
6. Deploy

### Backend on Railway
- Same as Option 1 above

---

## 📡 OPTION 3: Render.com (Free-Tier Friendly)

#### Deploy Backend
1. Go to https://render.com
2. Connect GitHub
3. Create new Web Service
4. Root: `backend`
5. Environment: Node
6. Build: `npm install`
7. Start: `node server.js`
8. Add environment variables
9. Deploy

#### Deploy Frontend
- Use Render or Vercel (same as above)

---

## 🔐 Environment Variables Template

### Backend .env (Copy All)
#   - SENDGRID_API_KEY (from SendGrid)
#   - SENDGRID_FROM_EMAIL (verified email)
#   - CORS_ORIGIN (leave as localhost for now)
#   - FRONTEND_URL (leave as localhost for now)

# 3. Test backend locally
npm run dev
# Should see: "✓ MongoDB Connected" + "Server running at http://localhost:5000"
```

### PHASE 3: Configure Frontend (5 minutes)

```bash
# 1. Create .env file in frontend folder
# Add:
#   VITE_API_URL=http://localhost:5000/api
#   VITE_APP_NAME=ARWAS World

# 2. Test frontend locally
npm run dev
# Should see: "VITE v4.x.x ready in xxx ms"
```

### PHASE 4: Test Everything Locally (15 minutes)

```
1. Keep backend running (npm run dev)
2. Keep frontend running (npm run dev)
3. Go to: http://localhost:5173

Test 1: Create WhatsApp Order
  - Click "Shop" → Add item → "Checkout"
  - Select "Order via WhatsApp"
  - Fill form → "Send Order to WhatsApp"
  - Should open WhatsApp with pre-filled message ✓

Test 2: Create M-Pesa Order
  - Click "Shop" → Add item → "Checkout"
  - Register/Login (if not already)
  - Select "Order in App"
  - Fill form → "Create Order"
  - Modal should appear for M-Pesa payment ✓
  - Enter phone number (254712345678)
  - Should see: "STK push sent" (or error if no real M-Pesa account) ✓

Test 3: Admin Dashboard
  - Login as: admin@arwas.com / admin123
  - Go: /admin/orders
  - Should see created orders ✓
  - Click order → "Edit" button
  - Should be able to edit delivery details ✓
```

### PHASE 5: Deploy Backend to Railway (20 minutes)

```
1. Go: https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select your GitHub repository
5. Railway auto-detects Node.js
6. Wait for first deployment (5 minutes)

7. After deployment, get your URL:
   - Dashboard shows: https://yourdomain-prod.railway.app
   - Copy this URL

8. Add Environment Variables:
   - Click: Variables tab
   - Add each from your .env file:
     ✓ MONGODB_URI
     ✓ MPESA_CONSUMER_KEY
     ✓ MPESA_CONSUMER_SECRET
     ✓ MPESA_SHORTCODE
     ✓ MPESA_PASSKEY
     ✓ MPESA_CALLBACK_URL = https://yourdomain-prod.railway.app/api/mpesa/callback
     ✓ SENDGRID_API_KEY
     ✓ SENDGRID_FROM_EMAIL
     ✓ SENDGRID_FROM_NAME
     ✓ ADMIN_EMAIL
     ✓ ADMIN_URL
     ✓ ADMIN_WHATSAPP
     ✓ CORS_ORIGIN = https://yourdomain.vercel.app (we'll get this later)
     ✓ FRONTEND_URL = https://yourdomain.vercel.app

9. Test backend is live:
   - Visit: https://yourdomain-prod.railway.app/api/health
   - Should see: {"status": "Backend is running ✓"}
```

### PHASE 6: Deploy Frontend to Vercel (15 minutes)

```
1. Go: https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Vite
6. Click "Deploy"
7. Wait for deployment (2-3 minutes)

8. After deployment, get your URL:
   - Dashboard shows: https://yourdomain.vercel.app
   - Copy this URL

9. Add Environment Variables:
   - Go: Settings → Environment Variables
   - Add:
     ✓ VITE_API_URL = https://yourdomain-prod.railway.app/api
     ✓ VITE_APP_NAME = ARWAS World

10. Redeploy with new variables:
    - Go: Deployments
    - Click "..." on latest deployment
    - Select "Redeploy"
    - Wait 2-3 minutes

11. Test frontend is live:
    - Visit: https://yourdomain.vercel.app
    - Should load your ARWAS World site ✓
```

### PHASE 7: Update Backend CORS & Callback (5 minutes)

```
1. Go back to Railway
2. Update CORS_ORIGIN:
   - Change from localhost to: https://yourdomain.vercel.app
   - Railway auto-redeploys

3. Update MPESA_CALLBACK_URL:
   - Change to: https://yourdomain-prod.railway.app/api/mpesa/callback
   - Railway auto-redeploys

4. Wait 1-2 minutes for redeploy
```

### PHASE 8: End-to-End Testing (15 minutes)

```
Test 1: M-Pesa Payment Flow
  - Go to: https://yourdomain.vercel.app
  - Create order with M-Pesa
  - Should initiate payment
  - Check email for order confirmation ✓

Test 2: Email Notifications
  - Create order
  - Check email inbox for confirmation ✓
  - Admin email should receive notification ✓

Test 3: Admin Dashboard (Live)
  - Go to: https://yourdomain.vercel.app/admin
  - Login as: admin@arwas.com / admin123
  - Should see live orders ✓
  - Edit order details
  - Customer should receive email update ✓

Test 4: WhatsApp Orders
  - Create WhatsApp order
  - Message should go to +254112126757 ✓
```

### PHASE 9: Go Live! 🎉

```
All tests pass?
  ✓ M-Pesa orders work
  ✓ Emails sending
  ✓ Admin dashboard live
  ✓ WhatsApp orders working
  ✓ Frontend loads fast
  ✓ Mobile responsive

If YES: Your ARWAS World platform is LIVE!

Now:
  1. Share your URL
  2. Start accepting orders
  3. Monitor incoming payments
  4. Update delivery tracking
  5. Scale and grow!
```

---

## 🪲 QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Run `npm install` in backend |
| "CORS error" | Update CORS_ORIGIN to your Vercel URL |
| "Emails not sending" | Check SENDGRID_API_KEY is correct and email is verified |
| "M-Pesa: Invalid key" | Copy from Daraja console, not GitHub/docs |
| "Blank Vercel page" | Check VITE_API_URL is set correctly and redeploy |
| "Railway deployment failed" | Check all env vars are set, click "View logs" |

---

## 📱 IMPORTANT PHONE NUMBERS

| Service | Format | Example |
|---------|--------|---------|
| M-Pesa Phone | Start with 254 | 254712345678 |
| WhatsApp Admin | Kenya prefix | 254112126757 |
| SMS Shortcode | 5 digits | 174379 |

---

## 🔑 CREDENTIAL CHECKLIST

Before starting, have these ready:

- [ ] MongoDB Atlas URI
- [ ] SendGrid API Key
- [ ] SendGrid Verified Email
- [ ] M-Pesa Consumer Key
- [ ] M-Pesa Consumer Secret  
- [ ] M-Pesa Pass Key
- [ ] GitHub account (for pushes)
- [ ] Railway account
- [ ] Vercel account

---

## ⏱️ TOTAL TIME ESTIMATE

| Phase | Time |
|-------|------|
| Get Credentials | 30 min |
| Backend Config | 10 min |
| Frontend Config | 5 min |
| Local Testing | 15 min |
| Railway Deploy | 20 min |
| Vercel Deploy | 15 min |
| Backend Update | 5 min |
| End-to-End Test | 15 min |
| **TOTAL** | **~2 hours** |

---

## 🚀 YOU'VE GOT THIS!

All the code is done. Just:
1. Get credentials
2. Fill in .env files
3. Deploy to Railway/Vercel
4. Test
5. Go live!

Questions? Check DEPLOYMENT_GUIDE.md for detailed instructions.
