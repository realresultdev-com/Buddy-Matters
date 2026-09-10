import { useState, useEffect } from "react";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import type { Product, Category } from "../../types/product.types";
import ProductCard from "../../components/product/ProductCard";
import { useAuth } from "../../hooks/useAuth";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getAll(selectedCategory || undefined),
          categoryService.getAll(),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to load store data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory]);

  const filteredProducts = products.filter((p) => {
    if (!queryParam) return true;
    return (
      p.name.toLowerCase().includes(queryParam.toLowerCase()) ||
      p.description.toLowerCase().includes(queryParam.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Amazon Hero Banner with Bottom Gradient Fade */}
      <div className="relative -mx-2 sm:-mx-4 -mt-4 overflow-hidden select-none">
        <div className="h-[260px] sm:h-[380px] md:h-[460px] w-full relative bg-gradient-to-r from-[#1c2e4a] via-[#1b3b65] to-[#254d80]">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80"
            alt="Amazon Great Festival"
            className="w-full h-full object-cover object-center mix-blend-overlay opacity-50"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16 max-w-2xl text-white">
            <span className="inline-block bg-[#cc0c39] text-white text-xs font-bold px-2 py-0.5 rounded w-fit mb-3">
              GREAT INDIAN FESTIVAL
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Up to 60% off | Top tech, audio & smart devices
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 mt-2 font-medium">
              Free 1-Day delivery on Prime items. Shop the biggest deals today.
            </p>
          </div>
        </div>

        {/* Gradient Mask fading banner seamlessly into the #eaeded background */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#eaeded] to-transparent pointer-events-none" />
      </div>

      {/* 2. Amazon 4-Box Promo Grid (Overlapping the hero banner) */}
      <div className="relative -mt-24 sm:-mt-36 md:-mt-48 z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
        {/* Card 1 */}
        <div className="bg-white p-4 shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0f1111] mb-2 leading-snug">
              Audio & ANC Headphones | Up to 50% off
            </h3>
            <div className="aspect-square bg-gray-100 overflow-hidden mb-2">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
                alt="Headphones"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <Link
            to={`/category/${categories[0]?.id || ""}`}
            className="text-xs font-semibold text-amazon-blue hover:text-amazon-linkHover hover:underline block pt-2"
          >
            See all audio deals
          </Link>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0f1111] mb-2 leading-snug">
              Smartwatches & Fitness Trackers
            </h3>
            <div className="aspect-square bg-gray-100 overflow-hidden mb-2">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
                alt="Smartwatches"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <Link
            to={`/category/${categories[1]?.id || ""}`}
            className="text-xs font-semibold text-amazon-blue hover:text-amazon-linkHover hover:underline block pt-2"
          >
            Explore wearable tech
          </Link>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0f1111] mb-2 leading-snug">
              Laptops, Workstations & Accessories
            </h3>
            <div className="aspect-square bg-gray-100 overflow-hidden mb-2">
              <img
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80"
                alt="Laptops"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <Link
            to={`/category/${categories[2]?.id || ""}`}
            className="text-xs font-semibold text-amazon-blue hover:text-amazon-linkHover hover:underline block pt-2"
          >
            Discover computing deals
          </Link>
        </div>

        {/* Card 4: Sign-in / Personalize Box */}
        <div className="bg-white p-4 shadow-sm border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0f1111] mb-2 leading-snug">
              {user ? `Welcome back, ${user.name}` : "Sign in for your best experience"}
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              {user
                ? "Track your recent orders and manage your account settings."
                : "Sign in securely to browse personalized recommendations and fast checkout."}
            </p>
            {!user ? (
              <Link
                to="/login"
                className="block w-full py-2 rounded-lg bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#a88734] font-semibold text-center text-xs shadow-sm text-gray-900"
              >
                Sign in securely
              </Link>
            ) : (
              <Link
                to="/orders"
                className="block w-full py-2 rounded-lg bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#a88734] font-semibold text-center text-xs shadow-sm text-gray-900"
              >
                View Your Orders
              </Link>
            )}
          </div>
          <div className="pt-4 border-t border-gray-100">
            <span className="text-[11px] text-gray-500 block">✓ 100% Free Edge Hosting</span>
            <span className="text-[11px] text-gray-500 block">✓ Cloudflare D1 High Availability</span>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Navigation */}
      <div className="bg-white p-3 border border-gray-200 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="font-bold text-gray-700 px-2 shrink-0">Departments:</span>
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${
            selectedCategory === ""
              ? "bg-[#232f3e] text-white border-[#232f3e]"
              : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
          }`}
        >
          All Departments
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? "bg-[#232f3e] text-white border-[#232f3e]"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 4. Main Product Catalog Showcase (Amazon White Product Grid) */}
      <div className="bg-white p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#0f1111]">
              {queryParam ? `Results for "${queryParam}"` : "Recommended Deals For You"}
            </h2>
            <p className="text-xs text-gray-500">Check each product page for other buying options.</p>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {filteredProducts.length} items
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-gray-200 p-4 space-y-3 animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="h-4 bg-gray-200 w-3/4" />
                <div className="h-4 bg-gray-200 w-1/2" />
                <div className="h-8 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <h3 className="text-base font-bold text-gray-800">No results found</h3>
            <p className="text-xs text-gray-500">Try checking your spelling or use more general terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 5. Amazon Services Trust Strip */}
      <div className="bg-white border border-gray-200 p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center space-y-1">
          <Truck className="w-8 h-8 text-[#007185]" />
          <h4 className="font-bold text-sm text-gray-900">Fast, Free Delivery</h4>
          <p className="text-xs text-gray-500">Free delivery on orders over ₹499</p>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <RotateCcw className="w-8 h-8 text-[#007185]" />
          <h4 className="font-bold text-sm text-gray-900">7 Days Replacement</h4>
          <p className="text-xs text-gray-500">Hassle-free return & replacement policy</p>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <ShieldCheck className="w-8 h-8 text-[#007185]" />
          <h4 className="font-bold text-sm text-gray-900">100% Purchase Protection</h4>
          <p className="text-xs text-gray-500">Genuine products with official brand warranty</p>
        </div>
      </div>
    </div>
  );
}
