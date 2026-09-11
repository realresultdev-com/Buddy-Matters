import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { api } from "../../services/api";
import type { Category, ProductColorVariant } from "../../types/product.types";
import Loader from "../../components/common/Loader";
import R2ImageUploader from "../../components/admin/R2ImageUploader";
import OfferBadge from "../../components/common/OfferBadge";
import ColorSwatches from "../../components/common/ColorSwatches";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Flame,
  Plus,
  Trash2,
  Tag,
  Palette,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
  ShoppingBag,
} from "lucide-react";

const COLOR_PRESETS = [
  { name: "Midnight Navy", color: "#1e2238" },
  { name: "Olive Green", color: "#858636" },
  { name: "Blush Pink", color: "#f1d8d9" },
  { name: "Warm Amber", color: "#e49e4d" },
  { name: "Crimson Red", color: "#b73644" },
  { name: "Charcoal Gray", color: "#2b2d42" },
  { name: "Pure White", color: "#ffffff" },
  { name: "Sky Blue", color: "#0ea9df" },
  { name: "Forest Green", color: "#2e7d32" },
];

const STEPS = [
  { id: 1, title: "1. Details" },
  { id: 2, title: "2. Pricing" },
  { id: 3, title: "3. Photos" },
  { id: 4, title: "4. Colors" },
  { id: 5, title: "5. Specs" },
];

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    original_price: 0,
    discount_percent: 0,
    stock: 10,
    categoryId: "",
    is_trending: false,
    offer_badge_prefix: "",
    offer_badge_value: "",
    images: [] as string[],
    color_variants: [] as ProductColorVariant[],
    about: [] as { key: string; value: string }[],
  });

  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await categoryService.getAll();
        setCategories(catRes.data);

        if (isEditing && id) {
          const prodRes = await productService.getById(id);
          const p = prodRes.data;
          const origPrice =
            p.original_price && p.original_price > p.price
              ? p.original_price
              : p.originalMRP && p.originalMRP > p.price
              ? p.originalMRP
              : 0;
          const discPercent =
            p.discount_percent ??
            p.discountPercent ??
            (origPrice > p.price ? Math.round(((origPrice - p.price) / origPrice) * 100) : 0);

          setFormData({
            name: p.name,
            description: p.description,
            price: p.price,
            original_price: origPrice,
            discount_percent: discPercent,
            stock: p.stock,
            categoryId: p.categoryId,
            is_trending: Boolean(p.is_trending),
            offer_badge_prefix: p.offer_badge_prefix || "",
            offer_badge_value: p.offer_badge_value || "",
            images: p.images && p.images.length > 0 ? p.images : [],
            color_variants: Array.isArray(p.color_variants) ? p.color_variants : [],
            about: Array.isArray(p.about) ? p.about : [],
          });
        } else if (catRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: catRes.data[0].id }));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEditing]);

  const handlePriceChange = (newPrice: number) => {
    const orig = formData.original_price;
    let disc = formData.discount_percent;
    if (orig > 0 && orig > newPrice) {
      disc = Math.round(((orig - newPrice) / orig) * 100);
    }
    setFormData((prev) => ({
      ...prev,
      price: newPrice,
      discount_percent: disc,
    }));
  };

  const handleOriginalPriceChange = (newMRP: number) => {
    const price = formData.price;
    let disc = formData.discount_percent;
    if (newMRP > 0 && price > 0 && newMRP > price) {
      disc = Math.round(((newMRP - price) / newMRP) * 100);
    }
    setFormData((prev) => ({
      ...prev,
      original_price: newMRP,
      discount_percent: disc,
    }));
  };

  const handleDiscountPercentChange = (newDiscount: number) => {
    setFormData((prev) => ({
      ...prev,
      discount_percent: newDiscount,
    }));
  };

  const handleApplyDiscountToPrice = (discountToApply: number) => {
    const orig = formData.original_price;
    if (orig > 0 && discountToApply >= 0 && discountToApply < 100) {
      const calculatedPrice = Math.round(orig * (1 - discountToApply / 100));
      setFormData((prev) => ({
        ...prev,
        price: calculatedPrice,
        discount_percent: discountToApply,
      }));
    }
  };

  const handleAddAboutRow = (suggestedKey?: string) => {
    setFormData((prev) => ({
      ...prev,
      about: [...prev.about, { key: suggestedKey || "", value: "" }],
    }));
  };

  const handleAboutChange = (index: number, field: "key" | "value", val: string) => {
    setFormData((prev) => {
      const updated = [...prev.about];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, about: updated };
    });
  };

  const handleRemoveAboutRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      about: prev.about.filter((_, i) => i !== index),
    }));
  };

  const handleAddColorVariant = (preset?: { name: string; color: string }) => {
    setFormData((prev) => ({
      ...prev,
      color_variants: [
        ...prev.color_variants,
        {
          name: preset?.name || "New Color",
          color: preset?.color || "#1e2238",
          image: prev.images.length > 0 ? prev.images[0] : "",
        },
      ],
    }));
  };

  const handleColorVariantChange = (
    index: number,
    field: "name" | "color" | "image",
    val: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.color_variants];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, color_variants: updated };
    });
  };

  const handleRemoveColorVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      color_variants: prev.color_variants.filter((_, i) => i !== index),
    }));
  };

  const handleColorImageFileUpload = async (index: number, file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploadingVariantIndex(index);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.url || res.data.urls?.[0];
      if (url) {
        handleColorVariantChange(index, "image", url);
        if (!formData.images.includes(url)) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, url],
          }));
        }
      }
    } catch (err: any) {
      console.error("Failed to upload image:", err);
      setError("Failed to upload image");
    } finally {
      setUploadingVariantIndex(null);
    }
  };

  const validateStep = (step: number): boolean => {
    setStepError(null);
    if (step === 1) {
      if (!formData.name.trim()) {
        setStepError("Product name is required.");
        return false;
      }
      if (!formData.categoryId) {
        setStepError("Category is required.");
        return false;
      }
      if (!formData.description.trim()) {
        setStepError("Description is required.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.price || formData.price <= 0) {
        setStepError("Valid selling price is required.");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setStepError(null);
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepJump = (targetStep: number) => {
    if (targetStep > currentStep) {
      if (!validateStep(currentStep)) return;
    }
    setStepError(null);
    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isStepComplete = (stepId: number) => {
    if (stepId === 1) return Boolean(formData.name.trim() && formData.categoryId && formData.description.trim());
    if (stepId === 2) return Boolean(formData.price > 0);
    if (stepId === 3) return formData.images.length > 0;
    if (stepId === 4) return formData.color_variants.length > 0;
    if (stepId === 5) return formData.about.length > 0;
    return false;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;

    setSubmitting(true);
    setError(null);
    setStepError(null);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      original_price: formData.original_price ? Number(formData.original_price) : null,
      discount_percent: formData.discount_percent ? Number(formData.discount_percent) : null,
      stock: Number(formData.stock),
      categoryId: formData.categoryId,
      is_trending: formData.is_trending,
      offer_badge_prefix: formData.offer_badge_prefix,
      offer_badge_value: formData.offer_badge_value,
      images:
        formData.images.length > 0
          ? formData.images
          : ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
      color_variants: formData.color_variants.filter((c) => c.name.trim() || c.color.trim()),
      about: formData.about.filter((item) => item.key.trim() || item.value.trim()),
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

  if (loading) return <Loader text="Loading..." />;

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);
  const effectiveMRP = formData.original_price > formData.price ? formData.original_price : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-24">
      {/* 1. Clean Header */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl text-gray-500 hover:text-[#191142] hover:bg-gray-100 transition-colors border border-gray-200 bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-[#191142]">
            {isEditing ? "Edit Product" : "Add Product"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={submitting}
            className="px-4 py-1.5 rounded-xl bg-[#191142] hover:bg-[#251a5c] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEditing ? (
              <span>Save Changes</span>
            ) : (
              <span>Publish</span>
            )}
          </button>
        </div>
      </div>

      {/* Errors */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {stepError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{stepError}</span>
        </div>
      )}

      {/* 2. Clean Stepper Bar (No bloated subtitles) */}
      <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-2xs">
        <div className="grid grid-cols-5 gap-1.5">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = isStepComplete(step.id);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepJump(step.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#191142] text-white shadow-xs"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isCompleted && !isActive ? (
                  <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                ) : null}
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Step Content Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs p-5 sm:p-6">
        {/* ==================== STEP 1: DETAILS ==================== */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#191142] border-b border-gray-100 pb-2">
              General Information
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#191142] mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:border-[#0ea9df] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#191142]">
                    Category *
                  </label>
                  <Link
                    to="/admin/categories"
                    className="text-[11px] text-[#0ea9df] hover:underline font-bold"
                  >
                    + Categories
                  </Link>
                </div>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white text-gray-900 focus:border-[#0ea9df] outline-none cursor-pointer"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191142] mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:border-[#0ea9df] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191142] mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-900 focus:border-[#0ea9df] outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* ==================== STEP 2: PRICING ==================== */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#191142] border-b border-gray-100 pb-2">
              Pricing &amp; Offers
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#191142] mb-1">
                  Selling Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price || ""}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    placeholder="e.g. 12999"
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:border-[#0ea9df] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  M.R.P. (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={formData.original_price || ""}
                    onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                    placeholder="Optional"
                    className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-xl text-xs text-gray-800 focus:border-[#0ea9df] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Discount (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={formData.discount_percent || ""}
                    onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                    placeholder="Auto or manual"
                    className="w-full pl-3 pr-6 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:border-[#0ea9df] outline-none"
                  />
                  <span className="absolute right-3 top-2 text-gray-400 font-bold text-xs">%</span>
                </div>
              </div>
            </div>

            {/* Quick Discount Presets */}
            {formData.original_price > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-gray-500 mr-1">Presets:</span>
                {[10, 20, 30, 40, 50, 60].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleApplyDiscountToPrice(pct)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                      formData.discount_percent === pct
                        ? "bg-[#191142] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            )}

            {/* Clean Price Preview */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-baseline gap-2">
              <span className="text-xs font-bold text-gray-500">Preview:</span>
              <span className="text-base font-black text-[#191142]">
                ₹{(formData.price || 0).toLocaleString("en-IN")}
              </span>
              {effectiveMRP > formData.price && (
                <span className="text-xs text-gray-400 line-through">
                  M.R.P.: ₹{effectiveMRP.toLocaleString("en-IN")}
                </span>
              )}
              {effectiveMRP > formData.price && formData.discount_percent > 0 && (
                <span className="text-xs font-bold text-[#CC0C39]">
                  ({formData.discount_percent}% off)
                </span>
              )}
            </div>

            {/* Home Slider & Deal Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 cursor-pointer bg-white">
                <input
                  type="checkbox"
                  checked={formData.is_trending}
                  onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                  className="w-4 h-4 text-[#0ea9df] rounded focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-[#191142] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  Feature on Home Slider
                </span>
              </label>

              <div className="p-3 rounded-xl border border-gray-200 bg-white flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Offer Badge (e.g. Save ₹500)"
                  value={formData.offer_badge_value}
                  onChange={(e) => setFormData({ ...formData, offer_badge_value: e.target.value })}
                  className="w-full text-xs text-gray-800 outline-none placeholder:text-gray-400"
                />
                {formData.offer_badge_value && (
                  <OfferBadge value={formData.offer_badge_value} size="sm" />
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 3: PHOTOS ==================== */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#191142] border-b border-gray-100 pb-2">
              Product Images
            </h2>

            <R2ImageUploader
              images={formData.images}
              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
              maxImages={8}
            />
          </div>
        )}

        {/* ==================== STEP 4: COLORS ==================== */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h2 className="text-sm font-bold text-[#191142]">Color Variants</h2>
              <button
                type="button"
                onClick={() => handleAddColorVariant()}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0ea9df] text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Color</span>
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => handleAddColorVariant(preset)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: preset.color }}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            {/* Swatches preview */}
            {formData.color_variants.length > 0 && (
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">
                  {formData.color_variants.length} color{formData.color_variants.length > 1 ? "s" : ""}:
                </span>
                <ColorSwatches variants={formData.color_variants} size="sm" showLabel={true} />
              </div>
            )}

            {/* List */}
            {formData.color_variants.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No color variants added (optional).</p>
            ) : (
              <div className="space-y-3">
                {formData.color_variants.map((variant, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#191142]">Color #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColorVariant(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center">
                      {/* Swatch & Hex */}
                      <div className="flex items-center gap-2">
                        <label
                          className="w-8 h-8 rounded-full border border-gray-300 cursor-pointer shrink-0 overflow-hidden flex items-center justify-center"
                          style={{ backgroundColor: variant.color || "#1e2238" }}
                        >
                          <input
                            type="color"
                            value={variant.color.startsWith("#") ? variant.color : "#1e2238"}
                            onChange={(e) => handleColorVariantChange(idx, "color", e.target.value)}
                            className="opacity-0 w-full h-full cursor-pointer"
                          />
                        </label>
                        <input
                          type="text"
                          value={variant.color}
                          onChange={(e) => handleColorVariantChange(idx, "color", e.target.value)}
                          placeholder="#1e2238"
                          className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold bg-white"
                        />
                      </div>

                      {/* Name */}
                      <div>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => handleColorVariantChange(idx, "name", e.target.value)}
                          placeholder="Color Name"
                          className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-medium bg-white"
                        />
                      </div>

                      {/* Photo */}
                      <div className="flex items-center gap-2">
                        {variant.image ? (
                          <img src={variant.image} alt="" className="w-8 h-8 rounded object-cover border" />
                        ) : null}
                        <label className="px-2.5 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-[11px] font-bold cursor-pointer transition-colors shrink-0">
                          {uploadingVariantIndex === idx ? "Uploading..." : "Upload Photo"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleColorImageFileUpload(idx, f);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== STEP 5: SPECS ==================== */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h2 className="text-sm font-bold text-[#191142]">Specifications</h2>
              <button
                type="button"
                onClick={() => handleAddAboutRow()}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0ea9df] text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec</span>
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {["Firmness", "Dimensions", "Material", "Warranty"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddAboutRow(tag)}
                  className="px-2 py-0.5 rounded text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer font-medium"
                >
                  + {tag}
                </button>
              ))}
            </div>

            {/* Specs rows */}
            {formData.about.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No specifications added (optional).</p>
            ) : (
              <div className="space-y-2">
                {formData.about.map((row, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Key (e.g. Firmness)"
                      value={row.key}
                      onChange={(e) => handleAboutChange(idx, "key", e.target.value)}
                      className="w-1/3 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={row.value}
                      onChange={(e) => handleAboutChange(idx, "value", e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAboutRow(idx)}
                      className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Preview */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#191142]">{formData.name || "Untitled Product"}</p>
                <p className="text-xs text-gray-500">
                  {selectedCategory?.name} • ₹{(formData.price || 0).toLocaleString("en-IN")} • Stock: {formData.stock}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-[#191142] hover:bg-[#251a5c] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? "Saving..." : isEditing ? "Save Product" : "Publish Product"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2.5 px-4 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1 || submitting}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
              currentStep === 1
                ? "opacity-30 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <span className="text-xs font-bold text-gray-500">
            Step {currentStep} of 5
          </span>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-4 py-1.5 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={submitting}
              className="px-5 py-1.5 rounded-lg bg-[#191142] hover:bg-[#251a5c] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span>{isEditing ? "Save" : "Publish"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
