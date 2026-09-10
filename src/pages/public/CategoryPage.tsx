import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import type { Product, Category } from "../../types/product.types";
import ProductGrid from "../../components/product/ProductGrid";
import { ArrowLeft } from "lucide-react";

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
    <div className="space-y-6 pb-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to all categories
      </Link>

      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white">
          {category ? category.name : "Category Products"}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Showing {products.length} product{products.length === 1 ? "" : "s"} in this collection
        </p>
      </div>

      <ProductGrid products={products} loading={loading} />
    </div>
  );
}
