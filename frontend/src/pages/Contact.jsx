import { Mail, MessageCircle, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-off-white min-h-screen">
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl sm:text-5xl font-serif text-charcoal mb-4 sm:mb-6">Contact Us</h1>
          <div className="w-16 sm:w-20 h-0.5 bg-charcoal mb-8 sm:mb-12"></div>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-charcoal" />
              <span className="text-gray-custom">okatchpolycarp@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-charcoal" />
              <span className="text-gray-custom">+254 112 126757 (Kenya)</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-charcoal" />
              <span className="text-gray-custom">+968 7840 9241 (Oman)</span>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-charcoal" />
              <a href="https://instagram.com/arwas_world" className="text-gray-custom hover:underline">@arwas_world (Instagram)</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
