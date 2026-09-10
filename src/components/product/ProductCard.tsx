import { Link } from "react-router-dom";
import { ShoppingCart, Check } from "lucide-react";
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
    <div className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-800">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Pill */}
        {product.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-950/75 backdrop-blur-md text-slate-200 border border-slate-700/50">
            {product.category.name}
          </span>
        )}
        {/* Stock indicator */}
        {product.stock <= 0 ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/90 text-white shadow">
            Out of Stock
          </span>
        ) : product.stock < 5 ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-500/90 text-white shadow">
            Only {product.stock} left
          </span>
        ) : null}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Price</span>
            <div className="text-lg font-bold text-white">
              ₹{product.price.toLocaleString("en-IN")}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl text-sm font-medium transition-all ${
              added
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : product.stock <= 0
                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 hover:scale-105"
            }`}
            aria-label="Add to cart"
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
