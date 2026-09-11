import { Link } from "react-router-dom";
import RatingBadge from "../common/RatingBadge";
import PriceTag from "../common/PriceTag";
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
      {Boolean(product.rating && (product.review_count ?? 0) > 0) ? (
        <div className="flex items-center gap-3 text-xs text-gray-600 border-b border-gray-100 pb-3 flex-wrap">
          <a href="#reviews" className="hover:opacity-90 transition-opacity">
            <RatingBadge
              rating={product.rating}
              reviewCount={product.review_count}
              size="sm"
            />
          </a>
          <span className="text-gray-300">|</span>
          <a
            href="#reviews"
            className="text-[#0ea9df] hover:underline cursor-pointer text-xs font-semibold"
          >
            {product.review_count} {language === "ta" ? "மதிப்புரைகள்" : "customer reviews"}
          </a>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-gray-500 border-b border-gray-100 pb-3">
          <span>No reviews yet</span>
          <span className="text-gray-300">|</span>
          <a href="#reviews" className="text-[#0ea9df] hover:underline cursor-pointer font-semibold">
            Be the first to review
          </a>
        </div>
      )}

      {/* Price block */}
      <PriceTag price={product.price} size="lg" />

      {/* Product Description */}
      {product.description && (
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-sm text-[#191142]">{t("aboutThisItem")}</h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
