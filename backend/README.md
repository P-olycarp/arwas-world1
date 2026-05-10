# arwas_world Backend API

Backend server for arwas_world - Custom Apparel & Printing Services

## Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud connection)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
Edit `.env` file with your settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/arwas_world
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

3. **Start server**
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run at `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:id` - Get single order
- `GET /api/orders/track/:orderNumber` - Track order
- `PUT /api/orders/:id` - Update order
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `GET /api/users/:id/orders` - Get user orders

## Database Schema

### Product
- name, description, price, basePrice
- category (t-shirt, hoodie, jersey, polo, merchandise)
- image, sizes, colors
- stock, printingMethods, minOrderQuantity
- bulkDiscounts, customizable

### Order
- orderNumber, customer info
- items (product, quantity, size, color, design, printing method)
- totalAmount, status, paymentStatus
- shippingAddress, trackingNumber

### User
- firstName, lastName, email, password
- phone, address, role (customer/admin)
- orderHistory, savedDesigns
- preferences (newsletter, orderNotifications)

## Environment Variables

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/arwas_world
JWT_SECRET=your_jwt_secret_key_here_change_in_production
CORS_ORIGIN=http://localhost:5173
```

## Note

For MongoDB setup:
- **Local**: Install MongoDB locally
- **Cloud**: Use MongoDB Atlas (free tier available)
  - Connection string: `mongodb+srv://username:password@cluster.mongodb.net/arwas_world`
