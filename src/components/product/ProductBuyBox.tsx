import { useState } from "react";
import { Check, Lock } from "lucide-react";
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

          {/* Statutory Disclosures (Legal Metrology Rule 6 & 10) */}
          <div className="pt-2 pb-1 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Country of Origin:</span>
              <span className="font-bold text-gray-800 flex items-center gap-1">
                <span>🇮🇳</span> India
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Net Quantity:</span>
              <span className="font-bold text-gray-800">
                {product.categoryId === "cat_pillows" || product.name.toLowerCase().includes("pillow")
                  ? "1 N (Pillow)"
                  : product.categoryId === "cat_bedding" || product.name.toLowerCase().includes("protector")
                  ? "1 N (Protector)"
                  : "1 N (Mattress)"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Manufacturer:</span>
              <span className="font-semibold text-gray-700 truncate max-w-[160px]" title="Buddy Mattress, Paramathi Velur, Tamil Nadu">
                Buddy Mattress (TN)
              </span>
            </div>
          </div>

          {/* Add to Cart: Buddy Mattress Brand Button */}
          <button
            type="button"
            onClick={() => onAddToCart(quantity)}
            className="w-full py-3 rounded-full font-bold text-xs bg-[#191142] hover:bg-[#281c62] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 animate-bounce" /> {t("addedToCart")}
              </>
            ) : (
              t("addToCart")
            )}
          </button>

          {/* Buy Now: Buddy Mattress Signature Cyan Button */}
          <button
            type="button"
            onClick={() => onBuyNow(quantity)}
            className="w-full py-3 rounded-full font-bold text-xs bg-[#0ea9df] hover:bg-[#0c95c5] text-white shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
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
