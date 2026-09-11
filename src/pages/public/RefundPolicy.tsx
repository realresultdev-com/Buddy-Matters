import { Link } from "react-router-dom";
import { RotateCcw, ArrowLeft, CheckCircle2, ShieldCheck, Clock, PhoneCall, Mail } from "lucide-react";

export default function RefundPolicy() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Consumer Protection (E-Commerce) Rules, 2020 Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#191142] tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Last updated: September 2026 | 100-Night Risk-Free Home Trial & Doorstep Refund Terms
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 text-xs sm:text-sm text-[#191142] space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-[#0ea9df]" />
            <span>The Buddy 100-Night Sleep Guarantee</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">
            We believe you cannot test a mattress in a 10-minute showroom visit. That is why every Buddy Mattress comes with a genuine <strong>100-Night Home Trial</strong>. If your sleep is not transformed, we will arrange a 100% free doorstep reverse pickup and refund your money in full.
          </p>
        </div>

        {/* Policy Details */}
        <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <span>100-Night Home Trial Guidelines</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-600">
              <li>
                <strong>Trial Duration:</strong> The 100 nights begin from the day of verified doorstep delivery at your shipping address.
              </li>
              <li>
                <strong>30-Night Adjustment Period:</strong> Orthopedic sleep studies confirm that it takes between 3 to 4 weeks for your vertebrae and lumbar spine to unlearn bad sleep posture and adapt to ergonomic contouring. Therefore, we require you to sleep on your mattress for at least 30 nights before initiating a trial return.
              </li>
              <li>
                <strong>Hygiene & Condition:</strong> The mattress must be returned in clean, unsoiled condition. Mattresses with burns, pet damage, liquid stains, cuts, or physical tears are excluded from trial returns.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <span>How to Request a Return & Pickup</span>
            </h2>
            <p>
              Initiating a return is simple and transparent:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-gray-600">
              <li>
                Email us at <a href="mailto:support@buddymattress.in" className="text-[#0ea9df] font-bold underline">support@buddymattress.in</a> or call our helpline at <a href="tel:+919443300000" className="text-[#0ea9df] font-bold underline">+91 94433 00000</a> with your Order ID and photos of the mattress.
              </li>
              <li>
                Our team will acknowledge your request within <strong>24 to 48 hours</strong> and schedule a free reverse pickup with our logistics courier partner.
              </li>
              <li>
                The courier team will inspect and pack the mattress at your doorstep at <strong>zero shipping cost to you</strong>.
              </li>
            </ol>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <span>Refund Processing & Timelines</span>
            </h2>
            <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#191142]">
                <Clock className="w-4 h-4 text-[#0ea9df]" />
                <span>5 to 7 Business Days Refund SLA</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Once the returned mattress is picked up, your 100% refund is initiated immediately. Funds are automatically credited back to your original payment method (Bank Account / UPI / Credit Card / Debit Card) via <strong>Razorpay</strong> within <strong>5 to 7 business days</strong>, strictly compliant with RBI banking guidelines.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">4</span>
              <span>Order Cancellation Before Dispatch</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              If you wish to cancel an order before it has been dispatched from our Paramathi Velur facility, you may cancel it directly from your account or contact our support helpline. <strong>Zero cancellation fees</strong> are levied, and a 100% immediate refund will be credited.
            </p>
          </section>

          {/* Contact Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-[#191142] block">Need Help with a Return or Refund?</span>
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
