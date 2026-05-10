const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    tagline: {
      type: String,
      default: 'Est. 2020'
    },
    title: {
      type: String,
      default: 'Custom Apparel That Represents Your Brand'
    },
    subtitle: {
      type: String,
      default:
        'High-quality printing for t-shirts, hoodies, jerseys & corporate merch — delivered in Kenya, Oman & worldwide.'
    },
    buttonText: {
      type: String,
      default: 'Start Designing Now'
    },
    backgroundImage: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=2400&q=80'
    }
  },

  // Welcome Section
  welcome: {
    title: {
      type: String,
      default: 'Welcome to arwas_world'
    },
    description: {
      type: String,
      default: 'Premium Design & Printing Services for Custom Apparel & Branded Merchandise. Explore our shop for custom printed t-shirts, hoodies, jerseys, polos, and more. Serving Kenya 🇰🇪, Oman 🇴🇲, and customers worldwide since 2020.'
    },
    buttonText: {
      type: String,
      default: 'Shop Custom Apparel'
    },
    featuredImage: {
      type: String,
      default: ''
    }
  },

  // Services Section
  services: {
    title: {
      type: String,
      default: 'Our Services'
    },
    description: {
      type: String,
      default: 'We offer a wide range of custom printing and design services'
    },
    items: [
      {
        _id: String,
        title: String,
        description: String,
        icon: String
      }
    ]
  },

  // Custom Apparel - New Collection
  customApparel: {
    title: {
      type: String,
      default: 'Custom Printed Apparel'
    },
    description: {
      type: String,
      default: 'Explore our premium collection of custom printed apparel. From t-shirts to hoodies, jerseys to polos - all crafted with precision and quality.'
    },
    buttonText: {
      type: String,
      default: 'Shop Collection'
    },
    image: {
      type: String,
      default: ''
    }
  },

  // Design & Printing Services - New Collection
  designServices: {
    title: {
      type: String,
      default: 'Design & Printing Services'
    },
    description: {
      type: String,
      default: 'Our expert team offers comprehensive design and printing services. Create stunning branded merchandise with our professional design team.'
    },
    buttonText: {
      type: String,
      default: 'Our Services'
    },
    image: {
      type: String,
      default: ''
    }
  },

  // Shop Page - Custom Apparel Collection
  shopCustomApparel: {
    title: {
      type: String,
      default: 'Custom Apparel'
    },
    description: {
      type: String,
      default: 'Transform your vision into reality. Our expert design and printing services bring your ideas to life on premium hoodies, jerseys, polos, and t-shirts. From concept to final product, we ensure exceptional quality and personalized touches. Perfect for personal projects, corporate branding, or special events.'
    },
    buttonText: {
      type: String,
      default: 'Shop Collection'
    },
    image: {
      type: String,
      default: ''
    }
  },

  // Shop Page - Design & Printing Services
  shopDesignServices: {
    title: {
      type: String,
      default: 'Design & Printing Services'
    },
    description: {
      type: String,
      default: 'Professional design services for all your branding needs. We specialize in custom printing on tumblers, bottles, mugs, and more. Whether it\'s corporate branding or personal projects, our expert team delivers exceptional designs with premium printing quality. Bulk orders welcome!'
    },
    buttonText: {
      type: String,
      default: 'Our Services'
    },
    image: {
      type: String,
      default: ''
    }
  },


  // Collections (product categories)
  collections: {
    items: [
      {
        id: { type: String, default: 't-shirt' },
        name: { type: String, default: 'T-Shirt' },
        description: { type: String, default: 'Classic custom printed t-shirts' },
        image: { type: String, default: '' }
      },
      {
        id: { type: String, default: 'hoodie' },
        name: { type: String, default: 'Hoodie' },
        description: { type: String, default: 'Comfortable hoodies for all seasons' },
        image: { type: String, default: '' }
      },
      {
        id: { type: String, default: 'jersey' },
        name: { type: String, default: 'Jersey' },
        description: { type: String, default: 'Sports jerseys and performance wear' },
        image: { type: String, default: '' }
      },
      {
        id: { type: String, default: 'polo' },
        name: { type: String, default: 'Polo Shirt' },
        description: { type: String, default: 'Elegant polo shirts for professionals' },
        image: { type: String, default: '' }
      },
      {
        id: { type: String, default: 'merchandise' },
        name: { type: String, default: 'Merchandise' },
        description: { type: String, default: 'Custom branded merchandise items' },
        image: { type: String, default: '' }
      },
      {
        id: { type: String, default: 'mug' },
        name: { type: String, default: 'Mug' },
        description: { type: String, default: 'Custom printed mugs and drinkware' },
        image: { type: String, default: '' }
      }
    ],
    featuredCollectionId: {
      type: String,
      default: 't-shirt'
    }
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
