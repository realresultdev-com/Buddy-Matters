import { useState, useEffect } from "react";
import { adminService, DashboardStats } from "../../services/admin.service";
import Loader from "../../components/common/Loader";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  PlusCircle,
  FolderPlus,
  ShieldCheck,
  Server,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader text="Loading dashboard metrics..." />;

  const statCards = [
    {
      title: "Gross Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
      subtext: "Settled payments in D1",
    },
    {
      title: "Total Orders",
      value: (stats?.orderCount || 0).toString(),
      icon: ShoppingBag,
      color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-400",
      subtext: "Customer transactions",
    },
    {
      title: "Active Products",
      value: (stats?.productCount || 0).toString(),
      icon: Package,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
      subtext: "Catalog inventory",
    },
    {
      title: "Registered Users",
      value: (stats?.userCount || 0).toString(),
      icon: Users,
      color: "from-cyan-500/20 to-sky-500/20 border-cyan-500/30 text-cyan-400",
      subtext: "Customers & administrators",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Administration Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics queried directly from Cloudflare D1 serverless database
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border bg-gradient-to-br ${card.color} space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">{card.title}</span>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-white">{card.value}</div>
              <p className="text-[11px] text-slate-400">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Operations Strip */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-4">
        <h3 className="text-sm font-bold text-white">Management Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs font-semibold text-slate-200"
          >
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            Create New Product
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs font-semibold text-slate-200"
          >
            <FolderPlus className="w-4 h-4 text-cyan-400" />
            Manage Categories
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-xs font-semibold text-slate-200"
          >
            <ShoppingBag className="w-4 h-4 text-purple-400" />
            Process Pending Orders
          </Link>
        </div>
      </div>

      {/* Cloudflare Edge Infrastructure Banner */}
      <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Zero-Server Cloudflare Architecture</h4>
            <p className="text-xs text-slate-400">
              Operating within the Cloudflare Pages & Cloudflare D1 100% Free Tier limit.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> D1 Database Connected
          </span>
        </div>
      </div>
    </div>
  );
}
