import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { api } from "../../services/api";
import type { Category } from "../../types/product.types";
import Loader from "../../components/common/Loader";
import { ArrowLeft, AlertCircle } from "lucide-react";

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
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
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
            imageUrl: p.images?.[0] || "",
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
      images: [formData.imageUrl],
    };

    try {
      if (isEditing && id) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/admin/products");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product");
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading product form..." />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
        <Link to="/admin/products" className="text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#0f1111]">
            {isEditing ? "Edit Product Details" : "Add a New Product"}
          </h1>
          <p className="text-xs text-gray-500">Provide product identity, pricing, and fulfillment details</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">Item Name / Title</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Buddy Orthopedic Dual-Comfort Memory Foam Mattress"
            className="w-full px-3 py-1.5 border border-gray-400 rounded text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-1 focus:ring-[#0ea9df] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Department / Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-400 rounded text-xs bg-white text-gray-900 focus:border-[#0ea9df] focus:ring-1 focus:ring-[#0ea9df] outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Your Price (INR ₹)</label>
            <input
              type="number"
              required
              min={1}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full px-3 py-1.5 border border-gray-400 rounded text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-1 focus:ring-[#0ea9df] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1">Available Quantity</label>
            <input
              type="number"
              required
              min={0}
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              className="w-full px-3 py-1.5 border border-gray-400 rounded text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-1 focus:ring-[#0ea9df] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">Product Main Image URL</label>
          <input
            type="url"
            required
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-1.5 border border-gray-400 rounded text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-1 focus:ring-[#0ea9df] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-800 mb-1">Product Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe mattress layers, firmness rating, materials, dimensions, and warranty coverage..."
            className="w-full px-3 py-2 border border-gray-400 rounded text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-1 focus:ring-[#0ea9df] outline-none leading-relaxed"
          />
        </div>

        <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <Link
            to="/admin/products"
            className="py-1.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 text-xs font-medium text-gray-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="py-1.5 px-5 rounded-lg bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#a88734] font-semibold text-xs text-gray-900 shadow-sm transition-colors"
          >
            {submitting ? "Saving..." : isEditing ? "Save and finish" : "Publish to Catalog"}
          </button>
        </div>
      </form>
    </div>
  );
}
