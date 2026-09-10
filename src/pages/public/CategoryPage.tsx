import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import type { Product, Category } from "../../types/product.types";
import ProductCard from "../../components/product/ProductCard";
import { ChevronRight } from "lucide-react";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
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
    <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-4 pb-12">
      <nav className="text-xs text-gray-500 flex items-center gap-1.5">
        <Link to="/" className="hover:text-amazon-linkHover hover:underline font-medium">
          Buddy Mattress
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800 font-semibold">{category ? category.name : "Department"}</span>
      </nav>

      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-[#0f1111]">
          {category ? category.name : "Department Products"}
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          1-{products.length} of {products.length} results for "{category ? category.name : "Electronics"}"
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-200 p-4 space-y-3 animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="h-4 bg-gray-200 w-3/4" />
              <div className="h-8 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-600 text-sm">
          No products currently available in this department.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
