import { useState, useEffect } from "react";
import { categoryService } from "../../services/category.service";
import type { Category } from "../../types/product.types";
import Loader from "../../components/common/Loader";
import { Plus, Trash2, FolderTree, AlertCircle } from "lucide-react";

export default function CategoriesManage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await categoryService.create(newCatName.trim());
      setCategories((prev) => [...prev, res.data]);
      setNewCatName("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete department "${name}"?`)) return;
    try {
      await categoryService.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  if (loading) return <Loader text="Loading departments..." />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-[#0f1111]">Departments & Taxonomy</h1>
        <p className="text-xs text-gray-500">Configure catalog browsing hierarchy</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Department Form */}
      <form onSubmit={handleAdd} className="flex gap-2 p-4 rounded-lg border border-gray-300 bg-[#fbfbfb]">
        <input
          type="text"
          required
          placeholder="New Department Name (e.g. Smart Home)"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 px-3 py-1.5 border border-gray-400 rounded text-xs text-gray-900 focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none bg-white"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1 py-1.5 px-4 rounded-lg bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#a88734] text-xs font-semibold text-gray-900 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </form>

      {/* Categories List */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm divide-y divide-gray-200">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-3.5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <FolderTree className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-xs font-bold text-gray-900">{cat.name}</p>
                <p className="text-[10px] font-mono text-gray-400">ID: {cat.id}</p>
              </div>
            </div>

            <button
              onClick={() => handleDelete(cat.id, cat.name)}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              title="Delete department"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
