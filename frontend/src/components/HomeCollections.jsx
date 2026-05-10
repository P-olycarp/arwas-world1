import { Link } from 'react-router-dom';

const FALLBACK_IMAGES = {
  'gift-boxes': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
  caps: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
  mugs: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
  bottles: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
  hoodies: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80',
  'polo-shirts': 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
  't-shirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  jerseys: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
};

function resolveImage(item) {
  if (item.image && item.image.trim()) return item.image;
  const id = (item.id || item.key || '').toLowerCase();
  return FALLBACK_IMAGES[id] || FALLBACK_IMAGES.default;
}

/**
 * Visual collection grid: product-style cards with images (admin or fallbacks).
 */
export function HomeCollections({ items = [], title = 'Shop by category', subtitle = 'Explore our range — each piece is made to represent your brand.' }) {
  if (!items.length) return null;

  return (
    <section className="py-14 sm:py-20 bg-off-white border-y border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <p className="text-charcoal/70 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Collections
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-charcoal mb-3">{title}</h2>
          <p className="text-gray-custom text-base sm:text-lg">{subtitle}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => {
            const id = item.id || item.key;
            const label = item.name || item.label;
            const img = resolveImage(item);
            return (
              <Link
                key={id}
                to={`/shop?category=${encodeURIComponent(id)}`}
                className="group block bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:border-charcoal/20 transition-all duration-300"
              >
                <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                  <img
                    src={img}
                    alt={label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="font-serif text-base sm:text-lg text-charcoal font-semibold group-hover:text-charcoal/90">
                    {label}
                  </h3>
                  {item.description ? (
                    <p className="text-gray-custom text-xs sm:text-sm mt-1 line-clamp-2">{item.description}</p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
