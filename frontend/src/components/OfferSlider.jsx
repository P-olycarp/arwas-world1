
import React, { useRef, useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const OfferSlider = ({ products }) => {
  const containerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let autoScroll = true;
    let scrollAmount = 340;
    let interval = setInterval(() => {
      if (autoScroll) {
        if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000);
    // Pause auto-scroll on user interaction
    const pause = () => { autoScroll = false; };
    const resume = () => { autoScroll = true; };
    container.addEventListener('mousedown', pause);
    container.addEventListener('touchstart', pause);
    container.addEventListener('mouseup', resume);
    container.addEventListener('mouseleave', resume);
    container.addEventListener('touchend', resume);
    return () => {
      clearInterval(interval);
      container.removeEventListener('mousedown', pause);
      container.removeEventListener('touchstart', pause);
      container.removeEventListener('mouseup', resume);
      container.removeEventListener('mouseleave', resume);
      container.removeEventListener('touchend', resume);
    };
  }, []);

  // Show scroll buttons on hover/touch near edges
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setShowLeft(x < 60);
    setShowRight(x > rect.width - 60);
  };
  const handleMouseLeave = () => {
    setShowLeft(false);
    setShowRight(false);
  };
  const handleTouchStart = (e) => {
    setIsTouching(true);
    if (!containerRef.current) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    setShowLeft(x < 60);
    setShowRight(x > rect.width - 60);
  };
  const handleTouchEnd = () => {
    setIsTouching(false);
    setShowLeft(false);
    setShowRight(false);
  };

  const scrollAmount = 340;
  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };
  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Use the first product's image as hero background (admin can control order)
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  };
  const heroImage = products[0]?.image ? `url(${getImageUrl(products[0].image)})` : undefined;

  return (
    <section className="relative h-[420px] sm:h-[520px] md:h-[600px] overflow-hidden rounded-2xl shadow-xl mb-10 flex flex-col justify-center">
      {/* Hero-style background */}
      {heroImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: heroImage }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}
      {/* Overlayed content */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white text-center mb-6 drop-shadow-lg uppercase tracking-wider">On Offer</h2>
        <div
          ref={containerRef}
          className="flex gap-10 overflow-x-auto px-20 py-2 scrollbar-hide items-center"
          style={{ scrollBehavior: 'smooth' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {products.map(product => (
            <div key={product._id || product.id} className="min-w-[340px] max-w-sm flex-shrink-0 flex items-center justify-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {/* Invisible/fade-in scroll buttons */}
        <button
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-white/30 text-white shadow-lg hover:bg-yellow-500/80 transition-opacity duration-200 ${showLeft || isTouching ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 flex items-center justify-center rounded-full bg-white/30 text-white shadow-lg hover:bg-yellow-500/80 transition-opacity duration-200 ${showRight || isTouching ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
};

export default OfferSlider;
