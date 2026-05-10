import { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { FeaturedCollection } from '../components/FeaturedCollection';
import { HomeCollections } from '../components/HomeCollections';
import { HomeServices } from '../components/HomeServices';
import { getSettings, getProducts } from '../services/api';
import Testimonials from '../components/Testimonials';
import WhatsAppButton from '../components/WhatsAppButton';
import FAQ from '../components/FAQ';
import Blog from '../blog/Blog';

const getAbsoluteImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${url}`;
};

/** When admin has not saved collections yet, still show a visual category grid */
const FALLBACK_COLLECTION_ITEMS = [
  { id: 'gift-boxes', name: 'Customised Gift Boxes', description: 'Curated gift packaging', image: '' },
  { id: 'caps', name: 'Customised Caps', description: 'Headwear & branding', image: '' },
  { id: 'mugs', name: 'Mugs', description: 'Drinkware printing', image: '' },
  { id: 'bottles', name: 'Water Bottles', description: 'Reusable bottles', image: '' },
  { id: 'hoodies', name: 'Hoodies', description: 'Layered apparel', image: '' },
  { id: 'polo-shirts', name: 'Polo Shirts', description: 'Professional polos', image: '' },
  { id: 't-shirts', name: 'T-Shirts', description: 'Core custom tees', image: '' },
  { id: 'jerseys', name: 'Jerseys', description: 'Team & sportswear', image: '' },
];

export default function Home() {
  const [welcomeData, setWelcomeData] = useState({
    title: 'Welcome to arwas_world',
    description: 'Premium Design & Printing Services for Custom Apparel & Branded Merchandise. Explore our shop for custom printed t-shirts, hoodies, jerseys, polos, and more. Serving Kenya 🇰🇪, Oman 🇴🇲, and customers worldwide since 2020.',
    buttonText: 'Shop Custom Apparel',
    featuredImage: ''
  });
  const [customApparelData, setCustomApparelData] = useState({
    title: 'Custom Printed Apparel',
    description: 'Explore our premium collection of custom printed apparel. From t-shirts to hoodies, jerseys to polos - all crafted with precision and quality.',
    buttonText: 'Shop Collection',
    image: ''
  });
  const [designServicesData, setDesignServicesData] = useState({
    title: 'Design & Printing Services',
    description: 'Our expert team offers comprehensive design and printing services. Create stunning branded merchandise with our professional design team.',
    buttonText: 'Our Services',
    image: ''
  });
  const [loading, setLoading] = useState(true);
  const [collectionsItems, setCollectionsItems] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [servicesSection, setServicesSection] = useState({
    title: 'What we do',
    description:
      'End-to-end printing and design for apparel and branded merchandise.',
    items: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, products] = await Promise.all([
          getSettings(),
          getProducts()
        ]);
        setAllProducts(products || []);
        if (settings.welcome) {
          setWelcomeData({
            ...settings.welcome,
            featuredImage: getAbsoluteImageUrl(settings.welcome.featuredImage)
          });
        }
        if (settings.customApparel) {
          setCustomApparelData({
            ...settings.customApparel,
            image: getAbsoluteImageUrl(settings.customApparel.image)
          });
        }
        if (settings.designServices) {
          setDesignServicesData({
            ...settings.designServices,
            image: getAbsoluteImageUrl(settings.designServices.image)
          });
        }
        // Get admin-set category images if available
        setCategoryImages(settings.categoryImages || {});
        const categories = [
          { id: 'gift-boxes', name: 'Customised Gift Boxes', description: 'Curated gift packaging' },
          { id: 'caps', name: 'Customised Caps', description: 'Headwear & branding' },
          { id: 'mugs', name: 'Mugs', description: 'Drinkware printing' },
          { id: 'bottles', name: 'Water Bottles', description: 'Reusable bottles' },
          { id: 'hoodies', name: 'Hoodies', description: 'Layered apparel' },
          { id: 'polo-shirts', name: 'Polo Shirts', description: 'Professional polos' },
          { id: 't-shirts', name: 'T-Shirts', description: 'Core custom tees' },
          { id: 'jerseys', name: 'Jerseys', description: 'Team & sportswear' },
        ];
        const getRandomImage = (catId) => {
          const catProducts = (products || []).filter(p => (p.category || '').toLowerCase() === catId);
          if (catProducts.length > 0) {
            const random = catProducts[Math.floor(Math.random() * catProducts.length)];
            return random.image ? getAbsoluteImageUrl(random.image) : '';
          }
          return '';
        };
        setCollectionsItems(
          categories.map(cat => {
            // 1. Use admin-set image if available
            let img = settings.categoryImages && settings.categoryImages[cat.id]
              ? getAbsoluteImageUrl(settings.categoryImages[cat.id])
              : '';
            // 2. If not, use random product image
            if (!img) {
              img = getRandomImage(cat.id);
            }
            // 3. If still not, use fallback
            if (!img) {
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
              img = FALLBACK_IMAGES[cat.id] || FALLBACK_IMAGES.default;
            }
            return {
              ...cat,
              image: img
            };
          })
        );
        if (settings.services) {
          setServicesSection({
            title: settings.services.title || 'What we do',
            description:
              settings.services.description ||
              'End-to-end printing and design for apparel and branded merchandise.',
            items: settings.services.items || [],
          });
        }
      } catch (err) {
        console.error('Failed to fetch home settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-off-white">
        <Hero />
        <div className="py-20 bg-white text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-off-white">
      <Hero />
      {/* Trust Elements */}
      <section className="py-6 bg-green-50 border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <div className="flex-1">
            <span className="text-2xl font-bold text-green-700">100+ satisfied clients</span>
          </div>
          <div className="flex-1">
            <span className="text-lg font-semibold text-green-700">Fast delivery in Kenya & Oman</span>
          </div>
          <div className="flex-1">
            <span className="text-lg font-semibold text-green-700">Bulk discounts available</span>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-charcoal/60 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Welcome
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-charcoal mb-6 leading-tight">
            {welcomeData.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-custom mb-10 leading-relaxed max-w-2xl mx-auto">
            {welcomeData.description}
          </p>
          <a
            href="/shop"
            className="inline-block border-2 border-charcoal bg-transparent text-charcoal px-6 sm:px-8 py-3 text-base font-semibold hover:bg-charcoal hover:text-white transition rounded-sm"
          >
            {welcomeData.buttonText}
          </a>
        </div>
      </section>

      <HomeCollections items={collectionsItems.length ? collectionsItems : FALLBACK_COLLECTION_ITEMS} />

      <HomeServices
        sectionTitle={servicesSection.title}
        sectionDescription={servicesSection.description}
        items={servicesSection.items}
      />

      {/* Featured Image Section */}
      {welcomeData.featuredImage && (
        <section className="py-10 sm:py-12 bg-off-white">
          <div className="max-w-5xl mx-auto px-4">
            <img
              src={welcomeData.featuredImage}
              alt="Featured"
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </section>
      )}

      {/* Custom Apparel Collection */}
      {customApparelData.image && (
        <FeaturedCollection
          title={customApparelData.title}
          image={customApparelData.image}
          description={customApparelData.description}
          buttonText={customApparelData.buttonText || 'Shop Collection'}
        />
      )}

      {/* Design & Printing Services Collection */}
      {designServicesData.image && (
        <FeaturedCollection
          title={designServicesData.title}
          image={designServicesData.image}
          description={designServicesData.description}
          buttonText={designServicesData.buttonText || 'Shop Collection'}
          reverse={true}
        />
      )}

      {/* Testimonials Section */}
      <Testimonials />


      {/* Blog Section */}
      <Blog />

      {/* FAQ Section */}
      <FAQ />

      {/* Sticky WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
