import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  RotateCcw,
  User as UserIcon,
  LogIn,
} from "lucide-react";

export default function MobileBottomNav() {
  const location = useLocation();
  const { totalCount } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    {
      name: "Home",
      to: "/",
      icon: Home,
      active: isActive("/"),
    },
    {
      name: "Shop",
      to: "/shop",
      icon: LayoutGrid,
      active: currentPath === "/shop" || currentPath.startsWith("/category"),
    },
    {
      name: "Cart",
      to: "/cart",
      icon: ShoppingCart,
      active: isActive("/cart"),
      badge: totalCount > 0 ? totalCount : undefined,
    },
    {
      name: "Orders",
      to: user ? "/orders" : "/login?redirect=/orders",
      icon: RotateCcw,
      active: isActive("/orders"),
    },
    {
      name: user ? "Account" : "Sign In",
      to: user ? "/profile" : "/login",
      icon: user ? UserIcon : LogIn,
      active: isActive("/profile") || isActive("/login"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors relative min-w-[56px] cursor-pointer ${
                item.active
                  ? "text-[#0ea9df] font-bold"
                  : "text-gray-500 hover:text-[#191142] font-medium"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    item.active ? "scale-110 text-[#0ea9df]" : "text-gray-500"
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#0ea9df] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[16px] text-center leading-tight shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 leading-tight tracking-tight">
                {item.name}
              </span>
              {item.active && (
                <span className="absolute -bottom-1 w-4 h-0.5 bg-[#0ea9df] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
