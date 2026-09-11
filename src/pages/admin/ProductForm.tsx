import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productService } from "../../services/product.service";
import { categoryService } from "../../services/category.service";
import { api } from "../../services/api";
import type { Category } from "../../types/product.types";
import Loader from "../../components/common/Loader";
import R2ImageUploader from "../../components/admin/R2ImageUploader";
import OfferBadge from "../../components/common/OfferBadge";
import { ArrowLeft, AlertCircle, CheckCircle2, Flame, Plus, Trash2, Tag, Percent, Calculator, Sparkles } from "lucide-react";

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
    original_price: 0,
    discount_percent: 0,
    stock: 10,
    categoryId: "",
    is_trending: false,
    offer_badge_prefix: "",
    offer_badge_value: "",
    images: [] as string[],
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
          const origPrice = p.original_price ?? p.originalMRP ?? Math.round(p.price * 1.35);
          const discPercent = p.discount_percent ?? p.discountPercent ?? (origPrice > p.price ? Math.round(((origPrice - p.price) / origPrice) * 100) : 0);

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
    let orig = formData.original_price;
    if (orig <= 0 && formData.price > 0) {
      orig = Math.round(formData.price * 1.35);
    }
    if (orig > 0 && disc >= 0 && disc < 100) {
      const calculatedPrice = Math.round(orig * (1 - disc / 100));
      setFormData((prev) => ({
        ...prev,
        original_price: orig,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name: formData.name,
      description: formData.description,
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

            {/* Pricing, Old Price (M.R.P.) & Live Offer Percentage (Key & Value) Section */}
            <div className="md:col-span-2 bg-blue-50/50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#191142] flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#0ea9df]" />
                    Product Pricing & Live Offer Calculator (Key & Value)
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Live calculates discount percentage and customer savings based on Current Price and Old Price (M.R.P.). You can also change the percentage directly.
                  </p>
                </div>
                {formData.discount_percent > 0 && (
                  <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-green-600" />
                    {formData.discount_percent}% Discount Active
                  </span>
                )}
              </div>

              {/* 3-Column Inputs: Current Price, Old Price, Offer Percentage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* 1. Current Selling Price */}
                <div>
                  <label className="block text-xs font-bold text-[#191142] mb-1">
                    Current Price (Selling ₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.price || ""}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      placeholder="e.g. 12999"
                      className="w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 font-bold focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Final amount customer pays</p>
                </div>

                {/* 2. Old Price (M.R.P.) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Old Price (Original M.R.P. ₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      min={1}
                      value={formData.original_price || ""}
                      onChange={(e) => handleOriginalPriceChange(Number(e.target.value))}
                      placeholder="e.g. 18999"
                      className="w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 font-medium focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Strikethrough list price</p>
                </div>

                {/* 3. Offer / Discount % */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Offer / Discount %</span>
                    {formData.original_price > 0 && formData.price > 0 && (
                      <span className="text-[10px] font-semibold text-gray-400">(Editable)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={formData.discount_percent || ""}
                      onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                      placeholder="e.g. 63"
                      className="w-full pl-3 pr-7 py-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 font-bold focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none transition-all"
                    />
                    <span className="absolute right-3 top-2 text-gray-400 font-bold text-xs">%</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">Live calculated or manual</p>
                </div>
              </div>

              {/* Quick Preset Discount Buttons & Recalculate Tool */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-blue-100/80 text-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-gray-500 mr-1">Quick Discount:</span>
                  {[10, 20, 30, 40, 50, 60, 70].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleApplyDiscountToPrice(pct)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                        formData.discount_percent === pct
                          ? "bg-[#191142] text-white shadow-2xs"
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
                    className="px-2.5 py-1 rounded-lg bg-white border border-blue-300 hover:bg-blue-100/70 text-[#191142] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    title="Recalculate Current Price using the Discount Percentage"
                  >
                    <Calculator className="w-3 h-3 text-[#0ea9df]" />
                    <span>Recalculate Price from {formData.discount_percent}%</span>
                  </button>
                )}
              </div>

              {/* Live Storefront Preview (Amazon Style matching requested screenshot) */}
              <div className="bg-white p-3.5 rounded-xl border border-blue-200/90 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Live Visual Display */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Storefront Live Display Preview
                    </span>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {/* Current Selling Price */}
                      <div className="flex items-start text-[#191142]">
                        <span className="text-xs font-bold mr-0.5 leading-none">₹</span>
                        <span className="text-2xl font-black tracking-tight leading-none">
                          {(formData.price || 0).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Old Price (M.R.P.) Strikethrough */}
                      {formData.original_price > formData.price && (
                        <div className="text-xs text-gray-500 font-normal">
                          M.R.P.:{" "}
                          <span className="line-through">
                            ₹{formData.original_price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      )}

                      {/* Offer Percentage */}
                      {formData.discount_percent > 0 && (
                        <span className="text-xs sm:text-sm font-semibold text-[#388e3c]">
                          ({formData.discount_percent}% off)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 font-medium mt-1">Inclusive of all taxes</p>
                  </div>

                  {/* Right: Key & Value Table for Admin */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs bg-gray-50/90 p-3 rounded-lg border border-gray-200 min-w-[240px]">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Key: Current Price</span>
                      <span className="font-bold text-[#191142] text-sm">
                        ₹{(formData.price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Key: Old Price (M.R.P.)</span>
                      <span className="font-semibold text-gray-700 text-sm">
                        ₹{(formData.original_price || Math.round((formData.price || 0) * 1.35)).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Key: Offer Percentage</span>
                      <span className="font-bold text-green-700">
                        {formData.discount_percent || 0}% OFF
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase">Key: Buyer Savings</span>
                      <span className="font-bold text-amber-700">
                        ₹{Math.max(0, (formData.original_price || Math.round((formData.price || 0) * 1.35)) - (formData.price || 0)).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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

            {/* Offer Sticker Badge Section (Key & Value) */}
            <div className="md:col-span-2 bg-yellow-50/70 border border-yellow-200/90 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-amber-600" />
                    Promotional Offer Sticker Badge (Key & Value)
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Optional scalloped deal sticker displayed on the product (e.g., "Starting ₹99", "Flat 40% Off", "Save ₹500").
                  </p>
                </div>
                {(formData.offer_badge_prefix || formData.offer_badge_value) && (
                  <OfferBadge
                    prefix={formData.offer_badge_prefix || "Starting"}
                    value={formData.offer_badge_value || "₹99"}
                    size="sm"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Badge Key / Prefix
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Starting, Flat, Save, Up to"
                    value={formData.offer_badge_prefix}
                    onChange={(e) => setFormData({ ...formData, offer_badge_prefix: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Badge Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹99, 40% Off, ₹500"
                    value={formData.offer_badge_value}
                    onChange={(e) => setFormData({ ...formData, offer_badge_value: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-900 focus:border-[#0ea9df] focus:ring-2 focus:ring-[#0ea9df]/20 outline-none bg-white"
                  />
                </div>
              </div>
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

        {/* 4. About This Item / Specifications (Key & Value) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-[#191142]">
                4. About This Item / Key & Value Specifications
              </h2>
              <p className="text-[11px] text-gray-500">
                Add custom key-value details (e.g. Firmness: Medium Firm, Dimensions: 78x72 in, Material: Memory Foam)
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleAddAboutRow()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0ea9df]/10 hover:bg-[#0ea9df]/20 text-[#0ea9df] text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Key & Value</span>
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
                className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-medium transition-colors cursor-pointer"
              >
                + {sug}
              </button>
            ))}
          </div>

          {formData.about.length === 0 ? (
            <div className="p-5 border border-dashed border-gray-200 rounded-xl text-center text-xs text-gray-400 bg-gray-50/50">
              No specifications added yet. Click &quot;Add Key &amp; Value&quot; or select a quick tag above.
            </div>
          ) : (
            <div className="space-y-2.5">
              {formData.about.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50/70 border border-gray-200/80 rounded-xl">
                  <div className="w-2/5 sm:w-1/3">
                    <input
                      type="text"
                      placeholder="Key (e.g. Firmness)"
                      value={row.key}
                      onChange={(e) => handleAboutChange(idx, "key", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:border-[#0ea9df] focus:ring-1 focus:ring-[#0ea9df] outline-none font-semibold"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Value (e.g. Medium Soft / 78 x 72 x 8 in)"
                      value={row.value}
                      onChange={(e) => handleAboutChange(idx, "value", e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:border-[#0ea9df] focus:ring-1 focus:ring-[#0ea9df] outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAboutRow(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
