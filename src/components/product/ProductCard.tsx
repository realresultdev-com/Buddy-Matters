import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Edit3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { getProductUrl } from "../../utils/urlSecurity";
import type { Product, ProductColorVariant } from "../../types/product.types";
import RatingBadge from "../common/RatingBadge";
import PriceTag from "../common/PriceTag";
import OfferBadge from "../common/OfferBadge";
import ColorSwatches from "../common/ColorSwatches";

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { language, t } = useLanguage();
  const [added, setAdded] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const [selectedVariant, setSelectedVariant] = useState<ProductColorVariant | null>(
    product.color_variants && product.color_variants.length > 0 ? product.color_variants[0] : null
  );

  const displayedImage =
    selectedVariant?.image ||
    (product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: selectedVariant?.name ? `${product.name} (${selectedVariant.name})` : product.name,
      price: product.price,
      quantity: 1,
      image: displayedImage,
      color: selectedVariant?.name,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col justify-between hover:border-[#0ea9df] hover:shadow-md transition-all relative group h-full">
      {/* Admin Direct Edit Button (Visible to Admin User Only) */}
      {isAdmin && (
        <Link
          to={`/admin/products/${product.id}/edit`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#191142] hover:bg-[#0ea9df] text-white text-[11px] font-bold shadow-md transition-all cursor-pointer"
          title="Edit product details in Seller Central"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </Link>
      )}

      {/* Optional Deal Offer Sticker Badge */}
      {Boolean(product.offer_badge_value) && (
        <div className="absolute top-2 right-2 z-10 pointer-events-none drop-shadow-md">
          <OfferBadge
            prefix={product.offer_badge_prefix || "Offer"}
            value={product.offer_badge_value!}
            size="sm"
          />
        </div>
      )}

      <div>
        {/* Product Image */}
        <Link
          to={getProductUrl(product.id)}
          className="block aspect-square w-full overflow-hidden bg-white p-1 sm:p-2 mb-2 sm:mb-2.5 flex items-center justify-center rounded-lg relative"
        >
          <img
            src={displayedImage}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Color Swatches (if product has color variants) */}
        {product.color_variants && product.color_variants.length > 0 && (
          <div className="mb-2">
            <ColorSwatches
              variants={product.color_variants}
              selectedVariant={selectedVariant}
              onSelect={(v) => setSelectedVariant(v)}
              onHover={(v) => setSelectedVariant(v)}
              size="sm"
            />
          </div>
        )}

        {/* Title */}
        <Link to={getProductUrl(product.id)}>
          <h3 className="text-xs sm:text-sm font-bold text-[#191142] group-hover:text-[#0ea9df] line-clamp-2 leading-snug transition-colors min-h-[32px] sm:min-h-[38px]">
            {product.name}
          </h3>
        </Link>

        {/* Product Rating Badge - only if reviews exist */}
        {Boolean(product.rating && (product.review_count ?? 0) > 0) && (
          <div className="mt-1.5 flex items-center">
            <RatingBadge
              rating={product.rating}
              reviewCount={product.review_count}
              size="xs"
            />
          </div>
        )}

        {/* Amazon Deal Badge if discounted */}
        {((product.discount_percent ?? 0) >= 15 || Boolean(product.is_trending)) && (
          <div className="mt-1.5">
            <span className="bg-[#CC0C39] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase tracking-wide inline-block shadow-2xs">
              Limited time deal
            </span>
          </div>
        )}

        {/* Price Block */}
        <div className="mt-1 sm:mt-1.5">
          <PriceTag
            price={product.price}
            originalMRP={product.original_price ?? product.originalMRP}
            discountPercent={product.discount_percent ?? product.discountPercent}
            size="sm"
          />
        </div>
      </div>

      {/* Action Button: Amazon Signature Button */}
      <div className="mt-3 pt-2">
        {product.stock <= 0 ? (
          <button
            disabled
            className="w-full py-2 px-2 rounded-full text-xs font-semibold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
          >
            {t("currentlyUnavailable")}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] hover:shadow-md"
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

        {/* Secondary Admin Quick Update Link */}
        {isAdmin && (
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="mt-2 w-full py-1.5 px-3 rounded-lg border border-gray-300 hover:border-[#0ea9df] bg-gray-50 hover:bg-cyan-50 text-[#191142] hover:text-[#0ea9df] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            title="Edit in Seller Central"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Product</span>
          </Link>
        )}
      </div>
    </div>
  );
}
