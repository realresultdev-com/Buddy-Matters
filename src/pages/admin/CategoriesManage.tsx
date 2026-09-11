import { useState, useEffect } from "react";
import { categoryService } from "../../services/category.service";
import type { Category } from "../../types/product.types";
import Loader from "../../components/common/Loader";
import OfferBadge from "../../components/common/OfferBadge";
import { Plus, Trash2, FolderTree, AlertCircle, Edit3, Tag, X, Check } from "lucide-react";

export default function CategoriesManage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatPrefix, setNewCatPrefix] = useState("Starting");
  const [newCatValue, setNewCatValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrefix, setEditPrefix] = useState("");
  const [editValue, setEditValue] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getAll(true);
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
      const res = await categoryService.create({
        name: newCatName.trim(),
        offer_badge_prefix: newCatPrefix.trim() || "Starting",
        offer_badge_value: newCatValue.trim(),
      });
      setCategories((prev) => [...prev, res.data]);
      setNewCatName("");
      setNewCatPrefix("Starting");
      setNewCatValue("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingCat(cat);
    setEditName(cat.name);
    setEditPrefix(cat.offer_badge_prefix ?? "Starting");
    setEditValue(cat.offer_badge_value ?? "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editName.trim()) return;
    setSavingEdit(true);
    try {
      const res = await categoryService.update(editingCat.id, {
        name: editName.trim(),
        offer_badge_prefix: editPrefix.trim() || "Starting",
        offer_badge_value: editValue.trim(),
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCat.id ? { ...c, ...res.data } : c))
      );
      setEditingCat(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update category");
    } finally {
      setSavingEdit(false);
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
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-[#0f1111]">Departments & Offer Badges</h1>
        <p className="text-xs text-gray-500">
          Configure catalog browsing taxonomy and dynamic promotional deal stickers
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Department & Offer Badge Form */}
      <form
        onSubmit={handleAdd}
        className="p-4 rounded-xl border border-gray-300 bg-[#fbfbfb] shadow-xs space-y-3"
      >
        <div className="flex items-center gap-2 pb-1 border-b border-gray-200 text-xs font-bold text-gray-800">
          <Tag className="w-4 h-4 text-amazon-orange" />
          <span>Add New Department & Offer Sticker Badge</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Department Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mattresses"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-400 rounded-lg text-xs text-gray-900 focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Offer Badge Prefix / Key
            </label>
            <input
              type="text"
              placeholder="e.g. Starting, Up to, Flat"
              value={newCatPrefix}
              onChange={(e) => setNewCatPrefix(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-400 rounded-lg text-xs text-gray-900 focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none bg-white"
            />
            <span className="text-[10px] text-gray-500">Default: "Starting"</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">
              Offer Badge Value
            </label>
            <input
              type="text"
              placeholder="e.g. ₹7,999 or ₹99"
              value={newCatValue}
              onChange={(e) => setNewCatValue(e.target.value)}
              className="w-full px-3 py-1.5 border border-gray-400 rounded-lg text-xs text-gray-900 focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none bg-white"
            />
            <span className="text-[10px] text-gray-500">
              Leave blank to auto-calculate lowest product price
            </span>
          </div>
        </div>

        {/* Live Badge Preview in Form */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-gray-600">Sticker Badge Preview:</span>
            <OfferBadge
              prefix={newCatPrefix || "Starting"}
              value={newCatValue || "₹99"}
              size="sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1 py-2 px-5 rounded-lg bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#a88734] text-xs font-bold text-gray-900 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>
      </form>

      {/* Categories List */}
      <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm divide-y divide-gray-200">
        <div className="bg-gray-50 px-4 py-2.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
          <span>Department Details</span>
          <span>Offer Sticker Badge & Actions</span>
        </div>

        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <FolderTree className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-gray-400">ID: {cat.id}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                    Prefix: <strong className="text-gray-900">{cat.offer_badge_prefix || "Starting"}</strong>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                    Value: <strong className="text-gray-900">{cat.offer_badge_value || "Dynamic (Min Price)"}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Badge Preview */}
              <div className="scale-90">
                <OfferBadge
                  prefix={cat.offer_badge_prefix || "Starting"}
                  value={cat.offer_badge_value || "₹99"}
                  size="sm"
                />
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => startEdit(cat)}
                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit Department & Offer Badge"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Department"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Department & Badge Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/70">
              <h3 className="text-sm font-bold text-[#191142] flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                Edit Department & Offer Badge
              </h3>
              <button
                onClick={() => setEditingCat(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Badge Prefix / Key
                  </label>
                  <input
                    type="text"
                    value={editPrefix}
                    placeholder="Starting"
                    onChange={(e) => setEditPrefix(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">e.g. Starting, Flat, Up to</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Badge Value
                  </label>
                  <input
                    type="text"
                    value={editValue}
                    placeholder="e.g. ₹7,999"
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Blank = dynamic lowest price</p>
                </div>
              </div>

              {/* Live Preview Inside Modal */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-900">Live Sticker Preview</p>
                  <p className="text-[10px] text-amber-700">How it appears on Home Category card</p>
                </div>
                <OfferBadge
                  prefix={editPrefix || "Starting"}
                  value={editValue || "₹99"}
                  size="md"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#a88734] rounded-xl text-xs font-bold text-gray-900 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

