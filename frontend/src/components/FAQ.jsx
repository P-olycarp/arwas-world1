import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    {
      question: 'How long does delivery take in Kenya and Oman?',
      answer: 'Delivery in Kenya usually takes 1-3 business days. In Oman, delivery is typically 2-5 business days. We always aim for the fastest turnaround!'
    },
    {
      question: 'Can I return or exchange a product?',
      answer: 'Yes! If your item is defective or not as described, you can return or exchange it within 7 days of delivery. Please contact us on WhatsApp for quick support.'
    },
    {
      question: 'How do I customize my order?',
      answer: 'You can specify your customization details during checkout or contact us directly on WhatsApp for special requests. We’ll confirm your design before printing.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept MPesa (Kenya), bank transfer, and cash on delivery. For Oman, we accept local bank transfer and cash on delivery.'
    },
    {
      question: 'Are bulk discounts available?',
      answer: 'Yes! We offer special pricing for bulk and corporate orders. Contact us for a custom quote.'
    }
  ];

  return (
    <section className="py-12 bg-off-white">
      <div className="max-w-2xl mx-auto px-4">
        <h3 className="text-2xl font-bold mb-6 text-charcoal text-center">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border rounded-lg bg-white">
              <button
                className="w-full text-left px-4 py-3 font-semibold text-charcoal focus:outline-none flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                {faq.question}
                <span>{openIndex === idx ? '-' : '+'}</span>
              </button>
              {openIndex === idx && (
                <div className="px-4 pb-4 text-gray-700 text-sm">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
