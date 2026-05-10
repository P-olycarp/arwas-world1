import React from 'react';

const posts = [
  {
    title: 'How to Care for Custom Printed Apparel',
    date: '2026-04-19',
    summary: 'Tips for keeping your printed shirts and hoodies looking fresh and vibrant.',
    content: 'Always wash inside out, use cold water, and avoid harsh detergents. Air dry for best results.'
  },
  {
    title: 'Bulk Orders: Save More for Your Team or Event',
    date: '2026-04-10',
    summary: 'Learn how bulk discounts work and how to get the best value for your group.',
    content: 'Contact us for a custom quote. The more you order, the more you save!'
  },
  {
    title: 'Customer Story: Fast Delivery in Nairobi',
    date: '2026-03-28',
    summary: 'See how we helped a local business get branded shirts in just 2 days.',
    content: 'Our express service delivered 50 shirts to a Nairobi business in record time.'
  }
];

export default function Blog() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-charcoal text-center">Blog & News</h2>
        <div className="space-y-8">
          {posts.map((post, idx) => (
            <article key={idx} className="border-b pb-6">
              <h3 className="text-xl font-semibold text-charcoal mb-1">{post.title}</h3>
              <p className="text-xs text-gray-400 mb-2">{post.date}</p>
              <p className="text-gray-700 mb-2">{post.summary}</p>
              <details>
                <summary className="text-green-700 cursor-pointer">Read more</summary>
                <div className="mt-2 text-gray-600 text-sm">{post.content}</div>
              </details>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
