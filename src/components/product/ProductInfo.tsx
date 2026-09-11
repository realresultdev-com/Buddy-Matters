import { Link } from "react-router-dom";
import RatingStars from "../common/RatingStars";
import RatingBadge from "../common/RatingBadge";
import PriceTag from "../common/PriceTag";
import TrustBadges from "./TrustBadges";
import { useLanguage } from "../../context/LanguageContext";
import type { Product } from "../../types/product.types";

interface ProductInfoProps {
  product: Product;
  className?: string;
}

export default function ProductInfo({ product, className = "" }: ProductInfoProps) {
  const { language, t } = useLanguage();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Brand & Title */}
      <div>
        <Link to="/" className="text-xs font-bold text-[#0ea9df] hover:underline uppercase tracking-wider">
          {t("officialStore")}
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-[#191142] leading-snug mt-1">
          {product.name}
        </h1>
      </div>

      {/* Ratings & Q&A */}
      <div className="flex items-center gap-3 text-xs text-gray-600 border-b border-gray-100 pb-3 flex-wrap">
        <a href="#reviews" className="hover:opacity-90 transition-opacity">
          <RatingBadge
            rating={product.rating ?? 4.5}
            reviewCount={product.review_count ?? 12}
            size="sm"
          />
        </a>
        <span className="text-gray-300">|</span>
        <a
          href="#reviews"
          className="text-[#0ea9df] hover:underline cursor-pointer text-xs font-semibold"
        >
          {product.review_count ?? 12} {language === "ta" ? "மதிப்புரைகள்" : "customer reviews"}
        </a>
      </div>

      {/* Choice Badge */}
      <div className="inline-flex items-center">
        <span className="bg-[#191142] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs">
          {t("buddysChoice")}
        </span>
      </div>

      {/* Price & EMI block */}
      <PriceTag price={product.price} size="lg" showDiscount showEMI />

      {/* Trust & Guarantee Grid */}
      <TrustBadges variant="grid" />

      {/* Feature Bullet Points */}
      <div className="space-y-2 pt-2">
        <h3 className="font-bold text-sm text-[#191142]">{t("aboutThisItem")}</h3>
        <ul className="list-disc pl-5 space-y-2 text-xs text-gray-700 leading-relaxed">
          <li className="font-semibold text-[#191142]">{product.description}</li>
          <li>
            <span className="font-bold text-gray-900">
              {language === "ta" ? "எலும்பியல் பணிச்சூழலியல்:" : "Orthopedic Ergonomics:"}
            </span>{" "}
            {language === "ta"
              ? "இயற்கையான முதுகெலும்பு சீரமைப்பைப் பராமரிக்கவும், அனைத்து உறங்கும் நிலைகளிலும் உடல் அழுத்தத்தை சமமாக விநியோகிக்கவும் வடிவமைக்கப்பட்டுள்ளது."
              : "Engineered to maintain natural spinal alignment and distribute body pressure evenly across all sleeping postures."}
          </li>
          <li>
            <span className="font-bold text-gray-900">
              {language === "ta" ? "சுவாசிக்கும் காற்றோட்ட தொழில்நுட்பம்:" : "Breathable Airflow Technology:"}
            </span>{" "}
            {language === "ta"
              ? "திறந்த-செல் சுவாசிக்கும் அமைப்பு சிக்கிய உடல் வெப்பத்தை வெளியேற்றி, இரவு முழுவதும் உங்களை குளிர்ச்சியாகவும் வசதியாகவும் வைத்திருக்கும்."
              : "Open-cell breathable structure dissipates trapped body heat, keeping you cool and comfortable all night."}
          </li>
          <li>
            <span className="font-bold text-gray-900">
              {language === "ta" ? "CertiPUR-US & OEKO-TEX சான்றளிக்கப்பட்டது:" : "CertiPUR-US & OEKO-TEX Certified:"}
            </span>{" "}
            {language === "ta"
              ? "நச்சு வெளியேற்றம், கன உலோகங்கள் மற்றும் ஃபார்மால்டிஹைட் இல்லாத 100% பாதுகாப்பானது."
              : "100% free from toxic off-gassing, heavy metals, ozone depleters, and formaldehyde."}
          </li>
          <li>
            <span className="font-bold text-gray-900">
              {language === "ta" ? "முழுமையான மன அமைதி:" : "Peace of Mind:"}
            </span>{" "}
            {language === "ta"
              ? "எங்கள் 100-இரவு ஆபத்தில்லாத வீட்டு சோதனை மற்றும் 10-ஆண்டு விரிவான உத்தரவாதத்துடன் வருகிறது."
              : "Backed by our signature 100-Night Risk-Free Home Trial and 10-Year Comprehensive Warranty."}
          </li>
        </ul>
      </div>
    </div>
  );
}
