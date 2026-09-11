import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productService } from "../../services/product.service";
import { getProductUrl } from "../../utils/urlSecurity";
import type { Product } from "../../types/product.types";
import Loader from "../../components/common/Loader";
import { Plus, Search, Edit2, Trash2, ShieldAlert, Package, Flame, ExternalLink } from "lucide-react";

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadProducts = async () => {
    try {
      const res = await productService.getAll();
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader text="Loading inventory catalog..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-[#0f1111]">Products</h1>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-lg bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#a88734] text-xs font-semibold text-gray-900 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs bg-white text-gray-900 focus:outline-none focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20"
        />
      </div>

      {/* 1. Mobile Cards View (Hidden on desktop, visible on mobile/tablet) */}
      <div className="block md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
            No products found matching your search.
          </div>
        ) : (
          filtered.map((product) => {
            const img = product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
            return (
              <div
                key={product.id}
                className="p-3.5 bg-white border border-gray-200/90 rounded-2xl shadow-2xs space-y-3"
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={img}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-[#191142] line-clamp-2 leading-snug">
                        {product.name}
                      </h4>
                      {product.is_trending && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-orange-100 text-orange-700 shrink-0">
                          <Flame className="w-2.5 h-2.5 fill-orange-500 text-orange-500" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                        {product.category?.name || "General"}
                      </span>
                      {product.stock > 0 ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {product.stock} in stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md">
                          Out of stock
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="font-black text-sm text-[#191142]">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                      {(product.original_price || product.originalMRP) && (product.original_price || product.originalMRP)! > product.price && (
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{(product.original_price || product.originalMRP)!.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <Link
                    to={getProductUrl(product.id)}
                    target="_blank"
                    className="p-2 rounded-xl text-gray-500 hover:text-[#191142] hover:bg-gray-100 transition-colors"
                    title="View on Storefront"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="py-1.5 px-4 rounded-xl bg-[#0ea9df] hover:bg-[#0c93c4] font-bold text-xs text-white shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 2. Desktop Table View (Hidden on mobile, visible on desktop) */}
      <div className="hidden md:block border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8fafc] border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Product Info</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filtered.map((product) => {
                const img = product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
                return (
                  <tr key={product.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={img}
                        alt=""
                        className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-200 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-gray-900 truncate">{product.name}</p>
                          {product.is_trending && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 shrink-0">
                              <Flame className="w-2.5 h-2.5 text-orange-500 fill-orange-500" /> Trending
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-gray-400">ID: {product.id.slice(0, 14)}</p>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold text-[11px]">
                        {product.category?.name || "General"}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-black text-gray-900 text-sm">
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                      {(product.original_price || product.originalMRP) && (product.original_price || product.originalMRP)! > product.price ? (
                        <div className="text-[11px] text-gray-400">
                          <span className="line-through">₹{(product.original_price || product.originalMRP)!.toLocaleString("en-IN")}</span>{" "}
                          <span className="text-emerald-700 font-bold">
                            ({product.discount_percent || product.discountPercent || Math.round((((product.original_price || product.originalMRP)! - product.price) / (product.original_price || product.originalMRP)!) * 100)}% off)
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td className="p-3.5">
                      {product.stock > 0 ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-xs">{product.stock} in stock</span>
                      ) : (
                        <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-md text-xs">Out of stock</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 text-xs">
                        <Link
                          to={getProductUrl(product.id)}
                          target="_blank"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#191142] hover:bg-gray-100 transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="py-1 px-3 rounded-lg border border-gray-300 hover:bg-gray-50 font-bold text-gray-700 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
