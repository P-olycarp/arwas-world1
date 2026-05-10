import React from 'react';

export default function Testimonials() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold mb-6 text-charcoal">What Our Clients Say</h3>
        <div className="space-y-8">
          <blockquote className="text-lg italic text-gray-700">
            “100+ satisfied clients! Arwas World delivered our shirts fast and the quality was top-notch.”
            <footer className="mt-2 text-sm text-gray-500">— Client in Nairobi</footer>
          </blockquote>
          <blockquote className="text-lg italic text-gray-700">
            “Bulk discounts made our event affordable. Highly recommend for any business!”
            <footer className="mt-2 text-sm text-gray-500">— Event Organizer, Oman</footer>
          </blockquote>
          <blockquote className="text-lg italic text-gray-700">
            “Super quick delivery in Kenya. Will order again!”
            <footer className="mt-2 text-sm text-gray-500">— Happy Customer, Kenya</footer>
          </blockquote>
          <blockquote className="text-lg italic text-gray-700">
            “The print quality exceeded my expectations. My team loved the new jerseys!”
            <footer className="mt-2 text-sm text-gray-500">— Sports Team, Mombasa</footer>
          </blockquote>
          <blockquote className="text-lg italic text-gray-700">
            “Excellent customer service and fast response on WhatsApp. Will recommend to friends in Muscat!”
            <footer className="mt-2 text-sm text-gray-500">— Customer, Oman</footer>
          </blockquote>
          <blockquote className="text-lg italic text-gray-700">
            “Ordered in Nairobi, delivered in two days. Hassle-free and great value.”
            <footer className="mt-2 text-sm text-gray-500">— Business Owner, Kenya</footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
