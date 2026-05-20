import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { ProductGrid } from '../components/ProductGrid';
import { FeaturedCollection } from '../components/FeaturedCollection';
import { getProducts, getSettings, getProductsByCategory } from '../services/api';
import { useLocation } from 'react-router-dom';
import CategoryMenu from '../components/CategoryMenu';
import OnOfferBanner from '../components/OnOfferBanner';

const DEFAULT_CATEGORIES = [
  { key: 'gift-boxes', label: 'Customised Gift Boxes', image: '' },
  { key: 'caps', label: 'Customised Caps', image: '' },
  { key: 'mugs', label: 'Mugs', image: '' },
  { key: 'bottles', label: 'Water Bottles', image: '' },
  { key: 'hoodies', label: 'Hoodies', image: '' },
  { key: 'polo-shirts', label: 'Polo Shirts', image: '' },
  { key: 't-shirts', label: 'T-Shirts', image: '' },
  { key: 'jerseys', label: 'Jerseys', image: '' },
];

/**
 * Safely converts relative image paths into full URLs
 */
const getAbsoluteImageUrl = (url) => {
  if (!url) return '';

  // already full URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // backend base URL
  const apiUrl = import.meta.env.VITE_API_URL || '';

  // remove trailing slash from API URL
  const cleanApiUrl = apiUrl.replace(/\/$/, '');

  // ensure image path starts with slash
  const cleanImagePath = url.startsWith('/') ? url : `/${url}`;

  return `${cleanApiUrl}${cleanImagePath}`;
};

export default function Shop() {
  const [showOnOffer, setShowOnOffer] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const location = useLocation();

  const [shopCustomApparelData, setShopCustomApparelData] = useState({
    title: 'Custom Apparel',
    description:
      'Transform your vision into reality. Our expert design and printing services bring your ideas to life on premium hoodies, jerseys, polos, and t-shirts.',
    buttonText: 'Shop Collection',
    image: '',
  });

  const [shopDesignServicesData, setShopDesignServicesData] = useState({
    title: 'Design & Printing Services',
    description:
      'Professional design services for all your branding needs.',
    buttonText: 'Our Services',
    image: '',
  });

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  /**
   * Fetch all products + settings
   */
  const fetchProducts = async () => {
    try {
      const [data, settings] = await Promise.all([
        getProducts(),
        getSettings(),
      ]);

      // FIX IMAGES HERE
      const fixedProducts = (data || []).map((product) => ({
        ...product,
        image: getAbsoluteImageUrl(product.image),
      }));

      setProducts(fixedProducts);

      // custom apparel section
      if (settings?.shopCustomApparel) {
        setShopCustomApparelData({
          ...settings.shopCustomApparel,
          image: getAbsoluteImageUrl(
            settings.shopCustomApparel.image
          ),
        });
      }

      // design services section
      if (settings?.shopDesignServices) {
        setShopDesignServicesData({
          ...settings.shopDesignServices,
          image: getAbsoluteImageUrl(
            settings.shopDesignServices.image
          ),
        });
      }

      // collections/categories
      const configuredCollections =
        settings?.collections?.items || [];

      if (configuredCollections.length > 0) {
        setCategories(
          configuredCollections.map((item) => ({
            key: item.id,
            label: item.name,
            image: getAbsoluteImageUrl(item.image),
          }))
        );
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }

      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Initial load
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = (params.get('category') || '').trim();

    setSelectedCategory(cat || null);

    fetchProducts();

    const interval = setInterval(() => {
      fetchProducts();
    }, 30000);

    return () => clearInterval(interval);
  }, [location.pathname, location.search]);

  /**
   * Refresh button
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
  };

  /**
   * Search term
   */
  const searchTerm = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('search') || '').trim();
  }, [location.search]);

  /**
   * Filtered products
   */
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    const term = searchTerm.toLowerCase();

    return products.filter((product) => {
      const name = product.name || '';
      const category = product.category || '';
      const description = product.description || '';

      return (
        name.toLowerCase().includes(term) ||
        category.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term)
      );
    });
  }, [products, searchTerm]);

  const hasSearch = searchTerm.length > 0;

  // IMPORTANT FIX
  const visibleProducts = hasSearch
    ? filteredProducts
    : products;

  /**
   * On-offer products
   */
  const onOfferProducts = useMemo(
    () => products.filter((p) => p.onOffer),
    [products]
  );

  const onOfferImages = onOfferProducts
    .map((p) => p.image)
    .filter(Boolean);

  /**
   * Selected category info
   */
  const selectedCategoryInfo = useMemo(
    () => categories.find((cat) => cat.key === selectedCategory),
    [categories, selectedCategory]
  );

  /**
   * Fetch category products
   */
  useEffect(() => {
    if (!selectedCategory) {
      setCategoryProducts([]);
      return;
    }

    const fetchCategoryProducts = async () => {
      try {
        setCategoryLoading(true);

        let data = await getProductsByCategory(
          selectedCategory
        );

        if (
          (!data || data.length === 0) &&
          selectedCategoryInfo?.label
        ) {
          data = await getProductsByCategory(
            selectedCategoryInfo.label
          );
        }

        const fixedCategoryProducts = (data || []).map(
          (product) => ({
            ...product,
            image: getAbsoluteImageUrl(product.image),
          })
        );

        setCategoryProducts(fixedCategoryProducts);
      } catch (err) {
        console.error(
          'Failed to fetch category products:',
          err
        );
        setCategoryProducts([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory, selectedCategoryInfo]);

  /**
   * Loading state
   */
  if (loading) {
    return (
      <div className="bg-off-white min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-custom">
          Loading products...
        </p>
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {
    return (
      <div className="bg-off-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">
            {error}
          </p>
          <p className="text-gray-custom">
            Please make sure the backend server is running.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-off-white">
      {/* Refresh Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-charcoal font-semibold hover:text-gray-custom transition disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />

          {refreshing
            ? 'Refreshing...'
            : 'Refresh Products'}
        </button>
      </div>

      {/* On Offer Banner */}
      {onOfferProducts.length > 0 &&
        !hasSearch &&
        !selectedCategory &&
        !showOnOffer && (
          <OnOfferBanner
            images={onOfferImages}
            onClick={() => setShowOnOffer(true)}
          />
        )}

      {/* Category Menu */}
      <CategoryMenu
        selected={selectedCategory}
        categories={categories}
        onSelect={(categoryKey) => {
          setShowOnOffer(false);

          setSelectedCategory((prev) =>
            prev === categoryKey ? null : categoryKey
          );
        }}
      />

      {/* On Offer Products */}
      {showOnOffer ? (
        <ProductGrid
          products={onOfferProducts}
          title="On Offer Products"
        />
      ) : selectedCategory ? (
        categoryLoading ? (
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <p className="text-center text-gray-custom">
              Loading category products...
            </p>
          </div>
        ) : categoryProducts.length > 0 ? (
          <ProductGrid
            products={categoryProducts}
            title={`Category: ${
              selectedCategoryInfo?.label ||
              selectedCategory
            }`}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 pb-12">
            <p className="text-center text-gray-custom">
              No products found in this category.
            </p>
          </div>
        )
      ) : (
        <>
          {/* Main Product Grid */}
          <ProductGrid
            products={visibleProducts}
            title={
              hasSearch
                ? `Search results for "${searchTerm}"`
                : 'All Products'
            }
          />

          {/* Featured Collection */}
          {!hasSearch &&
            shopCustomApparelData.image && (
              <FeaturedCollection
                title={shopCustomApparelData.title}
                image={shopCustomApparelData.image}
                description={
                  shopCustomApparelData.description
                }
                buttonText={
                  shopCustomApparelData.buttonText
                }
              />
            )}

          {/* Featured Products */}
          {!hasSearch && (
            <ProductGrid
              products={products.slice(0, 3)}
              title="Featured Products"
            />
          )}

          {/* Design Services */}
          {!hasSearch &&
            shopDesignServicesData.image && (
              <FeaturedCollection
                title={shopDesignServicesData.title}
                image={shopDesignServicesData.image}
                description={
                  shopDesignServicesData.description
                }
                buttonText={
                  shopDesignServicesData.buttonText
                }
                reverse={true}
              />
            )}
        </>
      )}
    </div>
  );
}
