import { Link } from "react-router-dom";
import { Truck, ArrowLeft, ShieldCheck, Clock, PhoneCall, Mail, MapPin, PackageCheck } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className="bg-white min-h-screen text-[#191142] py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Breadcrumb */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#0ea9df] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-2 border-b border-gray-100 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-[#0ea9df]" />
            <span>Pan-India Doorstep Logistics Policy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#191142] tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Last updated: September 2026 | Free Insured Doorstep Delivery Across India
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-xs sm:text-sm text-[#191142] space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <PackageCheck className="w-4 h-4 text-[#0ea9df]" />
            <span>100% Free Shipping on Every Order</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            Buddy Mattress offers complimentary doorstep shipping to 19,000+ pin codes across India. There are no hidden handling fees, surcharges, or delivery fees at checkout.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <span>Delivery Timelines & Dispatch SLA</span>
            </h2>
            <p>
              All orders are processed and dispatched within <strong>24 to 48 hours</strong> directly from our state-of-the-art manufacturing plant in Paramathi Velur, Tamil Nadu. Estimated transit timelines after dispatch:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
                <span className="font-bold text-[#191142] block text-xs">Tamil Nadu & South India</span>
                <span className="text-[#0ea9df] font-bold text-sm block mt-0.5">2 to 4 Business Days</span>
                <span className="text-[11px] text-gray-500">Direct factory logistics network</span>
              </div>
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
                <span className="font-bold text-[#191142] block text-xs">Metro Hubs (Bengaluru, Chennai, Mumbai, Delhi)</span>
                <span className="text-[#0ea9df] font-bold text-sm block mt-0.5">3 to 5 Business Days</span>
                <span className="text-[11px] text-gray-500">Express air / surface express</span>
              </div>
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
                <span className="font-bold text-[#191142] block text-xs">Rest of India Tier 2/3 Cities</span>
                <span className="text-[#0ea9df] font-bold text-sm block mt-0.5">4 to 7 Business Days</span>
                <span className="text-[11px] text-gray-500">Doorstep delivery via verified cargo courier</span>
              </div>
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white">
                <span className="font-bold text-[#191142] block text-xs">Special Regions (J&K, North-East)</span>
                <span className="text-[#0ea9df] font-bold text-sm block mt-0.5">7 to 10 Business Days</span>
                <span className="text-[11px] text-gray-500">Regional logistics partners</span>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <span>Packaging & "Bed-in-a-Box" Technology</span>
            </h2>
            <p>
              Your Buddy Mattress is compressed, vacuum-sealed, and machine roll-packed in heavy-duty food-grade protective poly film, placed safely inside a reinforced box.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
              <li>Keeps the mattress 100% dust-free, sterile, and moisture-protected during transit.</li>
              <li>Fits easily into passenger elevators and narrow staircases.</li>
              <li>Once unboxed, the mattress expands to 90% of its volume within 2 hours, and 100% within 24 to 48 hours.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <span>Shipment Tracking & Order Updates</span>
            </h2>
            <p>
              Once your shipment leaves our facility, you will automatically receive an SMS, WhatsApp notification, and email containing the Courier Tracking Number (AWB) and live tracking link.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">4</span>
              <span>100% Transit Insurance & Damaged Goods Protection</span>
            </h2>
            <p>
              All shipments are 100% insured against loss or damage during transit. If the outer box or seal arrives visibly damaged or tampered with, you can refuse delivery or immediately reach out to our customer care team within 48 hours of receipt. We will dispatch an immediate replacement without any red tape.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">5</span>
              <span>Dispatch & Registered Facility Address</span>
            </h2>
            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-1 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#191142]">
                <MapPin className="w-3.5 h-3.5 text-[#0ea9df]" />
                <span>Buddy Mattress Manufacturing Plant & Central Fulfillment Center</span>
              </div>
              <p className="text-gray-600 pl-5">
                Near RTO Office, Paramathi, Paramathi Velur, Namakkal District, Tamil Nadu - 637207, India.
              </p>
            </div>
          </section>

          {/* Contact Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-[#191142] block">Questions About Your Delivery or Dispatch Status?</span>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a href="tel:+919443300000" className="inline-flex items-center gap-1.5 text-[#191142] hover:text-[#0ea9df] font-bold">
                <PhoneCall className="w-3.5 h-3.5 text-[#0ea9df]" />
                <span>+91 94433 00000</span>
              </a>
              <span className="text-gray-300">•</span>
              <a href="mailto:support@buddymattress.in" className="inline-flex items-center gap-1.5 text-[#191142] hover:text-[#0ea9df] font-semibold">
                <Mail className="w-3.5 h-3.5 text-[#0ea9df]" />
                <span>support@buddymattress.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
