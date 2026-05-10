import { Printer, Shirt, Palette, Package, Sparkles } from 'lucide-react';

const ICON_MAP = {
  Printer,
  Shirt,
  Palette,
  Package,
  Sparkles,
};

const DEFAULT_ITEMS = [
  {
    title: 'Screen & digital printing',
    description: 'Vibrant, durable prints for tees, hoodies, and team gear.',
    icon: 'Printer',
  },
  {
    title: 'Custom apparel',
    description: 'Polos, jerseys, and corporate wear tailored to your brand.',
    icon: 'Shirt',
  },
  {
    title: 'Design & artwork',
    description: 'From logo refinement to full layout — we make it print-ready.',
    icon: 'Palette',
  },
  {
    title: 'Bulk & merch orders',
    description: 'Consistent quality for events, retail, and corporate programs.',
    icon: 'Package',
  },
];

function IconFor({ name }) {
  const Icon = (name && ICON_MAP[name]) || Sparkles;
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-charcoal text-white shadow-md">
      <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
    </div>
  );
}

/**
 * Services strip with Lucide icons — uses CMS items when present, else defaults.
 */
export function HomeServices({
  sectionTitle = 'What we do',
  sectionDescription = 'End-to-end printing and design for apparel and branded merchandise.',
  items = [],
}) {
  const list = items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-charcoal/70 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Services
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-charcoal mb-4">{sectionTitle}</h2>
          <p className="text-gray-custom text-base sm:text-lg leading-relaxed">{sectionDescription}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {list.map((item, idx) => (
            <div
              key={item._id || item.title || idx}
              className="text-center sm:text-left flex flex-col items-center sm:items-start"
            >
              <IconFor name={item.icon} />
              <h3 className="mt-5 font-serif text-xl text-charcoal font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-custom text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
