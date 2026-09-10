import ProductCard from "./ProductCard";
import type { Product } from "../../types/product.types";
import { PackageOpen } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4 animate-pulse"
          >
            <div className="aspect-square bg-slate-800 rounded-xl" />
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800 rounded w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-slate-800 rounded w-1/3" />
              <div className="h-9 w-9 bg-slate-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
        <PackageOpen className="w-12 h-12 mx-auto text-slate-600 mb-3" />
        <h3 className="text-base font-semibold text-slate-300">No products found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          We couldn't find any products matching your current category filter or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
