import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { decryptId } from "../../utils/urlSecurity";
import type { Product, Category } from "../../types/product.types";
import ProductCard from "../../components/product/ProductCard";
import { ChevronRight, Sparkles } from "lucide-react";

export default function CategoryPage() {
  const { id: urlParamId } = useParams<{ id: string }>();
  const id = decryptId(urlParamId || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getAll(id),
          categoryService.getAll(),
        ]);
        setProducts(prodRes.data);
        const current = catRes.data.find((c: Category) => c.id === id);
        setCategory(current || null);
      } catch (err) {
        console.error("Failed to load category products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [id]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3.5 sm:p-6 shadow-xs space-y-4 pb-12">
      <nav className="text-xs text-gray-500 flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
        <Link to="/" className="hover:text-[#0ea9df] hover:underline font-medium">
          Buddy Mattress
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
        <span className="text-[#191142] font-bold">{category ? category.name : "Sleep Collection"}</span>
      </nav>

      <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#191142]">
            {category ? category.name : "Sleep Collection"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-200 p-3 rounded-xl space-y-2 animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-lg" />
              <div className="h-3.5 bg-gray-100 w-3/4 rounded" />
              <div className="h-3 bg-gray-100 w-1/2 rounded" />
              <div className="h-8 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-full bg-cyan-50 text-[#0ea9df] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-gray-700 font-semibold text-sm">
            No products currently available in this category.
          </p>
          <Link
            to="/"
            className="inline-block py-2 px-4 rounded-xl bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold transition-colors"
          >
            Explore All Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
