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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1111]">Manage All Inventory</h1>
          <p className="text-xs text-gray-500 mt-0.5">Track products, pricing, and stock on Cloudflare D1</p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-lg bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#a88734] text-xs font-semibold text-gray-900 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add a Product
        </Link>
      </div>

      {/* Filter toolbar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search SKU or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 rounded border border-gray-400 text-xs bg-white text-gray-900 focus:outline-none focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange"
        />
      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f0f2f2] border-b border-gray-300 text-gray-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3">Product Info</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Quantity</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {filtered.map((product) => {
                const img = product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={img}
                        alt=""
                        className="w-12 h-12 object-contain bg-white border border-gray-200 p-0.5 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                          {product.is_trending && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                              <Flame className="w-2.5 h-2.5 text-orange-500 fill-orange-500" /> Trending
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-gray-500">ID: {product.id.slice(0, 14)}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-700 font-medium">
                        {product.category?.name || "General"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                      {(product.original_price || product.originalMRP) && (product.original_price || product.originalMRP)! > product.price ? (
                        <div className="text-[11px] text-gray-400">
                          <span className="line-through">₹{(product.original_price || product.originalMRP)!.toLocaleString("en-IN")}</span>{" "}
                          <span className="text-green-700 font-semibold">
                            ({product.discount_percent || product.discountPercent || Math.round((((product.original_price || product.originalMRP)! - product.price) / (product.original_price || product.originalMRP)!) * 100)}% off)
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td className="p-3">
                      {product.stock > 0 ? (
                        <span className="text-[#007600] font-semibold">{product.stock} in stock</span>
                      ) : (
                        <span className="text-[#b12704] font-semibold">Out of stock</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <Link
                          to={getProductUrl(product.id)}
                          target="_blank"
                          className="p-1 rounded text-gray-500 hover:text-black hover:bg-gray-100"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="py-1 px-2.5 rounded border border-gray-300 hover:bg-gray-100 font-medium text-gray-800"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
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
