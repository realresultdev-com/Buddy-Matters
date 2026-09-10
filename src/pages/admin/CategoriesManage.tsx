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
    if (!window.confirm(`Delete category "${name}"? Existing products under it may be affected.`)) return;
    try {
      await categoryService.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  if (loading) return <Loader text="Loading categories..." />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Manage Categories</h1>
        <p className="text-xs text-slate-400 mt-1">Organize catalog navigation taxonomy</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Category Form */}
      <form onSubmit={handleAdd} className="flex gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
        <input
          type="text"
          required
          placeholder="New Category Name (e.g. Smart Home)"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </form>

      {/* Categories List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden divide-y divide-slate-800/60">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-4 hover:bg-slate-900/60 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <FolderTree className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{cat.name}</p>
                <p className="text-[10px] font-mono text-slate-500">{cat.id}</p>
              </div>
            </div>

            <button
              onClick={() => handleDelete(cat.id, cat.name)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
