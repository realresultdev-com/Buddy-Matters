import { Link } from "react-router-dom";
import { Globe, MapPin, PhoneCall, Mail, ArrowUp } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-gray-900 text-gray-400 text-xs border-t border-gray-800 select-none">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/logo-white.png"
                alt="Buddy Mattress"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              Direct-from-factory sleep wellness brand. Crafted with certified high-resilience foam and orthopedic contouring for healthy sleep.
            </p>
            <div className="pt-1 text-xs text-gray-300 font-medium">
              10-Year Warranty • 100-Night Free Trial
            </div>
          </div>

          {/* Col 2: Legal & Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Legal & Policies
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="hover:text-white transition-colors">
                  Grievance Redressal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation & Options */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">
                  Shop All Mattresses
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Buddy Mattress
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>

            <div className="pt-3 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setLanguage(language === "en" ? "ta" : "en")}
                className="inline-flex items-center gap-2 hover:text-white cursor-pointer text-xs transition-colors py-1"
              >
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span>Language: {language === "ta" ? "தமிழ்" : "English"}</span>
              </button>
            </div>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Registered Office & Support
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed text-gray-400">
                  <strong className="text-gray-200">Buddy Mattress</strong><br />
                  Near RTO Office, Paramathi, Paramathi Velur,<br />
                  Namakkal District, Tamil Nadu - 637207
                </address>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <PhoneCall className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <a href="tel:+919443300000" className="text-gray-200 hover:text-white font-semibold transition-colors">
                  +91 94433 00000
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <a href="mailto:support@buddymattress.in" className="hover:text-white transition-colors">
                  support@buddymattress.in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs">
          <div>
            <p>© {new Date().getFullYear()} Buddy Mattress. All rights reserved.</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Country of Origin: India | Manufactured & Marketed by Buddy Mattress, Paramathi Velur, Tamil Nadu.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-colors cursor-pointer shrink-0"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
