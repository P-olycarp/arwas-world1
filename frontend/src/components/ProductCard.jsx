import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[2] || 'M');
  
  // Handle both color formats
  const colorArray = product.colors || [];
  const firstColor = colorArray.length > 0 
    ? (typeof colorArray[0] === 'string' ? colorArray[0] : colorArray[0].code)
    : '#1A1A1A';
  
  const [selectedColor, setSelectedColor] = useState(firstColor);
  const { addToCart } = useCart();
  const [feedback, setFeedback] = useState('');

  const isMug = product.category === 'mug';

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize, selectedColor);
    setFeedback('Added to cart!');
    setTimeout(() => setFeedback(''), 2000);
  };

  // Convert colors to consistent format
  const normalizedColors = colorArray.map(color => 
    typeof color === 'string' 
      ? { code: color, name: color }
      : color
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 flex flex-col items-center justify-between transition-transform hover:scale-105 relative">
      {/* Sale Badge */}
      {product.onSale && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">SALE</span>
      )}
      {/* Product Image */}
      <div
        className="relative overflow-hidden bg-gray-100 aspect-square rounded-lg mb-3 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain transition duration-300 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        {isHovered && (
          <button 
            onClick={handleAddToCart}
            className="absolute inset-0 bg-charcoal/80 text-white font-semibold flex items-center justify-center transition duration-300 hover:bg-charcoal rounded-lg"
          >
            Add to Cart
          </button>
        )}
      </div>
      {/* Product Info */}
      <h3 className="text-base sm:text-xl font-bold text-yellow-900 mb-1 sm:mb-2 text-center line-clamp-2">{product.name}</h3>
      <p className="text-yellow-700 font-semibold text-base sm:text-lg mb-1 sm:mb-2">
        {product.currency ? product.currency : 'KES'} {product.price?.toLocaleString()}
      </p>
      {product.description && (
        <div className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-4 text-center">
          <p className="mb-1 line-clamp-3 sm:line-clamp-4">
            {product.description}
          </p>
          {/* Sizing info */}
          {product.sizes && product.sizes.length > 0 && (
            <p className="mt-1"><span className="font-semibold">Available sizes:</span> {product.sizes.join(', ')}</p>
          )}
          {/* Care info */}
          {product.care && (
            <p className="mt-1"><span className="font-semibold">Care:</span> {product.care}</p>
          )}
        </div>
      )}
      {/* Size/Color Options and Add to Cart (if needed) */}
      {!isMug ? (
        <>
          <div className="mb-2 sm:mb-4">
            <label className="text-xs text-gray-custom font-semibold block mb-1 sm:mb-2">
              Size: {selectedSize}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-8 h-8 border text-xs font-medium transition rounded-full ${
                    selectedSize === size
                      ? 'border-charcoal bg-charcoal text-white'
                      : 'border-gray-300 text-charcoal hover:border-charcoal'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          {product.mugDetails?.capacity && (
            <div>
              <label className="text-xs text-gray-custom font-semibold block">
                Capacity: <span className="font-normal">{product.mugDetails.capacity}</span>
              </label>
            </div>
          )}
          {product.mugDetails?.material && (
            <div>
              <label className="text-xs text-gray-custom font-semibold block">
                Material: <span className="font-normal">{product.mugDetails.material}</span>
              </label>
            </div>
          )}
        </div>
      )}
      {/* Colors */}
      {normalizedColors.length > 0 && (
        <div className="mb-2 sm:mb-4">
          <label className="text-xs text-gray-custom font-semibold block mb-1 sm:mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {normalizedColors.map((color) => (
              <button
                key={color.code}
                onClick={() => setSelectedColor(color.code)}
                className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full border-2 cursor-pointer transition ${
                  selectedColor === color.code
                    ? 'border-charcoal scale-110'
                    : 'border-gray-300 hover:border-charcoal'
                }`}
                style={{ backgroundColor: color.code }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
      <button
        onClick={handleAddToCart}
        className="w-full bg-charcoal text-white py-3 text-base font-semibold rounded-lg mt-2 sm:hidden hover:bg-gray-custom transition"
        style={{ fontSize: '1rem', minHeight: '44px' }}
      >
        Add to Cart
      </button>
      {/* Feedback */}
      {feedback && (
        <p className="text-green-600 text-sm font-semibold text-center">
          ✓ {feedback}
        </p>
      )}
    </div>
  );
}
