import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GoogleLoginButton from "../../components/common/GoogleLoginButton";
import { AlertCircle, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between select-none">
      {/* 1. Minimalist Top Bar with centered Brand Logo */}
      <div className="pt-8 pb-4 text-center">
        <Link to="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
          <img
            src="/logo-transparent.png"
            alt="Buddy Mattress"
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </Link>
      </div>

      {/* 2. Central Sign In Card (Google OAuth Only) */}
      <div className="w-full max-w-[420px] mx-auto px-4 py-2">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-cyan-50 border border-cyan-200 text-[#0ea9df] text-[11px] font-bold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Secure Login
            </span>
            <h1 className="text-2xl font-black text-[#191142] tracking-tight">
              Sign In to Buddy Mattress
            </h1>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Continue with your Google account to access your orders, track shipments, and manage your 100-night trial benefits.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 text-left animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth Button Only */}
          <div className="py-3 flex flex-col items-center justify-center">
            <GoogleLoginButton
              onSuccess={() => navigate(redirectPath)}
              onError={(msg) => setError(msg)}
            />
          </div>

          {/* Security & Verification Badges */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-[11px] text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0ea9df]" /> 256-Bit Encrypted
            </span>
            <span>•</span>
            <span>Zero Password Required</span>
            <span>•</span>
            <span>Instant Access</span>
          </div>

          {/* Terms Agreement */}
          <p className="text-[11px] text-gray-500 leading-normal pt-1">
            By signing in, you agree to Buddy Mattress's{" "}
            <a href="#" className="text-[#0ea9df] hover:underline font-semibold">
              Conditions of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#0ea9df] hover:underline font-semibold">
              Privacy Notice
            </a>
            .
          </p>
        </div>

        {/* Back to Storefront Link */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#191142] hover:text-[#0ea9df] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Buddy Mattress Store
          </Link>
        </div>
      </div>

      {/* 3. Minimalist Clean Auth Footer */}
      <div className="py-8 text-center text-xs text-gray-500 border-t border-gray-200 mt-8 space-y-2 bg-white">
        <div className="flex justify-center gap-6 text-[11px]">
          <a href="#" className="hover:text-[#0ea9df] hover:underline">
            Conditions of Use
          </a>
          <a href="#" className="hover:text-[#0ea9df] hover:underline">
            Privacy Notice
          </a>
          <a href="#" className="hover:text-[#0ea9df] hover:underline">
            Help & Support
          </a>
        </div>
        <p className="text-[11px] text-gray-400">
          © {new Date().getFullYear()}, Buddy Mattress Co. or its affiliates. All rights reserved.
        </p>
      </div>
    </div>
  );
}
