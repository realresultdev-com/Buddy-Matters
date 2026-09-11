import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Clock, PhoneCall, Mail, MapPin, CheckCircle2, UserCheck, AlertCircle } from "lucide-react";

export default function GrievanceRedressal() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Statutory Compliance: Rule 4(4) CPA E-Commerce Rules, 2020</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#191142] tracking-tight">
            Grievance Redressal Mechanism
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Consumer Protection (E-Commerce) Rules, 2020 & Information Technology Act, 2000
          </p>
        </div>

        {/* Grievance Officer Designated Card */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-100 text-[#0ea9df] flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#191142]">
                Designated Grievance & Nodal Officer
              </h2>
              <p className="text-xs text-gray-500">Appointed under Consumer Protection & IT Intermediary Rules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">Officer Name</span>
              <span className="font-bold text-sm text-[#191142] block">K. Senthil Kumar</span>
              <span className="text-gray-500 block text-[11px]">Head of Customer Redressal & Legal Compliance</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">Contact Helpline</span>
              <a href="tel:+919443300000" className="font-bold text-sm text-[#0ea9df] block hover:underline">
                +91 94433 00000
              </a>
              <span className="text-gray-500 block text-[11px]">Mon – Sat: 9:30 AM to 6:30 PM IST</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">Grievance Email</span>
              <a href="mailto:support@buddymattress.in" className="font-bold text-sm text-[#0ea9df] block hover:underline">
                support@buddymattress.in
              </a>
              <span className="text-gray-500 block text-[11px]">Subject: "Grievance - [Order ID]"</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">Registered Address</span>
              <span className="font-medium text-[#191142] block text-xs leading-relaxed">
                Buddy Mattress, Near RTO Office, Paramathi, Paramathi Velur, Namakkal District, Tamil Nadu - 637207, India.
              </span>
            </div>
          </div>
        </div>

        {/* Escalation Matrix & SLA */}
        <div className="space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#0ea9df]" />
              <span>Statutory Resolution Timelines (SLAs)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                <span className="font-bold text-emerald-900 block text-xs">Level 1: Acknowledgment</span>
                <span className="text-emerald-700 font-bold text-sm block">Within 48 Hours</span>
                <p className="text-[11px] text-emerald-800">
                  You will receive a formal acknowledgment with a unique Ticket ID within 48 hours of filing.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
                <span className="font-bold text-blue-900 block text-xs">Level 2: Final Resolution</span>
                <span className="text-blue-700 font-bold text-sm block">Within 30 Days</span>
                <p className="text-[11px] text-blue-800">
                  Statutory maximum timeline for complete resolution, refund, or replacement settlement.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-[#191142]">
              How to Lodge a Consumer Grievance
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-gray-600">
              <li>
                <strong>Step 1:</strong> Email your complaint to <a href="mailto:support@buddymattress.in" className="text-[#0ea9df] font-bold underline">support@buddymattress.in</a> or call our helpline at <a href="tel:+919443300000" className="text-[#0ea9df] font-bold underline">+91 94433 00000</a>. Include your registered mobile number and Order ID.
              </li>
              <li>
                <strong>Step 2:</strong> Our customer support desk will acknowledge your ticket and attempt resolution within 48 hours.
              </li>
              <li>
                <strong>Step 3 (Escalation):</strong> If your issue is not resolved satisfactorily within 7 days, you may request direct escalation to the Grievance Officer at the postal address or official email specified above.
              </li>
            </ol>
          </section>

          {/* National Consumer Helpline info */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#191142]">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>National Consumer Helpline (NCH)</span>
            </div>
            <p className="text-gray-600">
              Consumers in India may also register consumer complaints with the Department of Consumer Affairs via the National Consumer Helpline at <strong>Toll-Free: 1915</strong> or on the web portal at <a href="https://consumerhelpline.gov.in" target="_blank" rel="noreferrer" className="text-[#0ea9df] underline font-semibold">consumerhelpline.gov.in</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
