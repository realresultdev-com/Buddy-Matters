import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Users,
  Database,
  ArrowLeft,
  X,
} from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", shortLabel: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/products", label: "Manage Inventory", shortLabel: "Inventory", icon: Package },
  { path: "/admin/products/new", label: "Add a Product", shortLabel: "Add Product", icon: PlusCircle },
  { path: "/admin/media", label: "R2 Media Storage", shortLabel: "Media", icon: Database },
  { path: "/admin/categories", label: "Categories / Taxonomy", shortLabel: "Categories", icon: FolderTree },
  { path: "/admin/orders", label: "Manage Orders", shortLabel: "Orders", icon: ShoppingBag },
  { path: "/admin/users", label: "User Directory", shortLabel: "Users", icon: Users },
];

interface AdminSidebarProps {
  onClose?: () => void;
  className?: string;
}

export default function AdminSidebar({ onClose, className = "" }: AdminSidebarProps) {
  return (
    <aside className={`w-64 shrink-0 border-r border-gray-200 bg-white p-4 flex flex-col justify-between shadow-xs ${className}`}>
      <div>
        <div className="flex items-center justify-between px-3 py-2.5 mb-6 rounded-xl bg-[#191142] text-white shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <img src="/logo-white.png" alt="Buddy Mattress" className="h-5 w-auto object-contain shrink-0" />
            <span className="text-[11px] font-bold tracking-wide uppercase border-l border-white/30 pl-2 truncate">
              Seller Central
            </span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-cyan-50 text-[#0ea9df] border border-cyan-200 shadow-2xs"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#191142]"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-[#0ea9df] hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Storefront
        </Link>
      </div>
    </aside>
  );
}

