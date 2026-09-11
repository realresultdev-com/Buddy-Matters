import { Link } from "react-router-dom";
import RatingBadge from "../common/RatingBadge";
import PriceTag from "../common/PriceTag";
import { useLanguage } from "../../context/LanguageContext";
import type { Product, ProductColorVariant } from "../../types/product.types";
import ColorSwatches from "../common/ColorSwatches";

interface ProductInfoProps {
  product: Product;
  className?: string;
  selectedVariant?: ProductColorVariant | null;
  onSelectVariant?: (variant: ProductColorVariant) => void;
}

export default function ProductInfo({
  product,
  className = "",
  selectedVariant,
  onSelectVariant,
}: ProductInfoProps) {
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
      <PriceTag
        price={product.price}
        originalMRP={product.original_price ?? product.originalMRP}
        discountPercent={product.discount_percent ?? product.discountPercent}
        size="lg"
      />

      {/* Color Selection Swatches */}
      {product.color_variants && product.color_variants.length > 0 && (
        <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/80 space-y-2">
          <ColorSwatches
            variants={product.color_variants}
            selectedVariant={selectedVariant}
            onSelect={onSelectVariant}
            size="md"
            showLabel={true}
          />
        </div>
      )}

      {/* Product Description */}
      {product.description && (
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-sm text-[#191142]">{t("aboutThisItem")}</h3>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      )}

      {/* Key & Value Specifications / About this item */}
      {product.about && Array.isArray(product.about) && product.about.length > 0 && (
        <div className="space-y-2 pt-2">
          <h3 className="font-bold text-sm text-[#191142]">
            {language === "ta" ? "பொருளின் விவரக்குறிப்புகள்" : "Product Specifications"}
          </h3>
          <div className="border border-gray-200/90 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-gray-100">
                {product.about.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="py-2.5 px-3.5 font-bold text-gray-700 w-2/5 sm:w-1/3 border-r border-gray-100">
                      {item.key}
                    </td>
                    <td className="py-2.5 px-3.5 text-gray-900 font-medium">
                      {item.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
