import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import GoogleLoginButton from "../../components/common/GoogleLoginButton";
import { Sparkles, AlertCircle, ArrowRight, UserCheck, ShieldAlert } from "lucide-react";

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
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to Lumina</h1>
        <p className="text-xs text-slate-400">Manage orders and access the edge storefront.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Google OAuth One-Click Login */}
      <div className="p-4 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
          Single Sign-On
        </p>
        <GoogleLoginButton
          onSuccess={() => navigate(redirectPath)}
          onError={(msg) => setError(msg)}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-[11px] font-semibold text-slate-500 uppercase">Or continue with email</span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      {/* Quick Demo Fill Pills */}
      <div className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Quick Demo Autofill:
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("admin@example.com", "admin123")}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Admin
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("user@example.com", "user123")}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" /> Customer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
