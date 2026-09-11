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
  FolderTree,
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

  if (loading) return <Loader text="Loading dashboard..." />;

  const statCards = [
    {
      title: "Total Sales",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: (stats?.orderCount || 0).toString(),
      icon: ShoppingBag,
    },
    {
      title: "Products",
      value: (stats?.productCount || 0).toString(),
      icon: Package,
    },
    {
      title: "Users",
      value: (stats?.userCount || 0).toString(),
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-xl sm:text-2xl font-black text-[#191142]">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-3.5 sm:p-5 rounded-xl border border-gray-200/90 bg-white space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center justify-between text-gray-500">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate mr-1">
                  {card.title}
                </span>
                <span className="p-1 sm:p-1.5 rounded-lg bg-gray-50 text-gray-700 shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </span>
              </div>
              <div className="text-lg sm:text-2xl font-black text-[#191142] truncate tracking-tight">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="p-4 sm:p-5 rounded-2xl border border-gray-200/90 bg-gray-50/60 space-y-3 shadow-2xs">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:border-[#0ea9df] text-xs font-bold text-[#191142] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <PlusCircle className="w-4 h-4" />
            </span>
            <p className="font-bold text-xs truncate">Add Product</p>
          </Link>

          <Link
            to="/admin/products"
            className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:border-[#0ea9df] text-xs font-bold text-[#191142] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-cyan-50 text-[#0ea9df] shrink-0">
              <Package className="w-4 h-4" />
            </span>
            <p className="font-bold text-xs truncate">Products</p>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:border-[#0ea9df] text-xs font-bold text-[#191142] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <p className="font-bold text-xs truncate">Orders</p>
          </Link>

          <Link
            to="/admin/categories"
            className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 bg-white hover:border-[#0ea9df] text-xs font-bold text-[#191142] shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <span className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
              <FolderTree className="w-4 h-4" />
            </span>
            <p className="font-bold text-xs truncate">Categories</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
