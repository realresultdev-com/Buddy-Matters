import { MapPin, Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function Addresses() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Saved Addresses</h1>
          <p className="text-xs text-slate-400 mt-1">Manage delivery locations for quick checkout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Default address card */}
        <div className="p-5 rounded-2xl border border-indigo-500/40 bg-indigo-500/5 space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300">
              Default Delivery
            </span>
            <Check className="w-4 h-4 text-indigo-400" />
          </div>

          <div>
            <h3 className="font-bold text-sm text-white">Primary Residence</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              123 Silicon Boulevard, 4th Floor<br />
              Bengaluru, Karnataka - 560001<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>

        {/* Office address card */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
              Work / Office
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white">Tech Innovation Park</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Tower 3, Level 12, Global Tech City<br />
              Bengaluru, Karnataka - 560103<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Link
          to="/profile"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
        >
          ← Back to Account Profile
        </Link>
      </div>
    </div>
  );
}
