export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
          {/* About */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4">About arwas_world</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              arwas_world - "Simply Elegant" - Premium Design & Printing since 2020. Specializing in custom apparel and branded merchandise for Kenya 🇰🇪, Oman 🇴🇲, and worldwide clients. Every piece is designed with quality and customization in mind.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">Shop</a></li>
              <li><a href="#" className="hover:text-white transition">Services</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="mailto:okatchpolycarp@gmail.com" className="hover:text-white transition">Email</a></li>
              <li><a href="https://wa.me/254112126757" className="hover:text-white transition">WhatsApp (Kenya)</a></li>
              <li><a href="https://wa.me/96878409241" className="hover:text-white transition">WhatsApp (Oman)</a></li>
            </ul>
          </div>
          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3 sm:mb-4">Social</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://instagram.com/arwas_world" className="hover:text-white transition">Instagram</a></li>
            </ul>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-700 pt-6 sm:pt-8">
          <p className="text-gray-400 text-sm text-center">
            © 2026 arwas_world. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
