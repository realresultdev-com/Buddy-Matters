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

  if (loading) return <Loader text="Loading seller metrics..." />;

  const statCards = [
    {
      title: "Total Sales",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: DollarSign,
      subtext: "Settled orders in D1",
    },
    {
      title: "Total Orders",
      value: (stats?.orderCount || 0).toString(),
      icon: ShoppingBag,
      subtext: "Customer transactions",
    },
    {
      title: "Active Listings",
      value: (stats?.productCount || 0).toString(),
      icon: Package,
      subtext: "Catalog products",
    },
    {
      title: "Customers",
      value: (stats?.userCount || 0).toString(),
      icon: Users,
      subtext: "Registered accounts",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-[#0f1111]">Seller Central Dashboard</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Real-time metrics queried from Cloudflare D1 distributed database
        </p>
      </div>

      {/* KPI Cards (White Amazon Cards with gray borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-lg border border-gray-300 bg-white space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">{card.title}</span>
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
              <div className="text-2xl font-bold text-[#0f1111]">{card.value}</div>
              <p className="text-[11px] text-gray-500">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="p-5 rounded-lg border border-gray-300 bg-[#fbfbfb] space-y-3">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 p-3 rounded-lg border border-gray-300 bg-white hover:border-gray-400 text-xs font-semibold text-gray-800 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-amazon-orange" />
            Add a Product
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center gap-2 p-3 rounded-lg border border-gray-300 bg-white hover:border-gray-400 text-xs font-semibold text-gray-800 shadow-sm transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-amazon-blue" />
            Manage Taxonomy
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 p-3 rounded-lg border border-gray-300 bg-white hover:border-gray-400 text-xs font-semibold text-gray-800 shadow-sm transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-[#007600]" />
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Cloudflare Edge Status */}
      <div className="p-4 rounded-lg border border-gray-300 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#007600]" />
          <div>
            <h4 className="text-xs font-bold text-gray-900">Cloudflare D1 High-Availability Cluster</h4>
            <p className="text-[11px] text-gray-500">
              Running globally on Cloudflare free tier with sub-10ms query execution.
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-[#007600] bg-green-50 border border-green-200 px-2.5 py-1 rounded">
          Operational
        </span>
      </div>
    </div>
  );
}
