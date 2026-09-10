import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productService } from "../../services/product.service";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../types/product.types";
import Loader from "../../components/common/Loader";
import {
  Star,
  ShieldCheck,
  RotateCcw,
  Truck,
  Award,
  Lock,
  ChevronRight,
  Check,
  MapPin,
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
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
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Loader text="Loading product details..." />;
  if (!product) {
    return (
      <div className="bg-white p-8 text-center border border-gray-200">
        <p className="text-gray-800">Product not found.</p>
        <Link to="/" className="text-amazon-blue hover:underline text-sm font-semibold mt-2 inline-block">
          Return to Amazon home
        </Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"];

  const originalMRP = Math.round(product.price * 1.28);
  const discountPercent = Math.round(((originalMRP - product.price) / originalMRP) * 100);

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
    <div className="bg-white border border-gray-200 p-4 sm:p-6 shadow-sm space-y-6">
      {/* Breadcrumb trail */}
      <nav className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
        <Link to="/" className="text-[#0ea9df] hover:underline font-medium">
          Buddy Mattress
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="hover:text-[#0ea9df] hover:underline cursor-pointer">
          {product.category?.name || "Sleep Collection"}
        </span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-700 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 3-Column PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Column 1: Images (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible shrink-0">
              {images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setSelectedImage(img)}
                  onClick={() => setSelectedImage(img)}
                  className={`w-12 h-12 rounded border p-0.5 overflow-hidden transition-all ${
                    (selectedImage || images[0]) === img
                      ? "border-[#0ea9df] ring-2 ring-[#0ea9df]/20 shadow-sm"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Main Stage Image */}
          <div className="flex-1 aspect-square bg-white flex items-center justify-center p-4 border border-gray-200 rounded-lg">
            <img
              src={selectedImage || images[0]}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        {/* Column 2: Product Specifications & Details (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <Link to="/" className="text-xs font-bold text-[#0ea9df] hover:underline">
              Official Buddy Mattress Store
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-[#191142] leading-snug mt-1">
              {product.name}
            </h1>
          </div>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-2 text-xs text-gray-600 border-b border-gray-200 pb-3">
            <div className="flex text-[#de7921]">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="font-medium text-gray-800">4.7</span>
            <span className="text-amazon-blue hover:underline cursor-pointer">
              3,492 ratings
            </span>
            <span>|</span>
            <span className="text-amazon-blue hover:underline cursor-pointer">
              142 answered questions
            </span>
          </div>

          {/* Amazon's Choice Tag */}
          <div className="w-fit">
            <span className="bg-[#232f3e] text-white text-xs font-bold px-2 py-1 rounded-sm">
              Amazon's <span className="text-[#febd69]">Choice</span>
            </span>
          </div>

          {/* Price Block */}
          <div className="space-y-1 border-b border-gray-200 pb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-[#cc0c39] font-light text-2xl">-{discountPercent}%</span>
              <div className="flex items-start text-[#0f1111]">
                <span className="text-xs mt-1">₹</span>
                <span className="text-3xl font-semibold">
                  {product.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              M.R.P.: <span className="line-through">₹{originalMRP.toLocaleString("en-IN")}</span>
            </p>
            <p className="text-xs text-gray-700 font-medium">Inclusive of all taxes</p>
            <p className="text-xs text-gray-600 pt-1">
              <span className="font-bold text-[#0f1111]">EMI</span> starts at ₹{Math.round(product.price / 12).toLocaleString("en-IN")}. No Cost EMI available.
            </p>
          </div>

          {/* Service Guarantees */}
          <div className="grid grid-cols-4 gap-2 text-center py-2 border-b border-gray-200 text-xs">
            <div className="flex flex-col items-center space-y-1">
              <RotateCcw className="w-6 h-6 text-amazon-blue" />
              <span className="text-[11px] text-amazon-blue hover:underline cursor-pointer leading-tight">
                7 days Replacement
              </span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Truck className="w-6 h-6 text-amazon-blue" />
              <span className="text-[11px] text-amazon-blue hover:underline cursor-pointer leading-tight">
                Free Delivery
              </span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <ShieldCheck className="w-6 h-6 text-amazon-blue" />
              <span className="text-[11px] text-amazon-blue hover:underline cursor-pointer leading-tight">
                2 Year Warranty
              </span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Award className="w-6 h-6 text-amazon-blue" />
              <span className="text-[11px] text-amazon-blue hover:underline cursor-pointer leading-tight">
                Top Brand
              </span>
            </div>
          </div>

          {/* About this item */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-sm text-[#0f1111]">About this item</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-800 leading-relaxed">
              <li>{product.description}</li>
              <li>Engineered with cutting-edge edge architecture and low-latency precision.</li>
              <li>High-durability ergonomic form factor built with aerospace-grade composite materials.</li>
              <li>Full compatibility across iOS, Android, macOS, and Windows ecosystems.</li>
            </ul>
          </div>
        </div>

        {/* Column 3: Amazon Buy Box (3 cols on lg) */}
        <div className="lg:col-span-3">
          <div className="border border-gray-300 rounded-lg p-4 bg-white text-xs space-y-3.5 shadow-sm">
            {/* Price */}
            <div className="text-2xl font-bold text-[#0f1111]">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            {/* Delivery Promise */}
            <div className="space-y-1">
              <p className="text-xs">
                <span className="font-bold text-[#00a8e1] italic">✓prime</span>{" "}
                <span className="font-bold text-gray-900">FREE delivery</span>{" "}
                <span className="font-bold">Tomorrow, 11 AM.</span>
              </p>
              <div className="flex items-center gap-1 text-amazon-blue hover:underline cursor-pointer text-[11px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Deliver to Bengaluru 560001</span>
              </div>
            </div>

            {/* Stock State */}
            {product.stock > 0 ? (
              <p className="text-base font-bold text-[#007600]">In stock</p>
            ) : (
              <p className="text-base font-bold text-[#b12704]">Currently unavailable</p>
            )}

            {/* Seller info */}
            <div className="space-y-1 text-[11px] text-gray-600 border-t border-b border-gray-200 py-2">
              <div className="flex justify-between">
                <span>Ships from</span>
                <span className="font-medium text-gray-900">Amazon</span>
              </div>
              <div className="flex justify-between">
                <span>Sold by</span>
                <span className="font-medium text-amazon-blue hover:underline cursor-pointer">
                  Lumina Retail Ltd.
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-2.5">
                {/* Quantity select */}
                <div className="flex items-center gap-2">
                  <label htmlFor="quantity" className="font-semibold text-gray-700">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded bg-gray-100 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-amazon-orange cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 rounded-lg font-bold text-xs bg-[#0ea9df] hover:bg-[#0c93c4] text-white shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-white" /> Added to Cart
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 rounded-lg font-bold text-xs bg-[#191142] hover:bg-[#251b5c] text-white shadow-xs hover:shadow-md transition-all"
                >
                  Buy Now
                </button>
              </div>
            )}

            {/* Secure Transaction */}
            <div className="flex items-center gap-1.5 text-gray-500 text-[11px] pt-2 border-t border-gray-100">
              <Lock className="w-3.5 h-3.5 text-[#0ea9df]" />
              <span>100% Secure Checkout & 100-Night Trial Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
