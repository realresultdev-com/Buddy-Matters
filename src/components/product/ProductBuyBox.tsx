import { useState } from "react";
import { MapPin, Check, Lock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import type { Product } from "../../types/product.types";

interface ProductBuyBoxProps {
  product: Product;
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
  isAdding?: boolean;
  className?: string;
}

export default function ProductBuyBox({
  product,
  onAddToCart,
  onBuyNow,
  isAdding = false,
  className = "",
}: ProductBuyBoxProps) {
  const [quantity, setQuantity] = useState(1);
  const { t } = useLanguage();
  const inStock = product.stock > 0;
  const maxQty = Math.min(10, Math.max(1, product.stock));

  return (
    <div
      className={`border border-gray-200 rounded-xl p-4 sm:p-5 bg-white text-xs space-y-4 shadow-xs ${className}`}
    >
      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span className="text-xs font-bold text-gray-600">₹</span>
        <span className="text-2xl sm:text-3xl font-black text-[#191142] tracking-tight">
          {product.price.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Delivery Promise */}
      <div className="space-y-1">
        <p className="text-xs leading-relaxed font-semibold text-emerald-700">
          {t("buddyPrimeFree")}
        </p>
        <div className="flex items-center gap-1 text-[#0ea9df] hover:underline cursor-pointer text-[11px] font-medium">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{t("deliverToLocation")}</span>
        </div>
      </div>

      {/* Stock State */}
      <div>
        {inStock ? (
          <p className="text-sm font-bold text-emerald-700">
            {product.stock <= 5
              ? t("onlyLeft", { n: product.stock })
              : `${t("inStock")} (${product.stock})`}
          </p>
        ) : (
          <p className="text-sm font-bold text-rose-600">{t("currentlyUnavailable")}</p>
        )}
      </div>

      {/* Seller & Trial Details */}
      <div className="space-y-1.5 text-[11px] text-gray-600 border-t border-b border-gray-100 py-3">
        <div className="flex justify-between items-center">
          <span>{t("shipsFrom")}</span>
          <span className="font-semibold text-[#191142]">Buddy Logistics</span>
        </div>
        <div className="flex justify-between items-center">
          <span>{t("soldBy")}</span>
          <span className="font-semibold text-[#0ea9df] hover:underline cursor-pointer">
            Buddy Direct
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>{t("trialPeriod")}</span>
          <span className="font-semibold text-emerald-700">{t("trial100Nights")}</span>
        </div>
      </div>

      {/* Actions */}
      {inStock && (
        <div className="space-y-3">
          {/* Quantity selector */}
          <div className="flex items-center justify-between">
            <label htmlFor="buybox-quantity" className="font-semibold text-gray-700">
              {t("quantity")}
            </label>
            <select
              id="buybox-quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0ea9df] cursor-pointer"
            >
              {Array.from({ length: maxQty }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={() => onAddToCart(quantity)}
            className="w-full py-3 rounded-lg font-bold text-xs bg-[#0ea9df] hover:bg-[#0c93c4] text-white shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 text-white animate-bounce" /> {t("addedToCart")}
              </>
            ) : (
              t("addToCart")
            )}
          </button>

          {/* Buy Now */}
          <button
            type="button"
            onClick={() => onBuyNow(quantity)}
            className="w-full py-3 rounded-lg font-bold text-xs bg-[#191142] hover:bg-[#261d5e] text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            {t("buyNow")}
          </button>
        </div>
      )}

      {/* Security & Guarantee Footer */}
      <div className="flex items-center gap-2 text-gray-500 text-[11px] pt-1">
        <Lock className="w-3.5 h-3.5 text-[#0ea9df] shrink-0" />
        <span>{t("secureCheckout")}</span>
      </div>
    </div>
  );
}
