import React, { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  }

  return (
    <section className="bg-charcoal text-white py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h3 className="text-2xl sm:text-3xl font-serif mb-4">
          Design Inspiration & Offers
        </h3>
        <p className="text-gray-300 mb-6 sm:mb-8">
          Get design tips, inspiration ideas, and exclusive discounts on custom printing and apparel delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
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
            className="w-full sm:w-auto bg-white text-charcoal px-6 sm:px-8 py-3 font-semibold hover:bg-off-white transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
