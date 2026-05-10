/**
 * Canonical marketing copy for arwas_world (matches Settings schema intent).
 * Used to replace draft/test placeholder text stored in the database.
 */

/** Previous generic hero copy — upgraded to sharper defaults on read */
const LEGACY_HERO_TITLE = 'Custom Printed Apparel';
const LEGACY_HERO_SUBTITLE =
  'Premium Design & Printing Services for Custom Apparel & Branded Merchandise';
const LEGACY_HERO_BUTTON = 'Start Your Design';
const LEGACY_WELCOME_BUTTON = 'Browse Our Shop';

/** Editorial hero photo — apparel / on-body (replaces generic placeholder stock) */
const DEFAULT_HERO_BACKGROUND =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=2400&q=80';

const MARKETING_DEFAULTS = {
  hero: {
    tagline: 'Est. 2020',
    title: 'Custom Apparel That Represents Your Brand',
    subtitle:
      'High-quality printing for t-shirts, hoodies, jerseys & corporate merch — delivered in Kenya, Oman & worldwide.',
    buttonText: 'Start Designing Now',
    backgroundImage: DEFAULT_HERO_BACKGROUND,
  },
  welcome: {
    title: 'Welcome to arwas_world',
    description:
      'Premium Design & Printing Services for Custom Apparel & Branded Merchandise. Explore our shop for custom printed t-shirts, hoodies, jerseys, polos, and more. Serving Kenya 🇰🇪, Oman 🇴🇲, and customers worldwide since 2020.',
    buttonText: 'Shop Custom Apparel',
  },
  customApparel: {
    title: 'Custom Printed Apparel',
    description:
      'Explore our premium collection of custom printed apparel. From t-shirts to hoodies, jerseys to polos — all crafted with precision and quality.',
    buttonText: 'Shop Collection',
  },
  designServices: {
    title: 'Design & Printing Services',
    description:
      'Our expert team offers comprehensive design and printing services. Create stunning branded merchandise with our professional design team.',
    buttonText: 'Our Services',
  },
  shopCustomApparel: {
    title: 'Custom Apparel',
    description:
      'Transform your vision into reality. Our expert design and printing services bring your ideas to life on premium hoodies, jerseys, polos, and t-shirts. From concept to final product, we ensure exceptional quality and personalized touches. Perfect for personal projects, corporate branding, or special events.',
    buttonText: 'Shop Collection',
  },
  shopDesignServices: {
    title: 'Design & Printing Services',
    description:
      "Professional design services for all your branding needs. We specialize in custom printing on tumblers, bottles, mugs, and more. Whether it's corporate branding or personal projects, our expert team delivers exceptional designs with premium printing quality. Bulk orders welcome!",
    buttonText: 'Our Services',
  },
};

/** Exact matches (lowercase) that should never appear on the public site */
const EXACT_BAD = new Set([
  'test hero',
  'test welcome',
  'test customapparel',
  'test designservices',
  'updated description',
  'updated services description',
  'lorem ipsum',
  'placeholder',
  'sample text',
  'todo',
]);

const TEST_SECTION_TITLE = /^test\s+(hero|welcome|customapparel|designservices)$/i;

function isPlaceholderString(str) {
  if (str == null || typeof str !== 'string') return false;
  const t = str.trim().toLowerCase();
  if (!t) return false;
  if (EXACT_BAD.has(t)) return true;
  if (TEST_SECTION_TITLE.test(str.trim())) return true;
  return false;
}

function pickString(value, fallback) {
  if (isPlaceholderString(value)) return fallback;
  return value;
}

function upgradeLegacyHeroCopy(hero, d) {
  if (!hero) return hero;
  const out = { ...hero };
  if ((out.title || '').trim() === LEGACY_HERO_TITLE) {
    out.title = d.hero.title;
  }
  if ((out.subtitle || '').trim() === LEGACY_HERO_SUBTITLE) {
    out.subtitle = d.hero.subtitle;
  }
  if ((out.buttonText || '').trim() === LEGACY_HERO_BUTTON) {
    out.buttonText = d.hero.buttonText;
  }
  const bg = (out.backgroundImage || '').trim();
  if (!bg || bg.includes('picsum.photos')) {
    out.backgroundImage = d.hero.backgroundImage || DEFAULT_HERO_BACKGROUND;
  }
  return out;
}

function upgradeLegacyWelcomeCopy(welcome, d) {
  if (!welcome) return welcome;
  const out = { ...welcome };
  if ((out.buttonText || '').trim() === LEGACY_WELCOME_BUTTON) {
    out.buttonText = d.welcome.buttonText;
  }
  return out;
}

/**
 * Returns a plain object with sanitized text fields. Mutates nothing.
 * @param {object} raw - settings document (plain object or lean)
 */
function sanitizeMarketingSettings(raw) {
  if (!raw || typeof raw !== 'object') return raw;

  const out = JSON.parse(JSON.stringify(raw));
  const d = MARKETING_DEFAULTS;

  if (out.hero && typeof out.hero === 'object') {
    out.hero = upgradeLegacyHeroCopy(
      {
        ...out.hero,
        tagline: pickString(out.hero.tagline, d.hero.tagline),
        title: pickString(out.hero.title, d.hero.title),
        subtitle: pickString(out.hero.subtitle, d.hero.subtitle),
        buttonText: pickString(out.hero.buttonText, d.hero.buttonText),
      },
      d
    );
  }

  if (out.welcome && typeof out.welcome === 'object') {
    out.welcome = upgradeLegacyWelcomeCopy(
      {
        ...out.welcome,
        title: pickString(out.welcome.title, d.welcome.title),
        description: pickString(out.welcome.description, d.welcome.description),
        buttonText: pickString(out.welcome.buttonText, d.welcome.buttonText),
      },
      d
    );
  }

  if (out.customApparel && typeof out.customApparel === 'object') {
    out.customApparel = {
      ...out.customApparel,
      title: pickString(out.customApparel.title, d.customApparel.title),
      description: pickString(out.customApparel.description, d.customApparel.description),
      buttonText: pickString(out.customApparel.buttonText, d.customApparel.buttonText),
    };
  }

  if (out.designServices && typeof out.designServices === 'object') {
    out.designServices = {
      ...out.designServices,
      title: pickString(out.designServices.title, d.designServices.title),
      description: pickString(out.designServices.description, d.designServices.description),
      buttonText: pickString(out.designServices.buttonText, d.designServices.buttonText),
    };
  }

  if (out.shopCustomApparel && typeof out.shopCustomApparel === 'object') {
    out.shopCustomApparel = {
      ...out.shopCustomApparel,
      title: pickString(out.shopCustomApparel.title, d.shopCustomApparel.title),
      description: pickString(out.shopCustomApparel.description, d.shopCustomApparel.description),
      buttonText: pickString(out.shopCustomApparel.buttonText, d.shopCustomApparel.buttonText),
    };
  }

  if (out.shopDesignServices && typeof out.shopDesignServices === 'object') {
    out.shopDesignServices = {
      ...out.shopDesignServices,
      title: pickString(out.shopDesignServices.title, d.shopDesignServices.title),
      description: pickString(out.shopDesignServices.description, d.shopDesignServices.description),
      buttonText: pickString(out.shopDesignServices.buttonText, d.shopDesignServices.buttonText),
    };
  }

  return out;
}

function marketingSettingsChanged(before, after) {
  return JSON.stringify(before) !== JSON.stringify(after);
}

/**
 * Applies sanitized marketing text to a Settings document and saves if anything changed.
 * @param {import('mongoose').Document} settingsDoc
 * @returns {Promise<object>} Plain object safe to send as JSON
 */
async function persistSanitizedMarketingIfNeeded(settingsDoc) {
  const plain = settingsDoc.toObject();
  const sanitized = sanitizeMarketingSettings(plain);
  if (!marketingSettingsChanged(plain, sanitized)) {
    return plain;
  }
  settingsDoc.hero = sanitized.hero;
  settingsDoc.welcome = sanitized.welcome;
  settingsDoc.customApparel = sanitized.customApparel;
  settingsDoc.designServices = sanitized.designServices;
  settingsDoc.shopCustomApparel = sanitized.shopCustomApparel;
  settingsDoc.shopDesignServices = sanitized.shopDesignServices;
  await settingsDoc.save();
  return settingsDoc.toObject();
}

module.exports = {
  MARKETING_DEFAULTS,
  sanitizeMarketingSettings,
  marketingSettingsChanged,
  isPlaceholderString,
  persistSanitizedMarketingIfNeeded,
};
