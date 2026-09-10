import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export default function AdminSidebar() {
  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/products", label: "Products Catalog", icon: Package, end: true },
    { to: "/admin/products/new", label: "Add New Product", icon: PlusCircle, end: false },
    { to: "/admin/categories", label: "Categories", icon: FolderTree, end: false },
    { to: "/admin/orders", label: "Customer Orders", icon: ShoppingBag, end: false },
    { to: "/admin/users", label: "User Accounts", icon: Users, end: false },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950 p-4 min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 px-3 py-2 mb-6 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <ShieldAlert className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">Admin Control</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Storefront
        </Link>
      </div>
    </aside>
  );
}
