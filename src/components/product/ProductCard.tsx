import { Link } from "react-router-dom";
import { Star, Check, Sparkles, Truck } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types/product.types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800";

  // Simulated original M.R.P. (25-35% higher)
  const originalMRP = Math.round(product.price * 1.3);
  const discountPercent = Math.round(((originalMRP - product.price) / originalMRP) * 100);

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
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#0ea9df] hover:shadow-md transition-all relative group">
      {/* Brand Badge */}
      <div className="min-h-[24px] mb-1">
        {product.stock > 15 ? (
          <span className="inline-flex items-center gap-1 bg-[#191142] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#0ea9df]" /> Best Seller
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-cyan-50 text-[#0ea9df] border border-cyan-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Buddy Pick
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="block aspect-square w-full overflow-hidden bg-white p-2 mb-3 flex items-center justify-center rounded-lg"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-bold text-[#191142] group-hover:text-[#0ea9df] line-clamp-2 leading-snug transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Star Ratings */}
          <div className="flex items-center gap-1 mt-1.5 text-xs">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-[#0ea9df] font-semibold text-[11px] ml-1">
              4.9 (1.2k+ reviews)
            </span>
          </div>

          {/* Discount Pill */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="bg-rose-50 text-rose-700 text-[11px] font-bold px-2 py-0.5 rounded border border-rose-200">
              -{discountPercent}% OFF
            </span>
            <span className="text-[11px] text-gray-500 font-medium">Limited Deal</span>
          </div>

          {/* Price breakdown */}
          <div className="mt-2 flex items-baseline gap-2">
            <div className="flex items-start text-[#191142]">
              <span className="text-xs font-semibold mt-0.5">₹</span>
              <span className="text-2xl font-black tracking-tight">
                {product.price.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="text-[11px] text-gray-500">
              M.R.P.: <span className="line-through">₹{originalMRP.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Delivery & Warranty info */}
          <div className="mt-2.5 text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100">
            <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" /> Free Doorstep Delivery
            </p>
            <p className="text-[11px] text-gray-500">100-Night Trial • 10-Yr Warranty</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-2">
          {product.stock <= 0 ? (
            <button
              disabled
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            >
              Currently Unavailable
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-[#0ea9df] hover:bg-[#0c93c4] text-white hover:shadow-md"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added to Cart
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
