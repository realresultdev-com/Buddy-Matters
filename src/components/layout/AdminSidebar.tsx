import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  ArrowLeft,
} from "lucide-react";

export default function AdminSidebar() {
  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/products", label: "Manage Inventory", icon: Package },
    { path: "/admin/products/new", label: "Add a Product", icon: PlusCircle },
    { path: "/admin/categories", label: "Categories / Taxonomy", icon: FolderTree },
    { path: "/admin/orders", label: "Manage Orders", icon: ShoppingBag },
    { path: "/admin/users", label: "User Directory", icon: Users },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-4 min-h-[calc(100vh-6rem)] flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center gap-2 px-3 py-2.5 mb-6 rounded-md bg-[#191142] text-white">
          <img src="/logo-white.png" alt="Buddy Mattress" className="h-5 w-auto object-contain" />
          <span className="text-[11px] font-bold tracking-wide uppercase border-l border-white/30 pl-2">
            Seller Central
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-cyan-50 text-[#0ea9df] border border-cyan-200 shadow-2xs"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Link
          to="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold text-amazon-blue hover:text-amazon-linkHover hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Storefront
        </Link>
      </div>
    </aside>
  );
}
