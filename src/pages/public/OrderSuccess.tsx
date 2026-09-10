import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Payment Verified & Confirmed
        </span>
        <h1 className="text-3xl font-extrabold text-white">Thank You for Your Order!</h1>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Your payment was processed and verified securely on Cloudflare Edge.
        </p>
      </div>

      {orderId && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
          <span className="text-slate-400">Order Reference ID:</span>
          <p className="font-mono text-indigo-400 font-semibold text-sm break-all">{orderId}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Link
          to="/orders"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Package className="w-4 h-4" /> View My Orders
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    </div>
  );
}
