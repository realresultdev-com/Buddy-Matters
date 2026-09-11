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
    <div className="space-y-6 pb-12">
      {/* 1. Brand Hero Banner with Bottom Gradient Fade */}
      <div className="relative -mx-2 sm:-mx-4 -mt-4 overflow-hidden select-none">
        <div className="min-h-[300px] sm:h-[400px] md:h-[480px] w-full relative bg-gradient-to-r from-[#191142] via-[#201850] to-[#123860] py-8 sm:py-0">
          <img
            src="https://images.unsplash.com/photo-1540518614846-7ede433c4ef5?w=1600&auto=format&fit=crop&q=80"
            alt="Buddy Mattress Luxury Bedroom Comfort"
            className="w-full h-full object-cover object-center mix-blend-overlay opacity-60 absolute inset-0"
          />
          <div className="relative z-10 flex flex-col justify-center px-4 sm:px-12 md:px-16 max-w-2xl text-white h-full">
            <span className="inline-flex items-center gap-1.5 bg-[#0ea9df] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full w-fit mb-2 sm:mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> {t("heroBadge")}
            </span>
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

        {/* Gradient Mask fading banner seamlessly into the clean background */}
        <div className="hidden sm:block absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8fafc] to-transparent pointer-events-none" />
      </div>

      {/* 2. Brand Dynamic Promo Grid */}
      <div className="relative mt-2 sm:-mt-24 md:-mt-44 z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-0.5">
        {categories.slice(0, 3).map((cat) => {
          const sampleProduct = products.find((p) => p.categoryId === cat.id);
          const sampleImage =
            sampleProduct?.images?.[0] ||
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=80";

          return (
            <div
              key={cat.id}
              className="bg-white p-4.5 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-base font-bold text-[#191142] mb-2 leading-snug">
                  {cat.name}
                </h3>
                <Link
                  to={getCategoryUrl(cat.id)}
                  className="block aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2"
                >
                  <img
                    src={sampleImage}
                    alt={cat.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>
              <Link
                to={getCategoryUrl(cat.id)}
                className="text-xs font-bold text-[#0ea9df] hover:underline flex items-center gap-1 pt-2"
              >
                Explore {cat.name} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}

        {/* Card 4: Member Sleep Club Box */}
        <div className="bg-white p-4.5 rounded-xl shadow-xs border border-gray-200 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-base font-bold text-[#191142] mb-2 leading-snug">
              {user ? `${t("hello")}, ${user.name}` : t("joinClubTitle")}
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              {user
                ? (language === "ta" ? "உங்கள் நேரடி சோதனை, உத்தரவாதம் மற்றும் ஆர்டர்களை கண்காணிக்கவும்." : "Manage your active trial period, warranty registrations, and track shipments.")
                : t("joinClubDesc")}
            </p>
            {!user ? (
              <Link
                to="/login"
                className="block w-full py-2.5 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] font-bold text-center text-xs shadow-sm text-white transition-colors"
              >
                {t("signInClubBtn")}
              </Link>
            ) : (
              <Link
                to="/orders"
                className="block w-full py-2.5 rounded-lg bg-[#191142] hover:bg-[#251b5c] font-bold text-center text-xs shadow-sm text-white transition-colors"
              >
                {t("yourOrders")}
              </Link>
            )}
          </div>
          <div className="pt-3 border-t border-gray-100 space-y-1">
            <span className="text-[11px] font-semibold text-gray-600 block flex items-center gap-1">
              ✓ {t("benefitTrial")}
            </span>
            <span className="text-[11px] font-semibold text-gray-600 block flex items-center gap-1">
              ✓ {t("benefitWarranty")}
            </span>
            <span className="text-[11px] font-semibold text-gray-600 block flex items-center gap-1">
              ✓ {t("benefitDelivery")}
            </span>
          </div>
        </div>
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
            <h2 className="text-base sm:text-xl font-bold text-[#191142] flex items-center gap-2">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#0ea9df]" />
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
          <div className="text-center py-16 space-y-2">
            <h3 className="text-base font-bold text-[#191142]">{t("noProductsFound")}</h3>
            <p className="text-xs text-gray-500">
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
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center space-y-2 p-2">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
            <Truck className="w-6 h-6 text-[#0ea9df]" />
          </div>
          <h4 className="font-bold text-sm text-[#191142]">
            {language === "ta" ? "இலவச டெலிவரி & அன்பாக்சிங்" : "Free Delivery & Unboxing"}
          </h4>
          <p className="text-xs text-gray-500 max-w-xs">
            {language === "ta" ? "உங்கள் வீட்டு வாசலுக்கே பாதுகாப்பான மற்றும் எளிதில் கையாளக்கூடிய பேக்கேஜிங்குடன் டெலிவரி செய்யப்படுகிறது." : "Directly delivered to your doorstep in vacuum-sealed, easy-to-carry packaging."}
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 p-2">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-[#0ea9df]" />
          </div>
          <h4 className="font-bold text-sm text-[#191142]">
            {language === "ta" ? "100-இரவு ஆபத்தில்லாத வீட்டு சோதனை" : "100-Night Risk-Free Trial"}
          </h4>
          <p className="text-xs text-gray-500 max-w-xs">
            {language === "ta" ? "உங்கள் வீட்டில் நிம்மதியாக தூங்கி பாருங்கள். திருப்தி இல்லை என்றால் 100% முழு பணம் திரும்பப் பெறலாம்." : "Sleep on it in the comfort of your home. If you don't love it, we'll give you a 100% refund."}
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2 p-2">
          <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center">
            <Award className="w-6 h-6 text-[#0ea9df]" />
          </div>
          <h4 className="font-bold text-sm text-[#191142]">
            {language === "ta" ? "10-ஆண்டு முழு உத்தரவாதம்" : "10-Year Warranty"}
          </h4>
          <p className="text-xs text-gray-500 max-w-xs">
            {language === "ta" ? "உயர்தர நீடித்த மீள் திறன் கொண்ட ஃபோம் மற்றும் ஐரோப்பிய சான்றளிக்கப்பட்ட பொருட்களால் உருவாக்கப்பட்டது." : "Built with ultra-durable high-resilience foam and genuine European certified materials."}
          </p>
        </div>
      </div>
    </div>
  );
}
