import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GoogleLoginButton from "../../components/common/GoogleLoginButton";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col justify-between items-center px-4 py-8 select-none font-sans">
      <div className="w-full flex-1 flex flex-col items-center justify-center">
        {/* iOS-Style Floating Card */}
        <div className="w-full max-w-[360px] bg-white rounded-[28px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-black/[0.05] text-center space-y-6">
          {/* Product Logo & Header */}
          <div className="space-y-3">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <img
                src="/logo-transparent.png"
                alt="Buddy Mattress"
                className="h-10 w-auto mx-auto object-contain"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#1d1d1f] tracking-tight">Sign In</h1>
              <p className="text-xs text-[#86868b] mt-1">to continue to Buddy Mattress</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50/80 border border-red-200/80 rounded-2xl text-red-700 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Simple Google OAuth Button */}
          <div className="pt-2 pb-1 flex justify-center">
            <GoogleLoginButton
              onSuccess={() => navigate(redirectPath)}
              onError={(msg) => setError(msg)}
              theme="outline"
              shape="pill"
              width={280}
            />
          </div>

          {/* Subtle Terms */}
          <p className="text-[11px] text-[#86868b] leading-relaxed pt-2">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#0071e3] hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#0071e3] hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="text-center text-[11px] text-[#86868b] space-y-1 pt-6">
        <div className="flex justify-center gap-4 text-[#86868b]">
          <a href="#" className="hover:underline">
            Conditions of Use
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Privacy Notice
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Help & Support
          </a>
        </div>
        <p className="text-[#a1a1a6]">
          © {new Date().getFullYear()} Buddy Mattress. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
