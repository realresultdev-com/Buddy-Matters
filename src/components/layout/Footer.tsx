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
      <div
        onClick={scrollToTop}
        className="bg-[#261d5e] hover:bg-[#34287d] text-white py-3.5 text-center text-xs font-bold cursor-pointer transition-colors"
      >
        {t("backToTop")}
      </div>

      {/* 2. Directory Columns (Brand Navy #191142) */}
      <div className="bg-[#191142] border-b border-[#2e236b] py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-white text-sm mb-3">
              {language === "ta" ? "Buddy Mattress பற்றி" : "About Buddy Mattress"}
            </h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "எங்கள் வரலாறு" : "Our Ergonomic Story"}</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "100-இரவு வீட்டு சோதனை" : "100-Night Home Trial"}</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "10-ஆண்டு உத்தரவாத வழிகாட்டி" : "10-Year Warranty Guide"}</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "எலும்பியல் முதுகெலும்பு ஆராய்ச்சி" : "Orthopedic Spine Research"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">
              {language === "ta" ? "தூக்க தொகுப்புகள்" : "Sleep Collections"}
            </h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "எலும்பியல் மெமரி ஃபோம்" : "Orthopedic Memory Foam"}</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "குளிர்ச்சியூட்டும் ஜெல் தலையணைகள்" : "Cooling Gel Contour Pillows"}</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "மெத்தை பாதுகாப்பிகள்" : "Breathable Mattress Protectors"}</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "சொகுசு மெத்தை டாப்பர்கள்" : "Luxury Comfort Toppers"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">
              {language === "ta" ? "வாடிக்கையாளர் சேவை" : "Customer Support"}
            </h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><Link to="/profile" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "உங்கள் கணக்கு" : "Your Sleep Account"}</Link></li>
              <li><Link to="/orders" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "டெலிவரி கண்காணிப்பு" : "Track Delivery Status"}</Link></li>
              <li><Link to="/orders" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "எளிதான திரும்பப் பெறல்" : "Easy Return Request"}</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">{language === "ta" ? "இலவச தூக்க நிபுணர் ஆலோசனை" : "Free Sleep Expert Advice"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">
              {t("connectWithUs")}
            </h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><a href="#" className="hover:text-[#0ea9df] hover:underline">Instagram: @buddymattress</a></li>
              <li><a href="#" className="hover:text-[#0ea9df] hover:underline">Facebook Community</a></li>
              <li><a href="#" className="hover:text-[#0ea9df] hover:underline">WhatsApp Sleep Support</a></li>
              <li><a href="#" className="hover:text-[#0ea9df] hover:underline">support@buddymattress.com</a></li>
            </ul>
          </div>
        </div>

        {/* Brand divider */}
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-[#2e236b] flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300">
          <Link to="/" className="flex items-center">
            <img
              src="/logo-white.png"
              alt="Buddy Mattress"
              className="h-8 w-auto object-contain drop-shadow-xs"
            />
          </Link>

          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ta" : "en")}
            className="flex items-center gap-2 border border-[#3d2f85] rounded-lg px-3 py-1.5 cursor-pointer hover:border-[#0ea9df] transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#0ea9df]" />
            <span>{language === "ta" ? "தமிழ்" : "English"}</span>
          </button>
        </div>
      </div>

      {/* 3. Bottom Legal Sub-Footer (#110b2e) with safe bottom padding for mobile bar */}
      <div className="bg-[#110b2e] pt-8 pb-20 md:pb-8 px-4 text-center text-[11px] text-gray-400 space-y-2">
        <div className="flex flex-wrap justify-center gap-4 text-gray-300">
          <a href="#" className="hover:underline">Conditions of Use & Sale</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">100-Night Trial Terms</a>
          <a href="#" className="hover:underline">Warranty Registration</a>
        </div>
        <p>© {new Date().getFullYear()}, Buddy Mattress Co. or its affiliates. Cloudflare Edge Serverless Architecture.</p>
      </div>
    </footer>
  );
}
