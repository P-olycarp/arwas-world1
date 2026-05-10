import { Link } from 'react-router-dom';

export function FeaturedCollection({ title, image, description, reverse = false, buttonText = 'Shop Collection' }) {
  return (
    <section className="py-14 sm:py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid md:grid-cols-2 gap-10 md:gap-14 items-center ${reverse ? 'md:grid-cols-2' : ''}`}>
          {/* Image */}
          <div className={reverse ? 'md:order-2' : ''}>
            <img
              src={image}
              alt={title}
              className="w-full h-72 sm:h-96 md:min-h-[28rem] object-cover rounded-lg shadow-xl ring-1 ring-black/5"
            />
          </div>

          {/* Content */}
          <div className={reverse ? 'md:order-1' : ''}>
            <p className="text-charcoal/55 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 sm:mb-4">
              New Collection
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-charcoal mb-4 sm:mb-5 leading-tight">
              {title}
            </h2>
            <p className="text-gray-custom text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
              {description}
            </p>
            <Link
              to="/shop"
              className="inline-block border-2 border-charcoal text-charcoal px-6 sm:px-8 py-3 font-semibold hover:bg-charcoal hover:text-white transition"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
