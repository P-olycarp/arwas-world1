import React from 'react';

const defaultCategories = [
  { key: 'gift-boxes', label: 'Customised Gift Boxes', image: '' },
  { key: 'caps', label: 'Customised Caps', image: '' },
  { key: 'mugs', label: 'Mugs', image: '' },
  { key: 'bottles', label: 'Water Bottles', image: '' },
  { key: 'hoodies', label: 'Hoodies', image: '' },
  { key: 'polo-shirts', label: 'Polo Shirts', image: '' },
  { key: 't-shirts', label: 'T-Shirts', image: '' },
  { key: 'jerseys', label: 'Jerseys', image: '' },
];

export default function CategoryMenu({ selected, onSelect, categories = defaultCategories }) {
  const displayCategories = [...categories].reverse();

  return (
    <div className="flex flex-wrap justify-center gap-4 py-4">
      {displayCategories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={`px-4 py-2 rounded-full font-semibold border transition-all ${
            selected === cat.key
              ? 'bg-charcoal text-white border-charcoal'
              : 'bg-white text-charcoal border-gray-300 hover:border-charcoal'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
