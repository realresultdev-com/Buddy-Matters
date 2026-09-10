import { useState, useEffect } from "react";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import type { Product, Category } from "../../types/product.types";
import CategoryFilter from "../../components/product/CategoryFilter";
import ProductGrid from "../../components/product/ProductGrid";
import { Search, Sparkles, ShieldCheck, Zap, Server } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-8 sm:p-14 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Zero-Backend Server • Cloudflare D1 + Pages
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen Tech, Delivered from the{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              Global Edge.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Experience lightning fast latency, real-time edge catalog inventory, and instant Razorpay checkout running 100% on Cloudflare's free edge network.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#catalog"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Shop Collection
            </a>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-xs text-slate-400">
              <Zap className="w-4 h-4 text-amber-400" />
              Sub-50ms Response Times
            </div>
          </div>
        </div>
      </section>

      {/* Edge Architecture Feature Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Cloudflare D1 SQL</h4>
            <p className="text-xs text-slate-400">Serverless relational database at edge</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Razorpay Payments</h4>
            <p className="text-xs text-slate-400">Secure HMAC signature verification</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Pages Functions</h4>
            <p className="text-xs text-slate-400">Serverless V8 isolate micro-APIs</p>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Header */}
      <section id="catalog" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Curated Hardware</h2>
            <p className="text-xs text-slate-400 mt-1">Discover premium audio, wearables, and productivity essentials.</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
        />

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} loading={loading} />
      </section>
    </div>
  );
}
