import { Sparkles, Shield, Zap, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Lumina Store</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full-stack edge e-commerce application powered 100% by Cloudflare Pages & Cloudflare D1 SQL database on the free tier.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Edge Tech Stack</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-indigo-400" /> Cloudflare Pages (Frontend)</li>
              <li className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Cloudflare Pages Functions (Hono)</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Cloudflare D1 (Serverless SQL)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Customer Service</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Instant 0-RTT Checkout</li>
              <li>Razorpay Payment Gateway</li>
              <li>Global CDN Edge Delivery</li>
              <li>Role-Based Access Control</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Demo Accounts</h4>
            <div className="space-y-2 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-indigo-400 font-medium">Admin:</span> admin@example.com / admin123
              </div>
              <div>
                <span className="text-cyan-400 font-medium">User:</span> user@example.com / user123
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Lumina. All rights reserved. Zero external servers required.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Cloudflare Edge Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
