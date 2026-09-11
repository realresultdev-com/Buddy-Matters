import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  ShieldCheck,
  Building2,
  PhoneCall,
  Mail,
  MapPin,
  RotateCcw,
  Clock,
  ExternalLink,
  Award,
  Package,
} from "lucide-react";
import type { Product } from "../../types/product.types";

interface ProductStatutorySectionProps {
  product: Product;
}

export default function ProductStatutorySection({ product }: ProductStatutorySectionProps) {
  const [activeTab, setActiveTab] = useState<"statutory" | "manufacturer" | "care" | "warranty">("statutory");

  // Determine Net Quantity dynamically from specifications or category
  const aboutNetQty = product.about?.find(
    (item) =>
      item.key.toLowerCase().includes("net quantity") ||
      item.key.toLowerCase().includes("quantity")
  )?.value;

  const aboutDimensions = product.about?.find(
    (item) =>
      item.key.toLowerCase().includes("dimension") ||
      item.key.toLowerCase().includes("size")
  )?.value;

  const isPillow =
    product.categoryId === "cat_pillows" ||
    product.name.toLowerCase().includes("pillow");
  const isProtector =
    product.categoryId === "cat_bedding" ||
    product.name.toLowerCase().includes("protector");

  const netQuantity =
    aboutNetQty ||
    (isPillow
      ? "1 N (1 Piece Pillow)"
      : isProtector
      ? "1 N (1 Piece Mattress Protector)"
      : "1 N (1 Piece Mattress)");

  const standardDimensions =
    aboutDimensions ||
    (isPillow
      ? "60 cm x 38 cm x 11.5 cm (24 x 15 x 4.5 inches)"
      : isProtector
      ? "198 cm x 182 cm x 25 cm (78 x 72 inches, fits up to 10-inch mattress)"
      : "198 cm x 182 cm x 15.2 cm (78 x 72 x 6 inches - Standard King)");

  const genericName = isPillow
    ? "Orthopedic Ergonomic Pillow"
    : isProtector
    ? "Waterproof Breathable Mattress Protector"
    : "Orthopedic Ergonomic Sleep Mattress";

  return (
    <section className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs space-y-6">
      {/* Header with Statutory Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Legal Metrology (Packaged Commodities) Rules 2011</span>
            </span>
            <span className="text-gray-400 text-xs hidden sm:inline">•</span>
            <span className="text-[11px] text-gray-500 hidden sm:inline">Rule 6 & Rule 10 Compliance</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-[#191142] tracking-tight">
            Product Information &amp; Manufacturer Details
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Complete product details, manufacturing information, and customer care contact.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            to="/grievance"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0ea9df] hover:underline"
          >
            <span>Customer Support &amp; Grievance</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-gray-100">
        <button
          type="button"
          onClick={() => setActiveTab("statutory")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "statutory"
              ? "bg-[#191142] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Product Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("manufacturer")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "manufacturer"
              ? "bg-[#191142] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Manufacturer &amp; Packer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("care")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "care"
              ? "bg-[#191142] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Customer Care &amp; Support</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("warranty")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === "warranty"
              ? "bg-[#191142] text-white shadow-xs"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>100-Night Trial & Warranty</span>
        </button>
      </div>

      {/* Tab 1: Statutory Declarations Table */}
      {activeTab === "statutory" && (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-xs text-left">
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-gray-700 w-1/3 sm:w-1/4 border-r border-gray-100">
                    Country of Origin
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-base">🇮🇳</span>
                    <span>India (Manufactured in Tamil Nadu)</span>
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-gray-700 border-r border-gray-100">
                    Net Quantity
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {netQuantity}
                  </td>
                </tr>

                <tr className="bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-gray-700 border-r border-gray-100">
                    Standard Dimensions
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {standardDimensions}
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-gray-700 border-r border-gray-100">
                    Product Type
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {genericName}
                  </td>
                </tr>

                <tr className="bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-gray-700 border-r border-gray-100">
                    Month & Year of Manufacture
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    September 2026 (Fresh Factory Dispatch)
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold text-gray-700 border-r border-gray-100">
                    Maximum Retail Price (MRP)
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    ₹{((product.original_price ?? product.originalMRP) || product.price).toLocaleString("en-IN")}{" "}
                    <span className="text-gray-500 font-normal">(Inclusive of all statutory taxes)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="flex items-center gap-1.5 font-semibold text-gray-700">
              <Package className="w-3.5 h-3.5 text-[#0ea9df]" />
              Direct Factory Packaging
            </span>
            <span>•</span>
            <span>Food-Grade Protective Polyethylene Vacuum Seal</span>
            <span>•</span>
            <span>Transit Insured Delivery</span>
          </div>
        </div>
      )}

      {/* Tab 2: Manufacturer & Packer */}
      {activeTab === "manufacturer" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-gray-200 bg-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#191142]">
              <Building2 className="w-4 h-4 text-[#0ea9df]" />
              <span>Manufactured & Packed By</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              <strong>Buddy Mattress Manufacturing Unit</strong>
              <br />
              Near RTO Office, Paramathi, Paramathi Velur,
              <br />
              Namakkal District, Tamil Nadu - 637207, India.
            </p>
            <div className="pt-2 text-[11px] text-gray-500 border-t border-gray-100">
              Facility: State-of-the-art automated foaming, CNC contour cutting, and zero-gravity quilting plant.
            </div>
          </div>

          <div className="p-5 rounded-xl border border-gray-200 bg-white space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#191142]">
              <MapPin className="w-4 h-4 text-[#0ea9df]" />
              <span>Marketed & Distributed By</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              <strong>Buddy Mattress</strong>
              <br />
              Near RTO Office, Paramathi, Paramathi Velur,
              <br />
              Namakkal District, Tamil Nadu - 637207, India.
            </p>
            <div className="pt-2 text-[11px] text-gray-500 border-t border-gray-100">
              Distribution: Direct-to-Consumer (D2C) across all 28 States & 8 Union Territories in India.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Consumer Care & Grievance */}
      {activeTab === "care" && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-gray-200 bg-slate-50 space-y-4">
            <div>
              <h3 className="font-bold text-sm text-[#191142] flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#0ea9df]" />
                <span>Customer Care &amp; Support for this Product</span>
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                For product queries, installation support, warranty registration, or feedback regarding this product:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Customer Helpline</span>
                <a href="tel:+919443300000" className="text-[#0ea9df] font-bold text-sm block hover:underline">
                  +91 94433 00000
                </a>
                <span className="text-[10px] text-gray-500 block flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Mon – Sat: 9:30 AM – 6:30 PM
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Support Email</span>
                <a href="mailto:support@buddymattress.in" className="text-[#0ea9df] font-bold text-sm block hover:underline">
                  support@buddymattress.in
                </a>
                <span className="text-[10px] text-gray-500 block">Typical response: Under 4 hours</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">Postal Address</span>
                <span className="font-medium text-gray-800 block text-[11px] leading-relaxed">
                  Buddy Mattress, Paramathi Velur, Namakkal, TN - 637207
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-[#191142] block">Rule 4(4) Grievance Officer</span>
              <span className="text-gray-600 text-[11px]">
                Grievance Officer: <strong>K. Senthil Kumar</strong> | SLA: 48-Hour Acknowledgment, 30-Day Resolution
              </span>
            </div>
            <Link
              to="/grievance"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191142] text-white font-bold text-xs hover:bg-[#281c62] transition-colors shrink-0"
            >
              <span>View Full Grievance Procedure</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Tab 4: 100-Night Trial & Warranty */}
      {activeTab === "warranty" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-white space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#191142]">
              <RotateCcw className="w-4 h-4 text-[#0ea9df]" />
              <span>100-Night Risk-Free Home Trial</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Sleep on your Buddy Mattress in the comfort of your home for up to 100 nights. If your sleep is not visibly enhanced, we arrange a 100% free doorstep reverse pickup and issue a full refund via Razorpay.
            </p>
            <Link
              to="/refund-policy"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#0ea9df] hover:underline"
            >
              <span>Read complete 100-Night Trial Policy</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[#191142]">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>10-Year Comprehensive Warranty</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              Covers manufacturing defects, core indentation greater than 1 inch, and sag across 10 full years of normal residential usage. Seamless warranty claim process with photographic inspection.
            </p>
            <Link
              to="/terms"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
            >
              <span>View Warranty Terms & Conditions</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
