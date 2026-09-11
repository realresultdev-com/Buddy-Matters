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
  Calculator,
  Sparkles,
  Palette,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  ChevronRight,
  ChevronLeft,
  FileText,
  DollarSign,
  ImagePlus,
  Sliders,
  Check,
  Eye,
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
  {
    id: 1,
    title: "Basic Info",
    subtitle: "Name, category & stock",
    icon: FileText,
  },
  {
    id: 2,
    title: "Pricing & Offers",
    subtitle: "M.R.P., discounts & deals",
    icon: DollarSign,
  },
  {
    id: 3,
    title: "Photography",
    subtitle: "Cloudflare R2 images",
    icon: ImagePlus,
  },
  {
    id: 4,
    title: "Color Variants",
    subtitle: "Swatches & color photos",
    icon: Palette,
  },
  {
    id: 5,
    title: "Specs & Review",
    subtitle: "Key-values & live publish",
    icon: Sliders,
  },
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
            offer_badge_value: p.offer_badge_value || (discPercent > 0 ? `${discPercent}% Off` : ""),
            images: p.images && p.images.length > 0 ? p.images : [],
            color_variants: Array.isArray(p.color_variants) ? p.color_variants : [],
            about: Array.isArray(p.about) ? p.about : [],
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

  // Live Bidirectional Pricing & Discount Calculations
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
      offer_badge_value: prev.offer_badge_value || (disc > 0 ? `${disc}% Off` : ""),
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
      offer_badge_value: prev.offer_badge_value || (disc > 0 ? `${disc}% Off` : ""),
    }));
  };

  const handleDiscountPercentChange = (newDiscount: number) => {
    setFormData((prev) => ({
      ...prev,
      discount_percent: newDiscount,
    }));
  };

  const handleApplyDiscountToPrice = (discountToApply?: number) => {
    const disc = discountToApply !== undefined ? discountToApply : formData.discount_percent;
    const orig = formData.original_price;
    if (orig > 0 && disc >= 0 && disc < 100) {
      const calculatedPrice = Math.round(orig * (1 - disc / 100));
      setFormData((prev) => ({
        ...prev,
        price: calculatedPrice,
        discount_percent: disc,
        offer_badge_value: `${disc}% Off`,
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
      console.error("Failed to upload variant image:", err);
      setError(err.response?.data?.error || "Failed to upload image for color variant");
    } finally {
      setUploadingVariantIndex(null);
    }
  };

  // Step Validation Check
  const validateStep = (step: number): boolean => {
    setStepError(null);
    if (step === 1) {
      if (!formData.name.trim()) {
        setStepError("Please provide a product title / mattress name.");
        return false;
      }
      if (!formData.categoryId) {
        setStepError("Please select a department / category.");
        return false;
      }
      if (!formData.description.trim()) {
        setStepError("Please provide a brief product description.");
        return false;
      }
    } else if (step === 2) {
      if (!formData.price || formData.price <= 0) {
        setStepError("Please enter a valid current selling price greater than ₹0.");
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
    // If moving forward, validate current step
    if (targetStep > currentStep) {
      if (!validateStep(currentStep)) return;
    }
    setStepError(null);
    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isStepComplete = (stepId: number) => {
    if (stepId === 1) {
      return Boolean(formData.name.trim() && formData.categoryId && formData.description.trim());
    }
    if (stepId === 2) {
      return Boolean(formData.price > 0);
    }
    if (stepId === 3) {
      return formData.images.length > 0;
    }
    if (stepId === 4) {
      return formData.color_variants.length > 0;
    }
    if (stepId === 5) {
      return formData.about.length > 0;
    }
    return false;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) {
      return;
    }

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
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to save product");
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading product editor..." />;

  const selectedCategory = categories.find((c) => c.id === formData.categoryId);
  const effectiveMRP =
    formData.original_price > formData.price
      ? formData.original_price
      : 0;
  const buyerSavings = Math.max(0, effectiveMRP - formData.price);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-28">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2.5 rounded-xl text-gray-500 hover:text-[#191142] hover:bg-gray-100 transition-colors border border-gray-200 bg-white shadow-2xs"
            title="Back to Products"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#191142] tracking-tight">
                {isEditing ? "Edit Mattress / Product" : "Add New Sleep Product"}
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#0ea9df]/10 text-[#0ea9df] border border-[#0ea9df]/20">
                Step {currentStep} of 5
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Step-by-step product listing builder &amp; Cloudflare R2 photography manager
            </p>
          </div>
        </div>

        {/* Quick Save / Publish Action (Always accessible so admin doesn't need to click through all steps if just tweaking a price) */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={submitting}
            className="px-4 py-2 rounded-xl bg-[#191142] hover:bg-[#251a5c] text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Save All Changes</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0ea9df]" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Global Error Banner */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {stepError && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span className="font-semibold">{stepError}</span>
        </div>
      )}

      {/* 3. Interactive Progress Stepper Navigation Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-2 sm:p-3 shadow-xs">
        {/* Progress bar line */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#191142] via-[#0ea9df] to-[#25a970] h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = isStepComplete(step.id);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepJump(step.id)}
                className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-1.5 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#191142] text-white shadow-sm ring-2 ring-[#191142]/20"
                    : isCompleted
                    ? "bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 border border-emerald-200/70"
                    : "bg-gray-50/80 hover:bg-gray-100/80 text-gray-600 border border-gray-100"
                }`}
              >
                {/* Step badge / Icon */}
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* Text (hidden on smallest screen, shown on sm+) */}
                <div className="hidden sm:block min-w-0">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-xs font-bold truncate ${
                        isActive ? "text-white" : isCompleted ? "text-emerald-950" : "text-gray-800"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] truncate ${
                      isActive
                        ? "text-gray-200"
                        : isCompleted
                        ? "text-emerald-700"
                        : "text-gray-400"
                    }`}
                  >
                    {step.subtitle}
                  </p>
                </div>

                {/* Mobile minimal title */}
                <span
                  className={`sm:hidden text-[10px] font-bold truncate text-center w-full ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                >
                  {step.title.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Active Step Content Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {/* ========================================================
            STEP 1: BASIC INFORMATION
        ======================================================== */}
        {currentStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0ea9df] text-xs font-bold mb-2">
                <FileText className="w-3.5 h-3.5" />
                <span>Step 1: General Product Details</span>
              </div>
              <h2 className="text-lg font-black text-[#191142]">
                What mattress or sleep product are you listing?
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Provide clear, search-friendly titles and assign the proper category and inventory count.
              </p>
            </div>

            <div className="space-y-4">
              {/* Product Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#191142]">
                    Product Title / Mattress Model Name *
                  </label>
                  <span className="text-[10px] text-gray-400">
                    {formData.name.length} characters
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Buddy Orthopedic Dual-Comfort Memory Foam Mattress (King / Queen)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 font-medium focus:border-[#0ea9df] focus:ring-3 focus:ring-[#0ea9df]/15 outline-none transition-all placeholder:text-gray-400"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Include mattress type, firmness, or size for higher search discoverability.
                </p>
              </div>

              {/* Category & Stock in 2-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#191142]">
                      Department / Category *
                    </label>
                    <Link
                      to="/admin/categories"
                      className="text-[11px] text-[#0ea9df] hover:underline font-bold"
                    >
                      + Manage Categories
                    </Link>
                  </div>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm bg-white text-gray-900 focus:border-[#0ea9df] focus:ring-3 focus:ring-[#0ea9df]/15 outline-none transition-all cursor-pointer font-medium"
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#191142]">
                      Initial Stock Quantity *
                    </label>
                    <span className="text-[11px] text-gray-400">Warehouse units</span>
                  </div>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 font-semibold focus:border-[#0ea9df] focus:ring-3 focus:ring-[#0ea9df]/15 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#191142]">
                    Product Overview &amp; Key Highlights *
                  </label>
                  <span className="text-[10px] text-gray-400">
                    {formData.description.length} chars
                  </span>
                </div>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe firmness level, core layers, cooling airflow technology, dimensions, warranty, and why customers love sleeping on this mattress..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:border-[#0ea9df] focus:ring-3 focus:ring-[#0ea9df]/15 outline-none leading-relaxed transition-all placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: PRICING & DEALS
        ======================================================== */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Step 2: Pricing, MRP &amp; Deals</span>
              </div>
              <h2 className="text-lg font-black text-[#191142]">
                Configure pricing formula and promotional deal tags
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter current selling price and original M.R.P. Our live calculator automatically computes the discount percentage and buyer savings.
              </p>
            </div>

            {/* Pricing Calculator Container */}
            <div className="bg-gradient-to-br from-blue-50/40 via-indigo-50/20 to-white border border-blue-200/80 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-3">
                <h3 className="text-sm font-bold text-[#191142] flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#0ea9df]" />
                  <span>Interactive Price &amp; Discount Calculator</span>
                </h3>
                {formData.discount_percent > 0 && (
                  <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-green-600" />
                    {formData.discount_percent}% Discount Active
                  </span>
                )}
              </div>

              {/* 3 Main Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Current Selling Price */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                  <label className="block text-xs font-bold text-[#191142] mb-1">
                    Current Selling Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.price || ""}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      placeholder="e.g. 12999"
                      className="w-full pl-7 pr-3 py-2 bg-gray-50/50 border border-gray-300 rounded-lg text-sm text-gray-900 font-black focus:border-[#0ea9df] focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Final amount customer pays at checkout</p>
                </div>

                {/* 2. Old Price (Original M.R.P.) */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Original Price / M.R.P. (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min={1}
                      value={formData.original_price || ""}
                      onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                      placeholder="e.g. 18999"
                      className="w-full pl-7 pr-3 py-2 bg-gray-50/50 border border-gray-300 rounded-lg text-sm text-gray-800 font-semibold focus:border-[#0ea9df] focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Strikethrough list price</p>
                </div>

                {/* 3. Discount % */}
                <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Offer / Discount %
                    </label>
                    <span className="text-[10px] text-[#0ea9df] font-bold">(Editable)</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={formData.discount_percent || ""}
                      onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                      placeholder="e.g. 35"
                      className="w-full pl-3 pr-7 py-2 bg-gray-50/50 border border-gray-300 rounded-lg text-sm text-gray-900 font-black focus:border-[#0ea9df] focus:bg-white outline-none transition-all"
                    />
                    <span className="absolute right-3 top-2 text-gray-400 font-bold text-sm">%</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Live calculated from M.R.P.</p>
                </div>
              </div>

              {/* Quick Preset Buttons & Recalculate */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-blue-100 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-gray-500 mr-1">Quick Presets:</span>
                  {[10, 20, 25, 30, 40, 50, 60, 70].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleApplyDiscountToPrice(pct)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formData.discount_percent === pct
                          ? "bg-[#191142] text-white shadow-xs"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      }`}
                    >
                      {pct}% Off
                    </button>
                  ))}
                </div>

                {formData.original_price > 0 && formData.discount_percent > 0 && (
                  <button
                    type="button"
                    onClick={() => handleApplyDiscountToPrice()}
                    className="px-3 py-1.5 rounded-xl bg-white border border-blue-300 hover:bg-blue-50 text-[#191142] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#0ea9df]" />
                    <span>Recalculate Price from {formData.discount_percent}%</span>
                  </button>
                )}
              </div>

              {/* Live Preview Bar */}
              <div className="bg-white p-4 rounded-xl border border-blue-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Customer Storefront Preview
                  </span>
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <div className="flex items-start text-[#191142]">
                      <span className="text-xs font-bold mr-0.5 leading-none">₹</span>
                      <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                        {(formData.price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {effectiveMRP > formData.price && (
                      <div className="text-xs text-gray-500 font-normal">
                        M.R.P.:{" "}
                        <span className="line-through">
                          ₹{effectiveMRP.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}

                    {formData.discount_percent > 0 && (
                      <span className="text-xs sm:text-sm font-bold text-[#CC0C39]">
                        ({formData.discount_percent}% off)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium mt-1">Inclusive of all taxes</p>
                </div>

                {/* Key-Value Breakdown Box */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200 min-w-[260px]">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Key: Current Price</span>
                    <span className="font-black text-[#191142] text-sm">
                      ₹{(formData.price || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Key: Old Price (M.R.P.)</span>
                    <span className="font-semibold text-gray-700 text-sm">
                      ₹{effectiveMRP.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Key: Offer %</span>
                    <span className="font-bold text-green-700">
                      {formData.discount_percent || 0}% OFF
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Key: Buyer Savings</span>
                    <span className="font-bold text-amber-700">
                      ₹{buyerSavings.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending & Promotional Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Featured / Trending Switch */}
              <div className="bg-amber-50/50 border border-amber-200/90 rounded-2xl p-4 flex items-start justify-between gap-3">
                <div>
                  <label htmlFor="is_trending" className="text-xs font-bold text-[#191142] flex items-center gap-1.5 cursor-pointer">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    Feature in Home Page Trending Slider
                  </label>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Puts this mattress directly on the top animated hero slider banner of the storefront.
                  </p>
                </div>
                <input
                  id="is_trending"
                  type="checkbox"
                  checked={formData.is_trending}
                  onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                  className="w-5 h-5 text-[#0ea9df] rounded focus:ring-[#0ea9df] cursor-pointer mt-0.5"
                />
              </div>

              {/* Promotional Offer Badge */}
              <div className="bg-yellow-50/60 border border-yellow-200/90 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-600" />
                    Custom Deal Sticker Badge
                  </h4>
                  {(formData.offer_badge_prefix || formData.offer_badge_value) && (
                    <OfferBadge
                      prefix={formData.offer_badge_prefix || "Starting"}
                      value={formData.offer_badge_value || "₹99"}
                      size="sm"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">
                      Prefix (e.g. Save, Flat)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Starting"
                      value={formData.offer_badge_prefix}
                      onChange={(e) => setFormData({ ...formData, offer_badge_prefix: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:border-[#0ea9df] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1">
                      Value (e.g. 40% Off)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 40% Off"
                      value={formData.offer_badge_value}
                      onChange={(e) => setFormData({ ...formData, offer_badge_value: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:border-[#0ea9df] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: PRODUCT PHOTOGRAPHY (CLOUDFLARE R2)
        ======================================================== */}
        {currentStep === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
                <ImagePlus className="w-3.5 h-3.5" />
                <span>Step 3: High-Resolution Photography</span>
              </div>
              <h2 className="text-lg font-black text-[#191142]">
                Upload product photos to Cloudflare R2 storage
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Upload up to 8 studio images. The first image will be used as the primary hero image across catalogs, search results, and cards.
              </p>
            </div>

            {/* R2 Image Uploader component */}
            <R2ImageUploader
              images={formData.images}
              onChange={(imgs) => setFormData({ ...formData, images: imgs })}
              maxImages={8}
            />

            {/* Helper Tips */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 text-xs text-gray-600 space-y-1.5">
              <span className="font-bold text-gray-800 block">Pro Tips for Photography:</span>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-gray-500">
                <li>Use clean, well-lit bedroom angles with neutral or warm lighting.</li>
                <li>Show multi-layer cross-sections (memory foam, pocket springs, breathable fabric).</li>
                <li>Square or 4:3 aspect ratio delivers optimal presentation across desktop and mobile screens.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: COLOR VARIANTS & SWATCHES
        ======================================================== */}
        {currentStep === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold mb-2">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Step 4: Color-Based Variants</span>
                </div>
                <h2 className="text-lg font-black text-[#191142]">
                  Configure color swatches &amp; color-specific photos
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Allows customers to tap interactive color circles and view the exact mattress or protector color.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleAddColorVariant()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold transition-all shadow-xs self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Color Variant</span>
              </button>
            </div>

            {/* Quick Color Presets */}
            <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80 space-y-2.5">
              <span className="text-xs font-bold text-gray-700 block">
                Quick-Add Popular Mattress Colors:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PRESETS.map((preset) => {
                  const isAlreadyAdded = formData.color_variants.some(
                    (c) => c.color.toLowerCase() === preset.color.toLowerCase()
                  );
                  return (
                    <button
                      key={preset.color}
                      type="button"
                      onClick={() => handleAddColorVariant(preset)}
                      disabled={isAlreadyAdded}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isAlreadyAdded
                          ? "bg-gray-200/60 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-300 hover:border-[#0ea9df] hover:bg-blue-50/40 hover:shadow-2xs"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span>{preset.name}</span>
                      {isAlreadyAdded && <span className="text-[10px] text-gray-400">(Added)</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Storefront Swatch Preview */}
            {formData.color_variants.length > 0 && (
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200/80 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
                    Storefront Swatches Live Preview
                  </span>
                  <span className="text-xs text-blue-700">
                    {formData.color_variants.length} color{formData.color_variants.length > 1 ? "s" : ""} active:
                  </span>
                </div>
                <ColorSwatches
                  variants={formData.color_variants}
                  size="md"
                  showLabel={true}
                />
              </div>
            )}

            {/* Variants List */}
            {formData.color_variants.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-2 bg-gray-50/50">
                <Palette className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs font-bold text-gray-600">No color variants added yet</p>
                <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                  Pick from the quick presets above or click &quot;Add Color Variant&quot; to offer color choices like Midnight Navy, Olive Green, or Pure White.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {formData.color_variants.map((variant, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-gray-200 rounded-xl shadow-2xs space-y-3 relative group transition-all hover:border-[#0ea9df]/60"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#191142] text-white text-[11px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#191142]">
                          {variant.name || `Color #${idx + 1}`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveColorVariant(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove color variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                      {/* Swatch & Hex Picker */}
                      <div className="md:col-span-3 space-y-1.5">
                        <label className="block text-[11px] font-bold text-gray-700">
                          Color Swatch &amp; Hex *
                        </label>
                        <div className="flex items-center gap-2">
                          <label
                            className="relative w-9 h-9 rounded-full border-2 border-gray-300 shadow-2xs cursor-pointer shrink-0 overflow-hidden hover:scale-105 transition-transform flex items-center justify-center"
                            style={{ backgroundColor: variant.color || "#1e2238" }}
                            title="Click to pick color"
                          >
                            <input
                              type="color"
                              value={variant.color.startsWith("#") ? variant.color : "#1e2238"}
                              onChange={(e) => handleColorVariantChange(idx, "color", e.target.value)}
                              className="opacity-0 w-full h-full cursor-pointer absolute inset-0"
                            />
                          </label>
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) => handleColorVariantChange(idx, "color", e.target.value)}
                            placeholder="#1e2238"
                            className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-mono font-bold text-gray-800 focus:border-[#0ea9df] outline-none"
                          />
                        </div>
                      </div>

                      {/* Color Name */}
                      <div className="md:col-span-4 space-y-1.5">
                        <label className="block text-[11px] font-bold text-gray-700">
                          Color Display Name *
                        </label>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => handleColorVariantChange(idx, "name", e.target.value)}
                          placeholder="e.g. Midnight Navy"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-900 focus:border-[#0ea9df] outline-none"
                        />
                      </div>

                      {/* Color-Specific Photo */}
                      <div className="md:col-span-5 space-y-1.5">
                        <label className="block text-[11px] font-bold text-gray-700">
                          Color-Specific Image (Cloudflare R2)
                        </label>

                        <div className="flex items-center gap-2">
                          {variant.image ? (
                            <div className="relative w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-gray-50 group/img">
                              <img
                                src={variant.image}
                                alt={variant.name}
                                className="w-full h-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => handleColorVariantChange(idx, "image", "")}
                                className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                                title="Clear image"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg border border-dashed border-gray-300 flex items-center justify-center shrink-0 bg-gray-50 text-gray-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}

                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-[11px] font-bold cursor-pointer transition-colors shadow-2xs">
                                {uploadingVariantIndex === idx ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <UploadCloud className="w-3 h-3" />
                                )}
                                <span>{uploadingVariantIndex === idx ? "Uploading..." : "Upload Photo"}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingVariantIndex !== null}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleColorImageFileUpload(idx, file);
                                  }}
                                />
                              </label>

                              {formData.images.length > 0 && (
                                <select
                                  value={variant.image || ""}
                                  onChange={(e) => handleColorVariantChange(idx, "image", e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded-lg text-[11px] bg-white text-gray-700 outline-none max-w-[130px]"
                                >
                                  <option value="">Choose photo...</option>
                                  {formData.images.map((img, imgIdx) => (
                                    <option key={imgIdx} value={img}>
                                      Photo #{imgIdx + 1}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>

                            <input
                              type="url"
                              value={variant.image || ""}
                              onChange={(e) => handleColorVariantChange(idx, "image", e.target.value)}
                              placeholder="Or paste image URL"
                              className="w-full px-2.5 py-1 border border-gray-200 rounded-lg text-[10px] text-gray-600 focus:border-[#0ea9df] outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            STEP 5: SPECIFICATIONS & EXECUTIVE STOREFRONT REVIEW
        ======================================================== */}
        {currentStep === 5 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold mb-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>Step 5: Specifications &amp; Live Review</span>
              </div>
              <h2 className="text-lg font-black text-[#191142]">
                Key-Value Specifications &amp; Storefront Readiness
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Review your configured product details and publish directly to the live catalog.
              </p>
            </div>

            {/* Key-Value Specifications */}
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-[#191142]">
                    About This Item / Key &amp; Value Specifications
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Displayed in the Amazon-style structured specification table on the product detail page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddAboutRow()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0ea9df]/10 hover:bg-[#0ea9df]/20 text-[#0ea9df] text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Spec Row</span>
                </button>
              </div>

              {/* Quick-add suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                <span className="text-[11px] font-semibold text-gray-400">Quick add:</span>
                {["Firmness", "Dimensions", "Material", "Warranty", "Cover Fabric", "Care Instructions"].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleAddAboutRow(sug)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>

              {formData.about.length === 0 ? (
                <div className="p-4 border border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-400 bg-gray-50/50">
                  No specifications added yet. Click &quot;Add Spec Row&quot; or tap one of the quick suggestions above.
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.about.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50/80 border border-gray-200/80 rounded-xl">
                      <div className="w-2/5 sm:w-1/3">
                        <input
                          type="text"
                          placeholder="Key (e.g. Firmness)"
                          value={row.key}
                          onChange={(e) => handleAboutChange(idx, "key", e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:border-[#0ea9df] outline-none font-bold"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Value (e.g. Medium Soft / 78 x 72 x 8 in)"
                          value={row.value}
                          onChange={(e) => handleAboutChange(idx, "value", e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:border-[#0ea9df] outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAboutRow(idx)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remove row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Executive Live Product Preview Card */}
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#191142] flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#0ea9df]" />
                  <span>Executive Storefront Preview</span>
                </h3>
                <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready to Publish
                </span>
              </div>

              <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left: Product Thumbnail */}
                <div className="md:col-span-4 aspect-4/3 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xs relative flex items-center justify-center">
                  {formData.images.length > 0 ? (
                    <img
                      src={formData.images[0]}
                      alt={formData.name || "Product Preview"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      <ImageIcon className="w-10 h-10 mx-auto mb-1 text-gray-300" />
                      <span className="text-[11px]">No image uploaded</span>
                    </div>
                  )}

                  {formData.is_trending && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                      <Flame className="w-3 h-3 fill-white" /> Trending
                    </span>
                  )}
                </div>

                {/* Right: Product Snapshot Details */}
                <div className="md:col-span-8 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#0ea9df] uppercase tracking-wider">
                      {selectedCategory?.name || "General Collection"}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-[#191142] leading-snug">
                      {formData.name || "Untitled Mattress Product"}
                    </h4>
                  </div>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-2xl font-black text-[#191142]">
                      ₹{(formData.price || 0).toLocaleString("en-IN")}
                    </span>
                    {effectiveMRP > formData.price && (
                      <span className="text-xs text-gray-500 line-through">
                        M.R.P.: ₹{effectiveMRP.toLocaleString("en-IN")}
                      </span>
                    )}
                    {formData.discount_percent > 0 && (
                      <span className="text-xs font-bold text-[#CC0C39]">
                        ({formData.discount_percent}% off)
                      </span>
                    )}
                  </div>

                  {/* Colors Preview */}
                  {formData.color_variants.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-gray-500">Colors:</span>
                      <ColorSwatches variants={formData.color_variants} size="sm" />
                    </div>
                  )}

                  {/* Stock & Specs Summary */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-gray-200 font-semibold text-gray-700">
                      Stock: <strong>{formData.stock} units</strong>
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-gray-200 font-semibold text-gray-700">
                      Images: <strong>{formData.images.length} photos</strong>
                    </span>
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-gray-200 font-semibold text-gray-700">
                      Specs: <strong>{formData.about.length} items</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Sticky Bottom Wizard Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-3 px-4 sm:px-8 z-30 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1 || submitting}
            className={`px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold flex items-center gap-1.5 transition-all ${
              currentStep === 1
                ? "opacity-40 cursor-not-allowed bg-gray-50 text-gray-400"
                : "bg-white hover:bg-gray-100 text-gray-700 cursor-pointer shadow-2xs"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Current Step Pill Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-500">
            <span>Step {currentStep} of 5:</span>
            <span className="text-[#191142]">{STEPS[currentStep - 1].title}</span>
          </div>

          {/* Forward / Submit Actions */}
          <div className="flex items-center gap-2">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue: {STEPS[currentStep].title}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#191142] hover:bg-[#251a5c] text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Store...</span>
                  </>
                ) : isEditing ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Update &amp; Save Mattress</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#0ea9df]" />
                    <span>Publish Mattress to Storefront</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
