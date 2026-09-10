import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import GoogleLoginButton from "../../components/common/GoogleLoginButton";
import { AlertCircle, ShieldAlert, UserCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);
      login(res.data.user, res.data.token);
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-sm mx-auto py-8 px-4 space-y-4">
      {/* Buddy Mattress Logo */}
      <div className="text-center">
        <Link to="/" className="inline-flex flex-col items-center">
          <img
            src="/logo-transparent.png"
            alt="Buddy Mattress"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-300 rounded text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Login Card */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm space-y-4">
        <h1 className="text-2xl font-medium text-[#0f1111]">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#0f1111] mb-1">
              Email or mobile phone number
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-400 rounded text-xs text-[#0f1111] focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-[#0f1111]">Password</label>
              <a href="#" className="text-xs text-amazon-blue hover:text-amazon-linkHover hover:underline">
                Forgot Password
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-gray-400 rounded text-xs text-[#0f1111] focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] font-bold text-xs text-white shadow-sm transition-colors"
          >
            {loading ? "Signing in..." : "Sign in to Buddy Mattress"}
          </button>
        </form>

        <p className="text-[11px] text-gray-600 leading-normal">
          By continuing, you agree to Buddy Mattress's{" "}
          <a href="#" className="text-amazon-blue hover:underline">Conditions of Use</a> and{" "}
          <a href="#" className="text-amazon-blue hover:underline">Privacy Notice</a>.
        </p>

        {/* Google One-Click Login */}
        <div className="pt-2 border-t border-gray-200 space-y-2">
          <p className="text-[11px] font-medium text-gray-500 text-center">Or sign in with</p>
          <GoogleLoginButton
            onSuccess={() => navigate(redirectPath)}
            onError={(msg) => setError(msg)}
          />
        </div>
      </div>

      {/* Quick Demo Fill Pills */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs space-y-2">
        <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
          Quick Demo Credentials:
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("admin@example.com", "admin123")}
            className="flex-1 py-1 px-2 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-medium flex items-center justify-center gap-1"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("user@example.com", "user123")}
            className="flex-1 py-1 px-2 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-medium flex items-center justify-center gap-1"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Customer
          </button>
        </div>
      </div>

      {/* Create Account Divider */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs text-gray-500">New to Buddy Mattress?</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <Link
          to="/register"
          className="block w-full py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 bg-white font-medium text-xs text-center text-gray-900 shadow-sm transition-colors"
        >
          Create your Buddy Mattress account
        </Link>
      </div>
    </div>
  );
}
