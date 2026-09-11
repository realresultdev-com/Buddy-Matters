import { Link } from "react-router-dom";
import { Globe, MapPin, PhoneCall, Mail, ShieldCheck, Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full select-none text-white text-xs bg-[#110b2e]">
      {/* 1. Back to top */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full bg-[#261d5e] hover:bg-[#34287d] text-white py-3 text-center text-xs font-semibold cursor-pointer transition-colors"
      >
        {t("backToTop")}
      </button>

      {/* 2. Enterprise Footer Content Grid */}
      <div className="bg-[#191142] py-12 px-4 sm:px-8 border-b border-[#261d5e]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Col 1: Brand & Promise */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src="/logo-white.png"
                alt="Buddy Mattress"
                className="h-8 w-auto object-contain drop-shadow-xs"
              />
            </Link>
            <p className="text-gray-300 text-xs leading-relaxed">
              India&apos;s direct-from-factory sleep wellness brand. Engineered with certified high-resilience foam and orthopedic contouring for spinal health and restorative rest.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#261d5e] border border-[#3d2f85] text-[11px] text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0ea9df]" />
              <span>10-Year Warranty • 100-Night Trial</span>
            </div>
          </div>

          {/* Col 2: Consumer Protection & Legal Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Legal & Compliance
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/terms" className="hover:text-[#0ea9df] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#0ea9df] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-[#0ea9df] transition-colors">
                  Refund & Return Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-[#0ea9df] transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="hover:text-[#0ea9df] transition-colors text-amber-300 hover:text-amber-200 font-medium">
                  Grievance Redressal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation & Language */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/shop" className="hover:text-[#0ea9df] transition-colors">
                  Shop All Mattresses
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#0ea9df] transition-colors">
                  About Buddy Mattress
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#0ea9df] transition-colors">
                  View Shopping Cart
                </Link>
              </li>
            </ul>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setLanguage(language === "en" ? "ta" : "en")}
                className="flex items-center gap-2 border border-[#3d2f85] hover:border-[#0ea9df] rounded-full px-4 py-1.5 cursor-pointer text-xs text-gray-200 transition-colors bg-[#110b2e]/60"
              >
                <Globe className="w-3.5 h-3.5 text-[#0ea9df]" />
                <span>Language: {language === "ta" ? "தமிழ்" : "English"}</span>
              </button>
            </div>
          </div>

          {/* Col 4: Registered Office & Customer Care Helpline */}
          <div className="space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Registered Office & Support
            </h3>

            {/* Address */}
            <div className="flex items-start gap-2.5 text-gray-300">
              <MapPin className="w-4 h-4 text-[#0ea9df] shrink-0 mt-0.5" />
              <address className="not-italic text-[11px] leading-relaxed text-gray-300">
                <strong>Buddy Mattress</strong><br />
                Near RTO Office, Paramathi, Paramathi Velur,<br />
                Namakkal District, Tamil Nadu - 637207, India.
              </address>
            </div>

            {/* Helpline */}
            <div className="flex items-center gap-2.5 text-gray-300 pt-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#0ea9df] shrink-0" />
              <div>
                <a href="tel:+919443300000" className="text-cyan-300 hover:text-white font-bold block">
                  +91 94433 00000
                </a>
                <span className="text-[10px] text-gray-400 block flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 inline" /> Mon – Sat: 9:30 AM – 6:30 PM IST
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2.5 text-gray-300">
              <Mail className="w-3.5 h-3.5 text-[#0ea9df] shrink-0" />
              <a href="mailto:support@buddymattress.in" className="hover:text-[#0ea9df] transition-colors text-[11px]">
                support@buddymattress.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright Bar (with safe bottom padding for mobile bar) */}
      <div className="bg-[#110b2e] py-6 pb-20 md:pb-6 px-4 text-center text-[11px] text-gray-400 space-y-1">
        <p>© {new Date().getFullYear()} Buddy Mattress. All rights reserved.</p>
        <p className="text-[10px] text-gray-500">
          Country of Origin: India | Manufactured & Marketed by Buddy Mattress, Paramathi Velur, Namakkal District, Tamil Nadu - 637207.
        </p>
      </div>
    </footer>
  );
}
