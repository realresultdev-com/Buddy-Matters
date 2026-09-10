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
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/products", label: "Manage Inventory", icon: Package, end: true },
    { to: "/admin/products/new", label: "Add a Product", icon: PlusCircle, end: false },
    { to: "/admin/categories", label: "Categories / Taxonomy", icon: FolderTree, end: false },
    { to: "/admin/orders", label: "Manage Orders", icon: ShoppingBag, end: false },
    { to: "/admin/users", label: "User Directory", icon: Users, end: false },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-4 min-h-[calc(100vh-6rem)] flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center gap-2 px-3 py-2.5 mb-6 rounded-md bg-[#232f3e] text-white">
          <span className="text-xs font-bold tracking-wide uppercase">
            Amazon Seller Central
          </span>
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
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amazon-btnYellow text-gray-900 border border-[#a88734] shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`
                }
              >
                <Icon className="w-4 h-4 text-gray-600" />
                {item.label}
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
          Back to Amazon Storefront
        </Link>
      </div>
    </aside>
  );
}
