const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  customerCountry: {
    type: String,
    required: true
  },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    productName: String,
    quantity: Number,
    size: String,
    color: String,
    customDesign: {
      type: String, // URL to uploaded design
      required: false
    },
    designDescription: String,
    printingMethod: String,
    pricePerUnit: Number,
    totalPrice: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'designing', 'printing', 'quality-check', 'ready-shipping', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: String,
  source: {
    type: String,
    enum: ['whatsapp', 'app'],
    default: 'whatsapp'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  deliveryDetails: {
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    trackingNumber: String,
    shippingCompany: String,
    shippingCost: Number,
    deliveryInstructions: String
  },
  notes: String,
  internalNotes: String, // For admin communication
  
  // M-Pesa Payment Details
  mpesaCheckoutRequestId: String,
  mpesaTransactionId: String,
  mpesaPhone: String,
  paymentHistory: [{
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed']
    },
    amount: Number,
    method: String,
    transactionId: String,
    reason: String, // For failed payments
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
