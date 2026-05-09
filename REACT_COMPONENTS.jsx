// REACT COMPONENTS - Ready to use

// ============================================
// 1. NAVBAR COMPONENT
// ============================================

import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-serif font-bold text-charcoal">arwas_world</h1>
            <p className="text-xs text-gray-custom tracking-widest">Simply Elegant</p>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="/" className="text-charcoal hover:text-gray-custom transition">
              Shop
            </a>
            <a href="/about" className="text-charcoal hover:text-gray-custom transition">
              About
            </a>
            <a href="/contact" className="text-charcoal hover:text-gray-custom transition">
              Contact
            </a>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <Search className="w-5 h-5 text-charcoal cursor-pointer" />
            <a href="/account" className="text-charcoal hover:text-gray-custom transition">
              Account
            </a>
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-charcoal cursor-pointer" />
              <span className="absolute -top-2 -right-2 bg-charcoal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-charcoal" />
              ) : (
                <Menu className="w-6 h-6 text-charcoal" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <a href="/" className="block text-charcoal hover:text-gray-custom">
              Shop
            </a>
            <a href="/about" className="block text-charcoal hover:text-gray-custom">
              About
            </a>
            <a href="/contact" className="block text-charcoal hover:text-gray-custom">
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

// ============================================
// 2. HERO SECTION COMPONENT
// ============================================

export function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://picsum.photos/1200/700)',
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <p className="text-white text-lg md:text-xl mb-4 tracking-widest uppercase">
          Est. 2020
        </p>
        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 max-w-3xl">
          Custom Printed Apparel
        </h1>
        <p className="text-white text-lg mb-8 max-w-2xl">
          Premium Design & Printing Services for Custom Apparel & Branded Merchandise
        </p>
        <button className="bg-charcoal text-white px-8 py-3 text-lg hover:bg-gray-custom transition">
          Start Your Design
        </button>
      </div>
    </section>
  );
}

// ============================================
// 3. PRODUCT CARD COMPONENT
// ============================================

export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-white">
      {/* Product Image */}
      <div
        className="relative overflow-hidden bg-gray-100 aspect-square"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition duration-300 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Add to Cart Button on Hover */}
        {isHovered && (
          <button className="absolute inset-0 bg-charcoal/80 text-white font-semibold flex items-center justify-center transition duration-300">
            Add to Cart
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-4 pb-6">
        <h3 className="text-lg font-semibold text-charcoal mb-2">
          {product.name}
        </h3>
        <p className="text-gray-custom mb-4">${product.price}</p>

        {/* Size/Color Options */}
        <div className="flex gap-2 mb-4">
          {product.sizes?.map((size) => (
            <button
              key={size}
              className="w-8 h-8 border border-gray-300 text-xs font-medium text-charcoal hover:border-charcoal transition"
            >
              {size}
            </button>
          ))}
        </div>

        {/* Colors */}
        {product.colors && (
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <div
                key={color}
                className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer hover:border-charcoal transition"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// 4. PRODUCT GRID COMPONENT
// ============================================

export function ProductGrid({ products, title }) {
  return (
    <section className="py-16 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        {title && (
          <>
            <h2 className="text-4xl md:text-5xl font-serif text-center text-charcoal mb-4">
              {title}
            </h2>
            <div className="w-20 h-0.5 bg-charcoal mx-auto mb-12"></div>
          </>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 5. FEATURED COLLECTION COMPONENT
// ============================================

export function FeaturedCollection({ title, image, description, reverse = false }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse && 'md:grid-cols-2'}`}>
          {/* Image */}
          <div className={reverse && 'md:order-2'}>
            <img
              src={image}
              alt={title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Content */}
          <div className={reverse && 'md:order-1'}>
            <p className="text-gray-custom text-sm tracking-widest uppercase mb-4">
              New Collection
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
              {title}
            </h2>
            <p className="text-gray-custom text-lg leading-relaxed mb-8">
              {description}
            </p>
            <button className="border-2 border-charcoal text-charcoal px-8 py-3 font-semibold hover:bg-charcoal hover:text-white transition">
              Shop Collection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 6. NEWSLETTER COMPONENT
// ============================================

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  }

  return (
    <section className="bg-charcoal text-white py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-serif mb-4">
          Design Inspiration & Offers
        </h3>
        <p className="text-gray-300 mb-8">
          Get design tips, inspiration ideas, and exclusive discounts on custom printing and apparel delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 text-charcoal focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-white text-charcoal px-8 py-3 font-semibold hover:bg-off-white transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

// ============================================
// 7. FOOTER COMPONENT
// ============================================

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">About arwas_world</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              arwas_world - "Simply Elegant" - Premium Design & Printing since 2020. Specializing in custom apparel and branded merchandise for Kenya 🇰🇪, Oman 🇴🇲, and worldwide clients. Every piece is designed with quality and customization in mind.
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="mailto:giftmateoman@gmail.com" className="hover:text-white transition">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition">Shipping to Kenya & Oman</a></li>
              <li><a href="#" className="hover:text-white transition">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition">Customization Info</a></li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Custom Apparel</a></li>
              <li><a href="#" className="hover:text-white transition">Design Services</a></li>
              <li><a href="#" className="hover:text-white transition">Printing Services</a></li>
              <li><a href="#" className="hover:text-white transition">Branded Merchandise</a></li>
            </ul>
          </div>

          {/* Follow */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://instagram.com/giftmateoman" className="hover:text-white transition">@giftmateoman (Instagram)</a></li>
              <li><a href="https://instagram.com/tidmusic" className="hover:text-white transition">@tidmusic (Featured Artist)</a></li>
              <li><a href="#" className="hover:text-white transition">Brand Manager Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © 2026 arwas_world. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// 8. HOME PAGE - PUT IT ALL TOGETHER
// ============================================

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: 'Custom Printed T-Shirt',
      price: 'From 1499',
      image: 'https://picsum.photos/400/500?random=1',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#1A1A1A', '#FFFFFF', '#FF6B6B', '#4ECDC4'],
    },
    {
      id: 2,
      name: 'Custom Printed Hoodie',
      price: 'From 2499',
      image: 'https://picsum.photos/400/500?random=2',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#1A1A1A', '#2C3E50', '#E74C3C'],
    },
    {
      id: 3,
      name: 'Custom Printed Jersey',
      price: 'From 1999',
      image: 'https://picsum.photos/400/500?random=3',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#1A1A1A', '#3498DB', '#F39C12'],
    },
    {
      id: 4,
      name: 'Custom Printed Polo',
      price: 'From 1899',
      image: 'https://picsum.photos/400/500?random=4',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['#1A1A1A', '#FFFFFF', '#27AE60'],
    },
  ];

  return (
    <div className="bg-off-white">
      <Navbar />
      <Hero />
      <ProductGrid products={featuredProducts} title="Our Custom Apparel Collection" />
      <FeaturedCollection
        title="Custom Apparel"
        image="https://picsum.photos/600/400?random=5"
        description="Transform your vision into reality. Our expert design and printing services bring your ideas to life on premium hoodies, jerseys, polos, and t-shirts. From concept to final product, we ensure exceptional quality and personalized touches. Perfect for personal projects, corporate branding, or special events."
      />
      <ProductGrid products={featuredProducts.slice(0, 3)} title="Featured Products" />
      <FeaturedCollection
        title="Design & Printing Services"
        image="https://picsum.photos/600/400?random=6"
        description="Professional design services for all your branding needs. We specialize in custom printing on tumblers, bottles, mugs, and more. Whether it's corporate branding or personal projects, our expert team delivers exceptional designs with premium printing quality. Bulk orders welcome!"
        reverse={true}
      />
      <Newsletter />
      <Footer />
    </div>
  );
}
