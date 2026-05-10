import React, { useRef, useEffect } from 'react';

export default function OnOfferBanner({ images, onClick }) {
  const containerRef = useRef(null);
  // Auto-scroll logic for background images
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let scroll = 0;
    let interval = setInterval(() => {
      scroll = (scroll + 1) % images.length;
      container.style.backgroundImage = `url(${images[scroll]})`;
    }, 2500);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-40 md:h-56 rounded-xl overflow-hidden flex items-center justify-center mb-6 bg-gray-200"
      style={{
        backgroundImage: images.length ? `url(${images[0]})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.7)',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      <button
        onClick={onClick}
        className="absolute z-10 px-8 py-3 rounded-full bg-charcoal text-white text-lg font-bold shadow-lg hover:bg-yellow-600 transition"
        style={{ filter: 'none' }}
      >
        On Offer
      </button>
      {/* Faded overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
