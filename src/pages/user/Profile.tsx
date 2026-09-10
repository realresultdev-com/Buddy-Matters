import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { User, Mail, Shield, Package, MapPin, LogOut } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Account Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your identity and preferences</p>
      </div>

      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-600/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Role: {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <User className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="text-slate-400">Account ID</p>
              <p className="font-mono text-white text-[11px] truncate max-w-[200px]">{user.id}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <Mail className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-slate-400">Verified Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/orders"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <Package className="w-3.5 h-3.5" /> View Order History
          </Link>
          <Link
            to="/addresses"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" /> Saved Addresses
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors ml-auto"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
