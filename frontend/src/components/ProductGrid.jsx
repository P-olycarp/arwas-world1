import { ProductCard } from './ProductCard';

export function ProductGrid({ products, title }) {
  // Handle both old format (array of strings) and new format (array of objects with name and code)
  const normalizedProducts = products.map(product => ({
    ...product,
    colors: product.colors?.map(color => 
      typeof color === 'string' ? { code: color, name: color } : color
    ) || []
  }));

  return (
    <section className="py-16 bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        {title && (
          <>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-center text-charcoal mb-3 sm:mb-4">
              {title}
            </h2>
            <div className="w-16 sm:w-20 h-0.5 bg-charcoal mx-auto mb-8 sm:mb-12"></div>
          </>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {normalizedProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
