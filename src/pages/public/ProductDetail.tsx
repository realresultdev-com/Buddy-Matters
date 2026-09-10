import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService } from "../../services/product.service";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types/product.types";
import Loader from "../../components/common/Loader";
import {
  ArrowLeft,
  ShoppingCart,
  Zap,
  ShieldCheck,
  RotateCcw,
  Truck,
  Check,
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getById(id);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setSelectedImage(res.data.images[0]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader text="Loading product details..." />;
  if (error || !product) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-rose-400 text-sm">{error || "Product not found."}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: selectedImage || images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: selectedImage || images[0],
    });
    navigate("/checkout");
  };

  return (
    <div className="space-y-8 pb-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 relative">
            <img
              src={selectedImage || images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    (selectedImage || images[0]) === img
                      ? "border-indigo-500 scale-105"
                      : "border-slate-800 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
                {product.category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-slate-400">Inclusive of all taxes</span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 text-xs">
            {product.stock > 0 ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                In Stock ({product.stock} units available)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                Out of Stock
              </span>
            )}
          </div>

          <p className="text-sm text-slate-300 leading-relaxed border-t border-b border-slate-800/80 py-4">
            {product.description}
          </p>

          {/* Quantity selector & CTAs */}
          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400 font-medium">Quantity</span>
                <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-sm font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                    added
                      ? "bg-emerald-600 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                  }`}
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {added ? "Added to Cart" : "Add to Cart"}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-900 border border-slate-700 hover:border-slate-600 text-white hover:bg-slate-800 transition-all"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Instant Checkout
                </button>
              </div>
            </div>
          )}

          {/* Perks */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 text-center">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <Truck className="w-4 h-4 mx-auto text-indigo-400" />
              <p className="text-[11px] font-semibold text-slate-200">Express Delivery</p>
              <p className="text-[10px] text-slate-500">Zero shipping fee</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <ShieldCheck className="w-4 h-4 mx-auto text-emerald-400" />
              <p className="text-[11px] font-semibold text-slate-200">2-Year Warranty</p>
              <p className="text-[10px] text-slate-500">Official guarantee</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <RotateCcw className="w-4 h-4 mx-auto text-cyan-400" />
              <p className="text-[11px] font-semibold text-slate-200">7 Days Return</p>
              <p className="text-[10px] text-slate-500">No questions asked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
