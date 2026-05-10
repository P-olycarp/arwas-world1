import { useState, useEffect } from 'react';
import { getSettings } from '../services/api';

const getAbsoluteImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${url}`;
};

export function Hero() {
  const [heroData, setHeroData] = useState({
    tagline: 'Est. 2020',
    title: 'Custom Apparel That Represents Your Brand',
    subtitle:
      'High-quality printing for t-shirts, hoodies, jerseys & corporate merch — delivered in Kenya, Oman & worldwide.',
    buttonText: 'Start Designing Now',
    backgroundImage:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=2400&q=80'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings.hero) {
          setHeroData({
            ...settings.hero,
            backgroundImage: getAbsoluteImageUrl(settings.hero.backgroundImage)
          });
        }
      } catch (err) {
        console.error('Failed to fetch hero settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <section className="relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] overflow-hidden bg-charcoal">
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] overflow-hidden">
      {/* Background: large editorial-style apparel photo */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: `url(${heroData.backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/25" />
      </div>

      {/* Content */}
      <div className="relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <p className="text-white/95 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 tracking-[0.25em] uppercase font-semibold drop-shadow-md">
          {heroData.tagline}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-4 sm:mb-6 max-w-4xl leading-tight [text-shadow:0_4px_24px_rgba(0,0,0,0.45)]">
          {heroData.title}
        </h1>
        <p className="text-white/95 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl leading-relaxed font-medium [text-shadow:0_2px_12px_rgba(0,0,0,0.35)]">
          {heroData.subtitle}
        </p>
        <a
          href="/shop"
          className="inline-block bg-charcoal text-white px-8 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-bold shadow-lg hover:bg-black hover:shadow-xl transition rounded-sm"
        >
          {heroData.buttonText}
        </a>
      </div>
    </section>
  );
}

