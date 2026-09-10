import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { categoryService } from "../../services/category.service";
import type { Category } from "../../types/product.types";
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  ChevronDown,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    categoryService.getAll().then((res) => {
      if (res.data) setCategories(res.data);
    }).catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const catParam = searchCategory !== "All" ? `&category=${encodeURIComponent(searchCategory)}` : "";
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}${catParam}`);
  };

  const handleLogout = () => {
    logout();
    setAccountDropdown(false);
    navigate("/");
  };

  return (
    <header className="w-full select-none sticky top-0 z-50 shadow-xs">
      {/* 1. Main Header Bar (Clean White Background with Buddy Mattress Brand Colors) */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 sm:gap-6 h-[68px]">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center p-1.5 rounded-lg hover:opacity-90 transition-opacity shrink-0"
        >
          <img
            src="/logo-transparent.png"
            alt="Buddy Mattress"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </Link>

        {/* Deliver to Location Pin */}
        <div className="hidden lg:flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors shrink-0">
          <div className="w-7 h-7 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-[#0ea9df]" />
          </div>
          <div className="text-xs leading-tight">
            <span className="text-gray-500 text-[11px] block">
              Deliver to {user ? user.name.split(" ")[0] : "India"}
            </span>
            <span className="font-bold text-[#191142] text-xs">Bengaluru 560001</span>
          </div>
        </div>

        {/* Search Bar (Buddy Mattress Styled Signature Search Bar) */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-2xl flex items-center h-10 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#0ea9df] focus-within:border-[#0ea9df] focus-within:ring-2 focus-within:ring-[#0ea9df]/20 bg-white transition-all shadow-2xs"
        >
          {/* Category dropdown */}
          <div className="hidden sm:flex items-center bg-gray-50 hover:bg-gray-100 px-3 h-full border-r border-gray-200 text-xs font-semibold text-[#191142] cursor-pointer">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="bg-transparent text-xs text-[#191142] font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Input text */}
          <input
            type="text"
            placeholder="Search mattresses, orthopedic pillows, bedding..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 text-sm text-[#191142] placeholder-gray-400 focus:outline-none h-full font-medium"
          />

          {/* Cyan Search Button */}
          <button
            type="submit"
            className="bg-[#0ea9df] hover:bg-[#0c93c4] px-5 h-full flex items-center justify-center transition-colors text-white shrink-0 font-bold shadow-xs"
            aria-label="Search"
          >
            <Search className="w-4 h-4 font-bold" />
          </button>
        </form>

        {/* Language & Flag */}
        <div className="hidden xl:flex items-center gap-1.5 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors text-xs font-bold text-[#191142] shrink-0">
          <span className="text-base">🇮🇳</span>
          <span>EN</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </div>

        {/* Account & Lists */}
        <div
          className="relative p-1.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors shrink-0"
          onMouseEnter={() => setAccountDropdown(true)}
          onMouseLeave={() => setAccountDropdown(false)}
        >
          <div className="text-xs leading-tight">
            <span className="text-gray-500 text-[11px] block">
              Hello, {user ? user.name.split(" ")[0] : "sign in"}
            </span>
            <span className="font-bold text-[#191142] text-xs flex items-center gap-0.5">
              Account & Lists
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </span>
          </div>

          {/* Account Dropdown Flyout */}
          {accountDropdown && (
            <div className="absolute right-0 top-full pt-2 z-50 w-64 animate-in fade-in-50 duration-100">
              <div className="bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 p-4 text-xs">
                {!user ? (
                  <div className="text-center pb-3 border-b border-gray-200">
                    <Link
                      to="/login"
                      className="block w-full py-2 px-4 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] font-bold text-center text-xs shadow-sm text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <p className="text-[11px] text-gray-600 mt-2">
                      New to Buddy Mattress?{" "}
                      <Link to="/register" className="text-[#0ea9df] hover:underline font-bold">
                        Start here.
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="pb-3 border-b border-gray-200 mb-2">
                    <p className="font-bold text-sm text-[#191142]">{user.name}</p>
                    <p className="text-[11px] text-gray-500">{user.email}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold bg-cyan-50 text-[#0ea9df] rounded-full border border-cyan-200">
                      {user.role === "ADMIN" ? "Store Administrator" : "Buddy Sleep Club Member"}
                    </span>
                  </div>
                )}

                <div className="space-y-2 pt-2 font-medium">
                  <h4 className="font-bold text-[#191142] text-xs uppercase tracking-wider mb-1 text-[11px]">
                    Your Account
                  </h4>
                  <Link to="/profile" className="block text-gray-700 hover:text-[#0ea9df] hover:underline">
                    Your Profile & Settings
                  </Link>
                  <Link to="/orders" className="block text-gray-700 hover:text-[#0ea9df] hover:underline">
                    Your Orders & Tracking
                  </Link>
                  <Link to="/addresses" className="block text-gray-700 hover:text-[#0ea9df] hover:underline">
                    Saved Addresses
                  </Link>
                  {user?.role === "ADMIN" && (
                    <Link to="/admin" className="block text-[#0ea9df] font-bold hover:underline">
                      Seller Central Management
                    </Link>
                  )}
                  {user && (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left pt-2 border-t border-gray-200 text-red-600 hover:underline font-semibold"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <Link
          to={user ? "/orders" : "/login"}
          className="hidden md:flex flex-col p-1.5 rounded-md hover:bg-gray-100 transition-colors text-xs leading-tight shrink-0"
        >
          <span className="text-gray-500 text-[11px]">Returns</span>
          <span className="font-bold text-[#191142] text-xs">& Orders</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-gray-100 transition-colors shrink-0"
        >
          <div className="relative flex items-center">
            <ShoppingCart className="w-7 h-7 text-[#191142]" />
            <span className="absolute -top-1.5 -right-2 bg-[#0ea9df] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
              {totalCount}
            </span>
          </div>
          <span className="hidden sm:inline font-bold text-[#191142] text-xs">Cart</span>
        </Link>
      </div>

      {/* 2. Subnav Bar (Clean Brand White/Ice Tint with Navy Links) */}
      <div className="bg-[#f8fafc] border-b border-gray-200 px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs text-[#191142] overflow-x-auto scrollbar-none h-[42px]">
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 font-semibold">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 font-bold py-1 px-2 rounded-md hover:bg-white hover:shadow-2xs text-[#191142] border border-transparent hover:border-gray-200 transition-all"
          >
            <Menu className="w-4 h-4 text-[#0ea9df]" />
            <span>All Departments</span>
          </button>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="py-1 px-1.5 hover:text-[#0ea9df] transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
          <a href="/#catalog" className="py-1 px-1.5 hover:text-[#0ea9df] transition-colors whitespace-nowrap">
            Today's Deals
          </a>
        </div>

        {/* Right Promotional Pill & Admin Portal */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <div className="hidden lg:flex items-center gap-1.5 bg-cyan-50 border border-cyan-200 text-[#0ea9df] text-[11px] font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#0ea9df]" />
            <span>100-Night Trial & Free Delivery</span>
          </div>

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#191142] text-white text-xs font-bold hover:bg-[#261d5e] whitespace-nowrap shrink-0 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0ea9df]" /> Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-2 text-xs shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-[#191142] font-semibold hover:text-[#0ea9df]"
          >
            Explore All Mattresses & Pillows
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-[#191142] font-semibold hover:text-[#0ea9df]"
          >
            Shopping Cart ({totalCount})
          </Link>
          {user ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-[#191142] font-semibold hover:text-[#0ea9df]"
              >
                Your Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 text-[#191142] font-semibold hover:text-[#0ea9df]"
              >
                Your Account
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1.5 text-[#0ea9df] font-bold"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left py-1.5 text-red-600 font-semibold"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-center font-bold text-white bg-[#0ea9df] rounded-lg shadow-sm"
            >
              Sign In to Buddy Mattress
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
