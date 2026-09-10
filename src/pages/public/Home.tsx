import { useState, useEffect } from "react";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import ProductCard from "../../components/product/ProductCard";
import type { Product, Category } from "../../types/product.types";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronRight,
  Flame,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const queryParam = searchParams.get("search") || "";
  const catParam = searchParams.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam);

  useEffect(() => {
    setSelectedCategory(catParam);
  }, [catParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      queryParam === "" ||
      p.name.toLowerCase().includes(queryParam.toLowerCase()) ||
      p.description.toLowerCase().includes(queryParam.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      selectedCategory === "All" ||
      p.categoryId === selectedCategory ||
      (p as any).category?.name?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Brand Hero Banner with Bottom Gradient Fade */}
      <div className="relative -mx-2 sm:-mx-4 -mt-4 overflow-hidden select-none">
        <div className="h-[280px] sm:h-[400px] md:h-[480px] w-full relative bg-gradient-to-r from-[#191142] via-[#201850] to-[#123860]">
          <img
            src="https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=1600&auto=format&fit=crop&q=80"
            alt="Buddy Mattress Luxury Bedroom Comfort"
            className="w-full h-full object-cover object-center mix-blend-overlay opacity-60"
          />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16 max-w-2xl text-white">
            <span className="inline-flex items-center gap-1.5 bg-[#0ea9df] text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> 100-NIGHT FREE HOME TRIAL
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Wake Up Energized. Sleep on Pure Luxury.
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 mt-2 font-medium">
              India's premier orthopedic memory foam mattresses, cooling gel pillows & breathable protectors.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="#catalog"
                className="px-5 py-2.5 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] text-white font-bold text-xs shadow-md transition-colors inline-block"
              >
                Shop All Mattresses
              </a>
              <span className="px-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-xs flex items-center">
                10-Year Comprehensive Warranty
              </span>
            </div>
          </div>
        </div>

        {/* Gradient Mask fading banner seamlessly into the clean white/light slate background */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#f8fafc] to-transparent pointer-events-none" />
      </div>

      {/* 2. Brand 4-Box Promo Grid (Overlapping the hero banner) */}
      <div className="relative -mt-24 sm:-mt-36 md:-mt-48 z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
        {/* Card 1: Orthopedic Mattresses */}
        <div className="bg-white p-4.5 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-base font-bold text-[#191142] mb-2 leading-snug">
              Orthopedic Spine Support Mattresses
            </h3>
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
              <img
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=80"
                alt="Orthopedic Mattress"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <Link
            to={`/category/${categories[0]?.id || ""}`}
            className="text-xs font-bold text-[#0ea9df] hover:underline flex items-center gap-1 pt-2"
          >
            Explore Orthopedic range <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Ergonomic Pillows */}
        <div className="bg-white p-4.5 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-base font-bold text-[#191142] mb-2 leading-snug">
              Ergonomic Contour & Cooling Pillows
            </h3>
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
              <img
                src="https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80"
                alt="Cooling Gel Pillows"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <Link
            to={`/category/${categories[1]?.id || ""}`}
            className="text-xs font-bold text-[#0ea9df] hover:underline flex items-center gap-1 pt-2"
          >
            Shop Pillows & Cushions <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Bedding & Protectors */}
        <div className="bg-white p-4.5 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-base font-bold text-[#191142] mb-2 leading-snug">
              Mattress Protectors & Comfort Toppers
            </h3>
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
              <img
                src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80"
                alt="Bedding and Protectors"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
          <Link
            to={`/category/${categories[2]?.id || ""}`}
            className="text-xs font-bold text-[#0ea9df] hover:underline flex items-center gap-1 pt-2"
          >
            Discover Bedding Essentials <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 4: Member Sleep Club Box */}
        <div className="bg-white p-4.5 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-base font-bold text-[#191142] mb-2 leading-snug">
              {user ? `Welcome, ${user.name}` : "Join the Buddy Sleep Club"}
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              {user
                ? "Manage your active trial period, warranty registrations, and track shipments."
                : "Unlock exclusive member pricing, 100-night trial benefits, and free doorstep delivery across India."}
            </p>
            {!user ? (
              <Link
                to="/login"
                className="block w-full py-2.5 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] font-bold text-center text-xs shadow-sm text-white transition-colors"
              >
                Sign In to Buddy Mattress
              </Link>
            ) : (
              <Link
                to="/orders"
                className="block w-full py-2.5 rounded-lg bg-[#191142] hover:bg-[#251b5c] font-bold text-center text-xs shadow-sm text-white transition-colors"
              >
                View Your Orders
              </Link>
            )}
          </div>
          <div className="pt-3 border-t border-gray-100 space-y-1">
            <span className="text-[11px] font-semibold text-gray-600 block flex items-center gap-1">
              ✓ 100-Night Risk-Free Home Trial
            </span>
            <span className="text-[11px] font-semibold text-gray-600 block flex items-center gap-1">
              ✓ 10-Year Comprehensive Warranty
            </span>
            <span className="text-[11px] font-semibold text-gray-600 block flex items-center gap-1">
              ✓ Free Delivery & Professional Unboxing
            </span>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Navigation (Clean White Bar with Cyan Active Pills) */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="font-bold text-[#191142] px-2 shrink-0">Departments:</span>
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-colors ${
            selectedCategory === "" || selectedCategory === "All"
              ? "bg-[#0ea9df] text-white border-[#0ea9df] shadow-xs"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-[#191142]"
          }`}
        >
          All Departments
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? "bg-[#0ea9df] text-white border-[#0ea9df] shadow-xs"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-[#191142]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 4. Main Product Catalog Showcase (White Product Cards Grid) */}
      <div id="catalog" className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-[#191142] flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#0ea9df]" />
              {queryParam ? `Results for "${queryParam}"` : "Featured Sleep & Comfort Collection"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Engineered with advanced orthopedic support and breathable airflow foam.
            </p>
          </div>
          <span className="text-xs text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-full">
            {filteredProducts.length} items
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-gray-200 p-4 rounded-lg space-y-3 animate-pulse">
                <div className="aspect-square bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 w-3/4 rounded" />
                <div className="h-4 bg-gray-100 w-1/2 rounded" />
                <div className="h-9 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <h3 className="text-base font-bold text-[#191142]">No products found</h3>
            <p className="text-xs text-gray-500">
              Try adjusting your category selection or search keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 5. Buddy Mattress Guarantees Strip */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center space-y-2 p-2">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
            <Truck className="w-6 h-6 text-[#0ea9df]" />
          </div>
          <h4 className="font-bold text-sm text-[#191142]">Free Delivery & Unboxing</h4>
          <p className="text-xs text-gray-500 max-w-xs">
            Directly delivered to your doorstep in vacuum-sealed, easy-to-carry packaging.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 p-2">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-[#0ea9df]" />
          </div>
          <h4 className="font-bold text-sm text-[#191142]">100-Night Risk-Free Trial</h4>
          <p className="text-xs text-gray-500 max-w-xs">
            Sleep on it in the comfort of your home. If you don't love it, we'll give you a 100% refund.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 p-2">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
            <Award className="w-6 h-6 text-[#0ea9df]" />
          </div>
          <h4 className="font-bold text-sm text-[#191142]">10-Year Warranty</h4>
          <p className="text-xs text-gray-500 max-w-xs">
            Built with ultra-durable high-resilience foam and genuine European certified materials.
          </p>
        </div>
      </div>
    </div>
  );
}
