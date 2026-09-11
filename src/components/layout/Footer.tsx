import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full select-none text-white text-xs">
      {/* 1. Back to top */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full bg-[#261d5e] hover:bg-[#34287d] text-white py-3 text-center text-xs font-semibold cursor-pointer transition-colors"
      >
        {t("backToTop")}
      </button>

      {/* 2. Brand & Navigation Row */}
      <div className="bg-[#191142] py-8 px-4 sm:px-8 border-b border-[#261d5e]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center">
            <img
              src="/logo-white.png"
              alt="Buddy Mattress"
              className="h-8 w-auto object-contain drop-shadow-xs"
            />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-gray-300">
            <Link to="/about" className="hover:text-[#0ea9df] transition-colors font-medium">
              About Us
            </Link>
            <Link to="/shop" className="hover:text-[#0ea9df] transition-colors font-medium">
              Shop Mattresses
            </Link>
            <Link to="/cart" className="hover:text-[#0ea9df] transition-colors font-medium">
              Cart
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ta" : "en")}
            className="flex items-center gap-2 border border-[#3d2f85] hover:border-[#0ea9df] rounded-full px-4 py-1.5 cursor-pointer text-xs text-gray-200 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#0ea9df]" />
            <span>{language === "ta" ? "தமிழ்" : "English"}</span>
          </button>
        </div>
      </div>

      {/* 3. Bottom Copyright Bar (with safe bottom padding for mobile bar) */}
      <div className="bg-[#110b2e] py-6 pb-20 md:pb-6 px-4 text-center text-[11px] text-gray-400 border-t border-[#1d1445]">
        <p>© {new Date().getFullYear()} Buddy Mattress. All rights reserved.</p>
      </div>
    </footer>
  );
}
