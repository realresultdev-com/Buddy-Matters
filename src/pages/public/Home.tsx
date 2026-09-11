import { useState, useEffect } from "react";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import ProductCard from "../../components/product/ProductCard";
import type { Product, Category } from "../../types/product.types";
import {
  Truck,
  RotateCcw,
  Award,
  ChevronRight,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import TrendingSlider from "../../components/product/TrendingSlider";
import OfferBadge from "../../components/common/OfferBadge";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { getCategoryUrl } from "../../utils/urlSecurity";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { language, t } = useLanguage();

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
    <div className="space-y-6 pb-12 w-full max-w-full overflow-hidden">
      {/* 1. Trending Deals (Top first section directly below header) */}
      <TrendingSlider products={products} />

      {/* 2. Brand Hero Banner */}
      <div className="relative overflow-hidden select-none rounded-2xl sm:rounded-3xl shadow-xs">
        <div className="min-h-[260px] sm:h-[340px] md:h-[400px] w-full relative bg-gradient-to-r from-[#191142] via-[#201850] to-[#123860] py-8 sm:py-0">
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600&auto=format&fit=crop&q=80"
            alt="Buddy Mattress Luxury Bedroom Comfort"
            className="w-full h-full object-cover object-center mix-blend-overlay opacity-60 absolute inset-0"
          />
          <div className="relative z-10 flex flex-col justify-center px-4 sm:px-12 md:px-16 max-w-2xl text-white h-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 mt-1.5 sm:mt-2 font-medium max-w-xl">
              {t("heroSubtitle")}
            </p>
            <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
              <a
                href="#catalog"
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] text-white font-bold text-xs shadow-md transition-colors inline-block"
              >
                {t("shopMattresses")}
              </a>
              <span className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-xs flex items-center">
                {t("warrantyButton")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Brand Dynamic Promo Grid - Fully Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 px-0.5">
        {categories.map((cat) => {
          const sampleProduct = products.find((p) => p.categoryId === cat.id);
          const sampleImage =
            sampleProduct?.images?.[0] ||
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=80";

          // Calculate dynamic fallback min price from products in this category
          const defaultMinPrices: Record<string, number> = {
            cat_mattresses: 10499,
            cat_pillows: 1499,
            cat_bedding: 1299,
          };
          const categoryProducts = products.filter((p) => p.categoryId === cat.id);
          const calculatedMin =
            categoryProducts.length > 0
              ? Math.min(...categoryProducts.map((p) => p.price))
              : defaultMinPrices[cat.id] || 99;

          const badgePrefix = cat.offer_badge_prefix || "Starting";
          const badgeValue =
            cat.offer_badge_value && cat.offer_badge_value.trim() !== ""
              ? cat.offer_badge_value
              : `₹${calculatedMin.toLocaleString("en-IN")}`;

          return (
            <div
              key={cat.id}
              className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-gray-200/90 flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <h3 className="text-base font-bold text-[#191142] mb-3 leading-snug">
                  {cat.name}
                </h3>
                <div className="relative mb-3">
                  <Link
                    to={getCategoryUrl(cat.id)}
                    className="block aspect-square w-full bg-gray-50 rounded-xl overflow-hidden relative"
                  >
                    <img
                      src={sampleImage}
                      alt={cat.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Scalloped Yellow Deal Sticker Badge */}
                  <div className="absolute -bottom-3 -right-2 sm:-bottom-3.5 sm:-right-2.5 z-10 pointer-events-none drop-shadow-md">
                    <OfferBadge
                      prefix={badgePrefix}
                      value={badgeValue}
                      size="md"
                    />
                  </div>
                </div>
              </div>
              <Link
                to={getCategoryUrl(cat.id)}
                className="text-xs font-bold text-[#0ea9df] hover:underline flex items-center gap-1 pt-1"
              >
                Explore {cat.name} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* 3. Category Filter Navigation (Clean White Bar with Cyan Active Pills) */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="font-bold text-[#191142] px-2 shrink-0">{t("departments")}</span>
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-colors ${
            selectedCategory === "" || selectedCategory === "All"
              ? "bg-[#0ea9df] text-white border-[#0ea9df] shadow-xs"
              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-[#191142]"
          }`}
        >
          {t("allDepartments")}
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
      <div id="catalog" className="bg-white p-3.5 sm:p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-[#191142] tracking-tight">
              {queryParam ? `${language === "ta" ? "தேடல் முடிவுகள்:" : "Results for"} "${queryParam}"` : t("featuredCollectionTitle")}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
              {t("featuredCollectionDesc")}
            </p>
          </div>
          <span className="text-[11px] sm:text-xs text-gray-500 font-bold bg-gray-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shrink-0">
            {filteredProducts.length} {language === "ta" ? "பொருட்கள்" : "items"}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border border-gray-200 p-3 rounded-lg space-y-2 animate-pulse">
                <div className="aspect-square bg-gray-100 rounded" />
                <div className="h-3 bg-gray-100 w-3/4 rounded" />
                <div className="h-3 bg-gray-100 w-1/2 rounded" />
                <div className="h-8 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-sm font-bold text-gray-700">{t("noProductsFound")}</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {t("noProductsSub")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 5. Buddy Mattress Guarantees Strip */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center space-y-1.5 p-2">
          <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center mb-1">
            <Truck className="w-5 h-5 text-[#0ea9df]" />
          </div>
          <h4 className="font-bold text-sm text-[#191142] tracking-tight">
            {language === "ta" ? "இலவச டெலிவரி & அன்பாக்சிங்" : "Free Delivery & Unboxing"}
          </h4>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            {language === "ta"
              ? "பாதுகாப்பான பேக்கேஜிங்குடன் உங்கள் வீட்டு வாசலில் இலவச டெலிவரி."
              : "Directly delivered to your doorstep in vacuum-sealed, easy-to-carry packaging."}
          </p>
        </div>
        <div className="flex flex-col items-center space-y-1.5 p-2 border-y sm:border-y-0 sm:border-x border-gray-100 py-4 sm:py-2">
          <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center mb-1">
            <RotateCcw className="w-5 h-5 text-[#0ea9df]" />
          </div>
          <h4 className="font-bold text-sm text-[#191142] tracking-tight">
            {language === "ta" ? "100-இரவு வீட்டு சோதனை" : "100-Night Risk-Free Trial"}
          </h4>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            {language === "ta"
              ? "உங்கள் வீட்டில் நிம்மதியாக தூங்கி பாருங்கள். திருப்தி இல்லை என்றால் 100% முழு பணம் திரும்பப் பெறலாம்."
              : "Sleep on it in the comfort of your home. If you don't love it, return it for a 100% full refund."}
          </p>
        </div>
        <div className="flex flex-col items-center space-y-1.5 p-2">
          <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center mb-1">
            <Award className="w-5 h-5 text-[#0ea9df]" />
          </div>
          <h4 className="font-bold text-sm text-[#191142] tracking-tight">
            {language === "ta" ? "10-ஆண்டு முழு உத்தரவாதம்" : "10-Year Warranty"}
          </h4>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            {language === "ta"
              ? "உயர்தர நீடித்த மீள் திறன் கொண்ட ஃபோம் பொருட்களால் உருவாக்கப்பட்டது."
              : "Built with ultra-durable high-resilience foam and certified materials."}
          </p>
        </div>
      </div>
    </div>
  );
}
