import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, Truck } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { getProductUrl } from "../../utils/urlSecurity";
import type { Product } from "../../types/product.types";
import RatingStars from "../common/RatingStars";
import PriceTag from "../common/PriceTag";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { language, t } = useLanguage();
  const [added, setAdded] = useState(false);

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: mainImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col justify-between hover:border-[#0ea9df] hover:shadow-md transition-all relative group h-full">
      <div>
        {/* Brand Badge */}
        <div className="min-h-[20px] mb-1.5 sm:mb-2">
          {product.stock > 15 ? (
            <span className="inline-flex items-center gap-1 bg-[#191142] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#0ea9df]" /> {t("bestSeller")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-cyan-50 text-[#0ea9df] border border-cyan-200 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
              {t("buddyPick")}
            </span>
          )}
        </div>

        {/* Product Image */}
        <Link
          to={getProductUrl(product.id)}
          className="block aspect-square w-full overflow-hidden bg-white p-1 sm:p-2 mb-2 sm:mb-3 flex items-center justify-center rounded-lg"
        >
          <img
            src={mainImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Title */}
        <Link to={getProductUrl(product.id)}>
          <h3 className="text-xs sm:text-sm font-bold text-[#191142] group-hover:text-[#0ea9df] line-clamp-2 leading-snug transition-colors min-h-[32px] sm:min-h-[38px]">
            {product.name}
          </h3>
        </Link>

        {/* Star Ratings */}
        <div className="mt-1">
          <RatingStars rating={4.8} count="1.2k" size="xs" />
        </div>

        {/* Price & MRP Block */}
        <div className="mt-1.5 sm:mt-2.5">
          <PriceTag price={product.price} size="sm" showDiscount />
        </div>

        {/* Delivery & Warranty info */}
        <div className="mt-2 text-xs text-gray-600 space-y-0.5 pt-1.5 border-t border-gray-100 hidden xs:block">
          <p className="text-[10px] sm:text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />{" "}
            <span className="truncate">{t("freeDoorstepDelivery")}</span>
          </p>
          <p className="text-[10px] sm:text-[11px] text-gray-500 truncate">{t("trialAndWarranty")}</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-3 pt-2">
        {product.stock <= 0 ? (
          <button
            disabled
            className="w-full py-2 px-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          >
            {t("currentlyUnavailable")}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[#0ea9df] hover:bg-[#0c93c4] text-white hover:shadow-md"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> {t("addedToCart")}
              </>
            ) : (
              t("addToCart")
            )}
          </button>
        )}
      </div>
    </div>
  );
}
