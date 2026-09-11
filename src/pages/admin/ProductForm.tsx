import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { api } from "../../services/api";
import type { Category } from "../../types/product.types";
import Loader from "../../components/common/Loader";
import R2ImageUploader from "../../components/admin/R2ImageUploader";
import { ArrowLeft, AlertCircle, CheckCircle2, Flame } from "lucide-react";

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 10,
    categoryId: "",
    is_trending: false,
    images: [] as string[],
  });

  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await categoryService.getAll();
        setCategories(catRes.data);

        if (isEditing && id) {
          const prodRes = await productService.getById(id);
          const p = prodRes.data;
          setFormData({
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            categoryId: p.categoryId,
            is_trending: Boolean(p.is_trending),
            images: p.images && p.images.length > 0 ? p.images : [],
          });
        } else if (catRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product form");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: formData.categoryId,
      is_trending: formData.is_trending,
      images:
        formData.images.length > 0
          ? formData.images
          : ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
    };

    try {
      if (isEditing && id) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to save product");
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading product editor..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <Link
          to="/admin/products"
          className="p-2 rounded-lg text-gray-500 hover:text-[#191142] hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#191142]">
            {isEditing ? "Edit Mattress / Sleep Product" : "Add New Sleep Product"}
          </h1>
          <p className="text-xs text-gray-500">
            Upload high-resolution photography directly to Cloudflare R2 bucket and configure store listing
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border border-gray-200 rounded-2xl p-6 bg-white shadow-xs space-y-6">
        {/* Product Identity */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-[#191142] border-b border-gray-100 pb-2">
            1. General Information
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">
              Product Title / Mattress Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Buddy Orthopedic Dual-Comfort Memory Foam Mattress (King / Queen)"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-800">
                  Department / Category *
                </label>
                <Link
                  to="/admin/categories"
                  className="text-[10px] text-[#0ea9df] hover:underline font-bold"
                >
                  + Add Category
                </Link>
              </div>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs bg-white text-gray-900 focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none transition-all cursor-pointer"
                required
              >
                {categories.length === 0 && (
                  <option value="">No categories yet - create one first</option>
                )}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Selling Price (INR ₹) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none transition-all"
              />
            </div>

            {/* Trending / Featured Toggle */}
            <div className="md:col-span-2 bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 flex items-center justify-between transition-all">
              <div className="pr-4">
                <label htmlFor="is_trending" className="text-xs font-bold text-[#191142] flex items-center gap-1.5 cursor-pointer">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  Trending / Featured for Home Slider
                </label>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  When enabled, this product will be featured in the Home Page Trending Carousel Slider while also displaying normally in the catalog.
                </p>
              </div>
              <input
                id="is_trending"
                type="checkbox"
                checked={formData.is_trending}
                onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                className="w-5 h-5 text-[#0ea9df] rounded-md focus:ring-[#0ea9df] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Cloudflare R2 Image Upload Section */}
        <div className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-[#191142] border-b border-gray-100 pb-2">
            2. Product Photography & Media (Cloudflare R2)
          </h2>

          <R2ImageUploader
            images={formData.images}
            onChange={(imgs) => setFormData({ ...formData, images: imgs })}
            maxImages={8}
          />
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2">
          <h2 className="text-sm font-bold text-[#191142] border-b border-gray-100 pb-2">
            3. Detailed Description & Specifications
          </h2>
          <div>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe firmness level, core layers, cooling airflow technology, dimensions, and warranty..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none leading-relaxed transition-all"
            />
          </div>
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <Link
            to="/admin/products"
            className="py-2 px-4 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="py-2.5 px-6 rounded-xl bg-[#0ea9df] hover:bg-[#0c93c4] font-bold text-xs text-white shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              "Saving to Store..."
            ) : isEditing ? (
              "Update Product"
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Publish Product to Catalog
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
