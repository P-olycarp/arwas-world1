const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  basePrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  mugDetails: {
    material: String, // Ceramic, Stainless Steel, etc.
    capacity: String, // 11oz, 15oz, etc.
    printPlacement: String, // Wrap Around, Front, Handle, etc.
    dishwasherSafe: Boolean,
    microwave: Boolean
  },
  image: {
    type: String,
    required: true
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }],
  colors: [{
    name: String,
    code: String // hex code like #1A1A1A
  }],
  stock: {
    type: Number,
    default: 0
  },
  printingMethods: [{
    type: String,
    enum: ['screen-print', 'dtg', 'embroidery', 'heat-transfer']
  }],
  minOrderQuantity: {
    type: Number,
    default: 1
  },
  bulkDiscounts: [{
    quantity: Number,
    discountPercent: Number
  }],
  onOffer: {
    type: Boolean,
    default: false
  },
  offerOrder: {
    type: Number,
    default: 0,
    min: 0,
    description: 'Controls the order of products in the On Offer slider. Lower numbers appear first.'
  },
  customizable: {
    type: Boolean,
    default: true
  },
  currency: {
    type: String,
    enum: ['KES', 'OMR'],
    default: 'KES'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
