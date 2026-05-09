# ARWAS WORLD - DEPLOYMENT & INTEGRATION GUIDE

## 📋 QUICK CHECKLIST

- [ ] **MongoDB Atlas** - Cluster created, connection string ready
- [ ] **SendGrid** - Account created, API key obtained
- [ ] **M-Pesa Daraja API** - Consumer Key, Secret, Passkey retrieved
- [ ] **Railway** - Backend deployed
- [ ] **Vercel** - Frontend deployed
- [ ] **Environment Variables** - All configured in Railway & Vercel
- [ ] **M-Pesa Callback URL** - Updated to production URL
- [ ] **Testing** - End-to-end flow verified

---

## 1️⃣ BACKEND SETUP

### Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `@sendgrid/mail@7.7.0` - Email service
- `axios@1.4.0` - HTTP client for M-Pesa API calls
- All other existing dependencies

### Environment Variables (.env file)

Create a `.env` file in `/backend` with these variables:

```env
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/arwas_world

# Server/API
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com

# M-Pesa Credentials (from Daraja API console)
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=https://your-backend-api.com/api/mpesa/callback

# SendGrid Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@arwas-world.com
SENDGRID_FROM_NAME=ARWAS World
ADMIN_EMAIL=admin@arwas-world.com
ADMIN_URL=https://yourdomain.com/admin

# Admin WhatsApp
ADMIN_WHATSAPP=254112126757
```

**IMPORTANT**: Do NOT commit `.env` file to git (already in .gitignore)

---

## 2️⃣ FRONTEND SETUP

### Environment Variables (.env file)

Create a `.env` file in `/frontend` with these variables:

```env
VITE_API_URL=https://your-backend-api.com/api
VITE_APP_NAME=ARWAS World
```

For local development:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ARWAS World
```

---

## 3️⃣ DATABASE SETUP - MongoDB Atlas

### Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project (e.g., "ARWAS World")
4. Click **"Databases"** → **"Create"**
5. Choose:
   - Cloud provider: **AWS**
   - Region: **us-east-1** (or closest to your users)
   - Tier: **M0 (Free)** or **M10 (Shared)**
   - Cluster name: `arwas-world-cluster`
   
6. Click **"Create Cluster"** (takes 5-10 minutes)

### Get Connection String

1. In your cluster, click **"Connect"**
2. Choose **"Connect to your application"**
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `myFirstDatabase` with `arwas_world`

Example:
```
mongodb+srv://arwas_user:MyPassword123@cluster0.xyz.mongodb.net/arwas_world?retryWrites=true&w=majority
```

6. Add this as `MONGODB_URI` in your `.env` file

---

## 4️⃣ EMAIL SERVICE SETUP - SendGrid

### Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com)
2. Sign up for **Free** account (up to 100 emails/day)
3. Verify your email
4. Complete account setup

### Get API Key

1. Go to **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name it: `ARWAS_World_Production`
4. Assign **Full Access** permissions
5. Copy the key and save immediately (won't show again!)
6. Add to `.env` as `SENDGRID_API_KEY`

### Verify Sender Email (Free Account)

1. Go to **Sender Authentication** → **Single Sender Verification**
2. Click **"Create New Sender"**
3. Enter details:
   - Name: ARWAS World
   - Email: `noreply@arwas-world.com` (or your domain email)
4. Verify by clicking link in confirmation email
5. Use this email in `SENDGRID_FROM_EMAIL`

### Email Limits
- **Free Plan**: 100 emails per day (perfect for launching)
- **Paid Plans**: Starting $9.95/month for unlimited emails

---

## 5️⃣ M-PESA INTEGRATION

### Get M-Pesa Credentials

#### Step 1: Create Safaricom Developer Account
1. Go to [Daraja API Console](https://developer.safaricom.co.ke)
2. Sign up with your email
3. Verify email
4. Complete profile

#### Step 2: Create an Application
1. Go to **"My Apps"** → **"Create App"**
2. Fill in:
   - **App Name**: ARWAS World Pro
   - **App Type**: Web Application
   - **Description**: Custom apparel & design e-commerce
3. Click **"Create"**

#### Step 3: Get Your Credentials
Navigate to your app and copy:
- **Consumer Key** → Add to `MPESA_CONSUMER_KEY`
- **Consumer Secret** → Add to `MPESA_CONSUMER_SECRET`

#### Step 4: Get Pass Key (for STK Push)
1. Go to your app → **"Keys"**
2. Find **"Passkey"** section (different from Consumer Secret)
3. Copy the passkey → Add to `MPESA_PASSKEY`

#### Step 5: B2C Shortcode
- Use provided **Business Shortcode**: `174379`
- This is added to `MPESA_SHORTCODE`

### M-Pesa API Endpoints Available

After integration, your backend has these endpoints:

**Initiate STK Push** (Daraja Sandbox)
- Method: `POST`
- URL: `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`
- Body: Phone, Amount, Timestamp, Password (Base64 encoded)

**Payment Callback**
- Method: `POST`
- Endpoint: `/api/mpesa/callback`
- Data: Payment confirmation from M-Pesa

### Important Note
The current setup uses **Sandbox** (testing):
- URL: `https://sandbox.safaricom.co.ke`
- For **production**, change to: `https://api.safaricom.co.ke`
- Only real M-Pesa accounts can complete payments in sandbox

---

## 6️⃣ DEPLOYMENT

### Deploy Backend to Railway

#### Initial Setup
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub repository
4. Click **"New Project"** → **"Deploy from GitHub"**
5. Select your `Arwas-world` repository
6. Railway auto-detects Node.js app
7. Wait for first deployment

#### Add Environment Variables
1. In Railway dashboard, go to your project
2. Click **"Variables"** tab
3. Add all variables from your `.env`:
   ```
   MONGODB_URI=mongodb+srv://...
   CORS_ORIGIN=https://yourdomain.railway.app
   MPESA_CONSUMER_KEY=xxx
   MPESA_CONSUMER_SECRET=xxx
   SENDGRID_API_KEY=xxx
   ... (all others from .env)
   ```
4. Update `MPESA_CALLBACK_URL`:
   ```
   https://yourdomain-prod.railway.app/api/mpesa/callback
   ```

#### Get Your Backend URL
- Railway generates a URL like: `https://arwas-world-backend-prod.railway.app`
- Use this as `VITE_API_URL` in frontend

### Deploy Frontend to Vercel

#### Initial Setup
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"** → **"Import Git Repository"**
4. Select your repository
5. Vercel auto-detects Vite configuration
6. Click **"Deploy"**

#### Add Environment Variables
1. After deployment, go to **Settings** → **Environment Variables**
2. Add:
   ```
   VITE_API_URL=https://your-railway-backend-url.com/api
   VITE_APP_NAME=ARWAS World
   ```
3. Redeploy: Click **"Deployments"** → **"..." → "Redeploy"**

#### Your Frontend URL
- Vercel generates a URL like: `https://arwas-world.vercel.app`
- Update backend's `CORS_ORIGIN` with this URL

---

## 7️⃣ POST-DEPLOYMENT VERIFICATION

### Test Email Service
1. Create an order in the app
2. Check email for order confirmation
3. Admin should receive notification email

### Test M-Pesa Integration
1. Create an app order
2. Enter test phone number: Use a phone with M-Pesa active
3. Verify STK push prompt appears on phone
4. Complete payment in M-Pesa
5. Check order status updates to "processing"
6. Verify status update email received

### Test WhatsApp Integration
1. Create a WhatsApp order
2. Verify message goes to +254112126757
3. Admin can manually confirm payment

### Test Admin Dashboard
1. Log in with: `admin@arwas.com` / `admin123`
2. View orders with delivery tracking
3. Edit order status and delivery details
4. Verify customer receives update email

---

## 8️⃣ TROUBLESHOOTING

### M-Pesa Payment Not Initiating
**Error**: "Failed to authenticate with M-Pesa"
- ✓ Verify Consumer Key and Secret are correct
- ✓ Check they're from the right app in Daraja console
- ✓ Verify internet connection on server
- ✓ Check if using sandbox or production URL

**Error**: "Invalid phone number format"
- ✓ Format should be: `254XXXXXXXXX` (must start with 254)
- ✓ Phone must be 12 digits total
- ✓ Example: `254712345678`

### Emails Not Sending
**Error**: "Failed to send email"
- ✓ Verify `SENDGRID_API_KEY` is correct
- ✓ Check sender email is verified in SendGrid
- ✓ Verify `SENDGRID_FROM_EMAIL` matches verified address
- ✓ Check email isn't going to spam folder
- ✓ Free account: Check daily limit (100 emails/day)

### CORS Errors
**Error**: "Access blocked by CORS policy"
- ✓ Update `CORS_ORIGIN` to your deployed frontend URL
- ✓ Don't include trailing slashes
- ✓ Example: `https://arwas-world.vercel.app`

### MongoDB Connection Issues
**Error**: "Failed to connect to MongoDB"
- ✓ Verify connection string format
- ✓ Check IP whitelist in MongoDB Atlas
- ✓ Verify username/password are correct
- ✓ Database name should be `arwas_world`

---

## 9️⃣ PRODUCTION CHECKLIST

Before going live with real customers:

- [ ] Test all payment flows (WhatsApp + M-Pesa)
- [ ] Verify all email notifications work
- [ ] Test order tracking updates
- [ ] Admin can edit delivery details
- [ ] Images upload without errors
- [ ] Product creation works smoothly
- [ ] Mobile responsive design works
- [ ] Password reset works (if implemented)
- [ ] Logout clears session properly
- [ ] Cart persists across sessions

---

## 🚀 QUICK START COMMANDS

### Local Development
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Deploy to Production
```bash
# Push code to GitHub
git add .
git commit -m "Deploy payment and email integration"
git push origin main

# Railway auto-deploys when detecting new code
# Vercel auto-deploys when detecting new code
```

---

## 📞 SUPPORT CONTACTS

- **M-Pesa Support**: https://developer.safaricom.co.ke/support
- **SendGrid Support**: support@sendgrid.com
- **MongoDB Atlas Support**: https://www.mongodb.com/support
- **Railway Support**: support@railway.app
- **Vercel Support**: https://vercel.com/help

---

## 💡 NEXT STEPS

1. **Set up MongoDB Atlas cluster** (5-10 mins)
2. **Create SendGrid account** (2-3 mins)
3. **Get M-Pesa credentials** (10-15 mins)
4. **Configure environment variables** (5 mins)
5. **Deploy backend to Railway** (5-10 mins)
6. **Deploy frontend to Vercel** (5-10 mins)
7. **Run end-to-end tests** (10-15 mins)
8. **Launch!** 🎉
