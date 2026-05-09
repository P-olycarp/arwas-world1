# QUICK REFERENCE GUIDE - CODE SNIPPETS & COMMANDS

## TABLE OF CONTENTS
1. [Environment Setup Commands](#environment-setup-commands)
2. [Database Setup](#database-setup)
3. [Common Code Patterns](#common-code-patterns)
4. [API Endpoint Examples](#api-endpoint-examples)
5. [Frontend Component Examples](#frontend-component-examples)
6. [Deployment Commands](#deployment-commands)

---

## ENVIRONMENT SETUP COMMANDS

### Create React App
```bash
# Using Vite (faster)
npm create vite@latest frontend -- --template react
cd frontend
npm install

# Or traditional Create React App
npx create-react-app frontend
cd frontend
```

### Initialize Node.js Backend
```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv axios jsonwebtoken bcryptjs pg body-parser
npm install --save-dev nodemon

# Create basic folder structure
mkdir src
mkdir src/routes src/controllers src/models src/middleware src/services src/config
```

### Setup PostgreSQL Database
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Linux
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows - Download installer from postgresql.org

# Create database
createdb clothes_ecommerce

# Connect to database
psql -U postgres clothes_ecommerce
```

### Install Python Backend (Alternative)
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install flask flask-cors python-dotenv sqlalchemy psycopg2-binary
```

---

## DATABASE SETUP

### PostgreSQL Schema (Users Table)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer', -- 'customer' or 'admin'
    profile_picture_url VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    admin_id INT NOT NULL,
    stock_quantity INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (admin_id) REFERENCES users(id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, shipped, delivered
    shipping_address VARCHAR(500) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Run Script to Create All Tables
```bash
psql -U postgres -d clothes_ecommerce -f database/schema/initial_schema.sql
```

---

## COMMON CODE PATTERNS

### Backend - Express Server Setup
```javascript
// src/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

### Password Hashing (bcryptjs)
```javascript
const bcrypt = require('bcryptjs');

// Hash password during registration
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Compare password during login
async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
```

### JWT Authentication Middleware
```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
```

### Database Connection (PostgreSQL)
```javascript
// src/config/database.js
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

module.exports = pool;
```

---

## API ENDPOINT EXAMPLES

### User Registration
```javascript
// POST /api/auth/register
// Request Body:
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "hashedpassword123",
    "phone": "+1234567890"
}

// Response:
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

### User Login
```javascript
// POST /api/auth/login
// Request Body:
{
    "email": "john@example.com",
    "password": "password123"
}

// Response:
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "name": "John Doe",
        "role": "customer"
    }
}
```

### Get All Products
```javascript
// GET /api/products?category=shirts&page=1&limit=10
// Response:
{
    "success": true,
    "products": [
        {
            "id": 1,
            "name": "Mens T-Shirt",
            "price": 29.99,
            "category": "shirts",
            "image_url": "...",
            "stock": 50
        }
    ],
    "total": 100,
    "page": 1
}
```

### Create Order
```javascript
// POST /api/orders
// Request Body:
{
    "items": [
        {"product_id": 1, "quantity": 2}
    ],
    "shipping_address": "123 Main St, City, State 12345",
    "payment_method": "card"
}

// Response:
{
    "success": true,
    "order": {
        "id": 101,
        "total_amount": 59.98,
        "status": "pending",
        "created_at": "2026-04-08T..."
    }
}
```

### Add Product (Admin)
```javascript
// POST /api/admin/products
// Request Body:
{
    "name": "Women's Jeans",
    "description": "Comfortable blue jeans",
    "price": 79.99,
    "category_id": 2,
    "stock_quantity": 100,
    "sku": "WJ-BLU-001",
    "image_url": "..."
}

// Response:
{
    "success": true,
    "message": "Product added successfully",
    "product": {
        "id": 15,
        "name": "Women's Jeans",
        ...
    }
}
```

---

## FRONTEND COMPONENT EXAMPLES

### React - Login Component
```jsx
// src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}

export default Login;
```

### React - Product Card Component
```jsx
// src/components/ProductCard.jsx
import React from 'react';
import { useCart } from '../hooks/useCart';

function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="product-card">
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="description">{product.description}</p>
            
            <button onClick={() => addToCart(product)}>
                Add to Cart
            </button>
        </div>
    );
}

export default ProductCard;
```

### API Service Layer
```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
```

---

## DEPLOYMENT COMMANDS

### Deploy Frontend (Vercel)
```bash
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

### Deploy Backend (Heroku)
```bash
npm install -g heroku

# Login
heroku login

# Create app
heroku create my-clothing-store-api

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set DATABASE_URL=postgresql://...

# Deploy
git push heroku main
```

### Deploy with Docker
```bash
# Create Dockerfile for backend
docker build -t clothing-store-api .
docker run -p 5000:5000 clothing-store-api

# Docker Compose
docker-compose up -d
```

---

## GIT WORKFLOW

### Basic Git Commands
```bash
# Clone repository
git clone <repo-url>

# Create new branch
git checkout -b feature/new-feature

# Check status
git status

# Stage changes
git add .

# Commit changes
git commit -m "Add feature: new-feature"

# Push to remote
git push origin feature/new-feature

# Create Pull Request on GitHub

# After merge, pull updates
git pull origin main
```

---

## USEFUL NPM PACKAGES

### Frontend
```bash
npm install react-router-dom          # Routing
npm install tailwindcss               # Styling
npm install redux @react-redux        # State management
npm install axios                     # HTTP client
npm install react-toastify            # Notifications
npm install react-helmet              # SEO meta tags
npm install stripe react-stripe-js    # Payment
```

### Backend
```bash
npm install express                   # Web framework
npm install cors                      # CORS handling
npm install dotenv                    # Environment variables
npm install jsonwebtoken              # JWT
npm install bcryptjs                  # Password hashing
npm install pg                        # PostgreSQL
npm install stripe                    # Stripe payments
npm install nodemailer                # Email sending
npm install multer                    # File uploads
```

---

## ENVIRONMENT VARIABLES TEMPLATE

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
REACT_APP_ENVIRONMENT=development
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/clothes_db
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

WHATSAPP_API_KEY=...
INSTAGRAM_ACCESS_TOKEN=...
TWITTER_API_KEY=...
FACEBOOK_PAGE_TOKEN=...

EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=...
EMAIL_FROM=noreply@yoursite.com
```

---

## DEBUGGING TIPS

### Check Server Logs
```bash
# View running processes
lsof -i :5000

# Kill process on port
kill -9 <PID>

# Check Node/npm version
node --version
npm --version
```

### Database Debugging
```bash
# Connect to PostgreSQL
psql -U postgres

# List databases
\l

# Connect to database
\c clothes_ecommerce

# List tables
\dt

# Run query
SELECT * FROM users;

# Exit
\q
```

### Frontend Debugging
```bash
# Check browser console (F12)
console.log()

# React Developer Tools extension
# Redux DevTools extension (if using Redux)

# Use debugger statement
debugger;
```

---

## PERFORMANCE TIPS

1. **Image Optimization**
   - Compress images before upload
   - Use webp format
   - Lazy load images
   - CDN for static files

2. **Database**
   - Add indexes to frequently queried columns
   - Paginate results
   - Avoid n+1 queries

3. **Frontend**
   - Code splitting
   - Minify CSS/JS
   - Use React.memo for components
   - Implement virtual scrolling for long lists

4. **Backend**
   - Use caching (Redis)
   - Implement rate limiting
   - Use connection pooling
   - Optimize queries

---

## SECURITY CHECKLIST

- [ ] Use HTTPS/SSL
- [ ] Hash passwords with bcrypt
- [ ] Use environment variables for secrets
- [ ] Validate all user input
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Implement CORS properly
- [ ] Add rate limiting
- [ ] Use secure headers (helmet.js)
- [ ] Validate JWT tokens
- [ ] Sanitize user output
- [ ] Use secure cookies
- [ ] Implement CSRF protection

---

**Last Updated**: April 8, 2026
**Quick Reference Version**: 1.0
