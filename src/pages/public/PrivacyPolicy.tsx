import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, ArrowLeft, Mail, PhoneCall, Building2 } from "lucide-react";

export default function PrivacyPolicy() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP Act, 2023 & IT Act, 2000 Compliant</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#191142] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Last updated: September 2026 | Effective immediately for all users & customers
          </p>
        </div>

        {/* Overview Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-gray-700 leading-relaxed space-y-2">
          <p>
            At <strong>Buddy Mattress</strong> (referred to as "we", "our", or "us"), we respect your privacy and are committed to protecting your personal data in accordance with the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong>, the <strong>Information Technology Act, 2000</strong>, and applicable Indian data protection laws.
          </p>
          <p>
            This Privacy Policy explains what personal data we collect, why we collect it, how it is processed by verified third-party service providers, and your statutory rights to access, rectify, or delete your personal information.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <span>Personal Data We Collect</span>
            </h2>
            <p>
              When you browse our website, create an account, purchase a mattress or bedding accessory, or contact our customer support, we collect the following categories of personal data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1">
                <span className="font-bold text-[#191142] text-xs block">Contact & Identification Data</span>
                <p className="text-xs text-gray-600">
                  Full name, mobile telephone number, and email address (captured via Google OAuth or account registration).
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1">
                <span className="font-bold text-[#191142] text-xs block">Order Fulfillment & Delivery Data</span>
                <p className="text-xs text-gray-600">
                  Doorstep shipping address, billing address, city, state, postal PIN code, and delivery landmark.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1">
                <span className="font-bold text-[#191142] text-xs block">Technical & Device Data</span>
                <p className="text-xs text-gray-600">
                  Internet Protocol (IP) address, browser user-agent, device characteristics, operating system, and session security identifiers.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1">
                <span className="font-bold text-[#191142] text-xs block">Transaction & Invoicing Data</span>
                <p className="text-xs text-gray-600">
                  Razorpay payment transaction ID, order value, items purchased, and statutory GST tax invoice records.
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic">
              *Note: We never store your credit/debit card numbers, CVVs, or NetBanking passwords on our servers. All financial transactions are securely tokenized and processed through RBI-authorized payment aggregators.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <span>Third-Party Data Processors</span>
            </h2>
            <p>
              We partner with trusted, industry-leading infrastructure and payment partners to deliver our services. Your data is strictly shared with the following third-party data processors solely for order execution:
            </p>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl border border-gray-200 bg-slate-50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs shrink-0">
                  RZP
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#191142]">Razorpay Software Private Limited</h3>
                  <p className="text-xs text-gray-600">
                    Payment Gateway & Tokenization Processor. Handles secure checkout, UPI, cards, and refunds under Reserve Bank of India (RBI) payment guidelines and PCI-DSS Level 1 compliance.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-gray-200 bg-slate-50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs shrink-0">
                  CF
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#191142]">Cloudflare, Inc.</h3>
                  <p className="text-xs text-gray-600">
                    Cloud Infrastructure & Edge Security. Hosts our application runtime (Cloudflare Pages & Workers), encrypted database storage (Cloudflare D1), and media asset storage (Cloudflare R2), protecting against unauthorized DDoS attacks.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-gray-200 bg-slate-50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
                  LOG
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#191142]">Authorized Courier & Delivery Partners</h3>
                  <p className="text-xs text-gray-600">
                    Logistics carriers (e.g., Delhivery, BlueDart, or designated regional delivery fleets) receive solely your name, delivery address, and phone number to execute doorstep mattress delivery and 100-night trial returns.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <span>Your Statutory Rights under the DPDP Act, 2023</span>
            </h2>
            <p>
              As a Data Principal under Section 11, 12, and 13 of the Digital Personal Data Protection Act, 2023, you hold the following non-negotiable rights:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600">
              <li>
                <strong>Right to Access Information:</strong> You have the right to obtain a summary of your personal data processed by us and the identities of all data processors with whom it has been shared.
              </li>
              <li>
                <strong>Right to Correction & Updating:</strong> You have the right to rectify, correct, or complete any inaccurate or obsolete personal data in your profile or order history.
              </li>
              <li>
                <strong>Right to Erasure / Deletion:</strong> You have the right to request the permanent deletion of your account and personal data, except where retention is mandated by law (e.g., statutory tax invoices required under GST laws for 7 years).
              </li>
              <li>
                <strong>Right of Grievance Redressal:</strong> You have the right to readily available grievance redressal mechanisms regarding any act or omission regarding your data rights.
              </li>
            </ul>
            <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl">
              <p className="text-xs text-[#191142]">
                <strong>How to exercise your data rights:</strong> Simply email our Data Protection Desk at{" "}
                <a href="mailto:support@buddymattress.in" className="text-[#0ea9df] font-bold underline">
                  support@buddymattress.in
                </a>
                . We will acknowledge your request within 48 hours and process it within 30 days.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-100 text-[#0ea9df] text-xs font-bold flex items-center justify-center shrink-0">4</span>
              <span>Grievance Officer & Data Fiduciary Details</span>
            </h2>
            <p>
              In compliance with Rule 4(4) of the Consumer Protection (E-Commerce) Rules, 2020 and Section 13 of the DPDP Act, 2023, the details of our Grievance Officer and physical office are provided below:
            </p>
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center gap-2 text-sm font-bold text-[#191142]">
                <Building2 className="w-4 h-4 text-[#0ea9df]" />
                <span>Buddy Mattress</span>
              </div>
              <p className="text-gray-600">
                <strong>Address:</strong> Near RTO Office, Paramathi, Paramathi Velur, Namakkal District, Tamil Nadu - 637207, India
              </p>
              <p className="text-gray-600">
                <strong>Grievance Officer Email:</strong>{" "}
                <a href="mailto:support@buddymattress.in" className="text-[#0ea9df] hover:underline font-semibold">
                  support@buddymattress.in
                </a>
              </p>
              <p className="text-gray-600">
                <strong>Consumer Helpline:</strong>{" "}
                <a href="tel:+919443300000" className="text-[#0ea9df] hover:underline font-semibold">
                  +91 94433 00000
                </a>{" "}
                (Monday to Saturday, 9:30 AM to 6:30 PM IST)
              </p>
              <p className="text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                *Consumer grievances are acknowledged within 48 hours and redressed within 30 days of receipt.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
