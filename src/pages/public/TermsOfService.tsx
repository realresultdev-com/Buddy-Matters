import { Link } from "react-router-dom";
import { Scale, ArrowLeft, ShieldCheck, Truck, RotateCcw, Building2 } from "lucide-react";

export default function TermsOfService() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[#0ea9df] text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Consumer Protection Act, 2019 Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#191142] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Last updated: September 2026 | Governing contract between Buddy Mattress and Customer
          </p>
        </div>

        {/* Introduction */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-gray-700 leading-relaxed space-y-2">
          <p>
            Welcome to <strong>Buddy Mattress</strong>. These Terms of Service ("Terms") govern your use of our website, digital platforms, and purchase of mattresses, orthopedic pillows, and sleep accessories manufactured and marketed by <strong>Buddy Mattress</strong>, Paramathi Velur, Tamil Nadu, India.
          </p>
          <p>
            By accessing our store, creating an account, or placing an order, you agree to be bound by these Terms and our Privacy Policy.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {/* 1. Eligibility & User Accounts */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#191142]">
              1. Eligibility & Account Security
            </h2>
            <p>
              To make a purchase, you must be at least 18 years of age and capable of entering into legally binding contracts under the Indian Contract Act, 1872. You are responsible for maintaining the confidentiality of your authentication credentials and for all activities conducted under your account.
            </p>
          </section>

          {/* 2. Pricing, Taxes & Payment */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#191142]">
              2. Pricing, GST & Payment Terms
            </h2>
            <p>
              All prices displayed on the store are stated in Indian Rupees (₹ INR) and are <strong>inclusive of Goods and Services Tax (GST)</strong> and doorstep delivery charges unless explicitly specified. Payment is processed securely via Razorpay with support for UPI, Debit/Credit Cards, and NetBanking.
            </p>
          </section>

          {/* 3. 100-Night Home Trial Policy */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#191142]">
              3. 100-Night Risk-Free Trial
            </h2>
            <p>
              Eligible mattresses include a 100-Night Trial calculated from the date of confirmed doorstep delivery. We recommend sleeping on your mattress for at least 30 nights to allow your spine to adjust. If you are not satisfied within 100 nights, contact us at <a href="mailto:support@buddymattress.in" className="text-[#0ea9df] underline">support@buddymattress.in</a> for return pickup and a 100% refund. The mattress must be in hygienic condition without burns, stains, or physical tears.
            </p>
          </section>

          {/* 4. 10-Year Manufacturer Warranty */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#191142]">
              4. 10-Year Warranty Terms
            </h2>
            <p>
              Buddy Mattresses are warranted against manufacturing defects and visible body indentations/sagging greater than 1 inch (25 mm) not resulting from an improper bed base. The warranty excludes normal softening of foam, fabric tears, burns, liquid spills, or accidental damage.
            </p>
          </section>

          {/* 5. Governing Law & Dispute Resolution */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#191142]">
              5. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. In the event of any legal dispute or claim arising out of these Terms or your purchase, the dispute shall be subject to the exclusive jurisdiction of the competent courts in <strong>Namakkal / Chennai, Tamil Nadu, India</strong>.
            </p>
          </section>

          {/* 6. Contact & Grievances */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#191142]">
              6. Contact Information & Customer Grievances
            </h2>
            <p>
              For inquiries, legal notices, or complaints:
              <br />
              <strong>Buddy Mattress</strong>, Near RTO Office, Paramathi, Paramathi Velur, Namakkal District, Tamil Nadu - 637207, India.
              <br />
              Email: <a href="mailto:support@buddymattress.in" className="text-[#0ea9df] underline">support@buddymattress.in</a> | Phone: <a href="tel:+919443300000" className="text-[#0ea9df] underline">+91 94433 00000</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
