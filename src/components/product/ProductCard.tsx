import { Link } from "react-router-dom";
import { Star, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types/product.types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";

  // Simulate Amazon calculated original M.R.P. (20-30% higher)
  const originalMRP = Math.round(product.price * 1.28);
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
    <div className="bg-white border border-gray-200 rounded-none p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative">
      {/* Best Seller / Amazon's Choice badge */}
      <div className="min-h-[24px] mb-1">
        {product.stock > 15 ? (
          <span className="inline-block bg-[#e67a00] text-white text-[11px] font-bold px-2 py-0.5 rounded-r-md -ml-4 shadow-sm">
            #1 Best Seller
          </span>
        ) : (
          <span className="inline-block bg-[#232f3e] text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
            Amazon's <span className="text-[#febd69]">Choice</span>
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${product.id}`}
        className="block aspect-square w-full overflow-hidden bg-white p-2 mb-3 flex items-center justify-center"
      >
        <img
          src={mainImage}
          alt={product.name}
          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-medium text-[#0f1111] hover:text-[#c7511f] line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Star Ratings */}
          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-700">
            <div className="flex text-[#de7921]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-amazon-blue hover:text-amazon-linkHover cursor-pointer text-[12px] font-medium ml-1">
              4,821
            </span>
          </div>

          {/* Amazon Deal Tag */}
          <div className="mt-1">
            <span className="bg-[#cc0c39] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              Limited time deal
            </span>
          </div>

          {/* Price breakdown */}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[#cc0c39] font-light text-xl">-{discountPercent}%</span>
            <div className="flex items-start text-[#0f1111]">
              <span className="text-xs font-normal mt-0.5">₹</span>
              <span className="text-2xl font-bold tracking-tight">
                {product.price.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-gray-500">
            M.R.P.: <span className="line-through">₹{originalMRP.toLocaleString("en-IN")}</span>
          </div>

          {/* Prime & Delivery info */}
          <div className="mt-2 text-xs text-gray-700 space-y-0.5">
            <div className="flex items-center gap-1 font-bold text-[#00a8e1]">
              <span className="text-sm italic">✓prime</span>
            </div>
            <p className="text-[12px]">
              Get it by <span className="font-bold text-[#0f1111]">Tomorrow, 11 AM</span>
            </p>
            <p className="text-[11px] text-gray-500">FREE Delivery by Amazon</p>
          </div>
        </div>

        {/* Action Button: Amazon Yellow Add to Cart Button */}
        <div className="mt-4 pt-2">
          {product.stock <= 0 ? (
            <button
              disabled
              className="w-full py-1.5 px-3 rounded-full text-xs font-semibold bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
            >
              Currently Unavailable
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-4 rounded-full text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                added
                  ? "bg-[#007600] text-white border border-[#007600]"
                  : "bg-amazon-btnYellow hover:bg-amazon-btnYellowHover text-[#0f1111] border border-[#fcd200]"
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
