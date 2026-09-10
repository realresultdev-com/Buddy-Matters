import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  User as UserIcon,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();

  const [searchCategory, setSearchCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    logout();
    setAccountDropdown(false);
    navigate("/");
  };

  return (
    <header className="w-full select-none text-white sticky top-0 z-50">
      {/* 1. Main Header Bar (Amazon Dark #131921) */}
      <div className="bg-amazon-dark px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 h-[60px]">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded transition-colors shrink-0"
        >
          <img
            src="/logo-white.png"
            alt="Buddy Mattress"
            className="h-8 sm:h-9 w-auto object-contain drop-shadow-xs"
          />
        </Link>

        {/* Deliver to Location Pin */}
        <div className="hidden lg:flex items-center gap-1.5 p-1.5 border border-transparent hover:border-white rounded cursor-pointer transition-colors shrink-0">
          <MapPin className="w-4 h-4 text-white shrink-0 mt-2" />
          <div className="text-xs leading-tight">
            <span className="text-gray-300 text-[11px] block">
              Deliver to {user ? user.name.split(" ")[0] : "India"}
            </span>
            <span className="font-bold text-white text-xs">Bengaluru 560001</span>
          </div>
        </div>

        {/* Search Bar (Amazon Signature Large Search Bar) */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl flex items-center h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amazon-orange">
          {/* Category dropdown */}
          <div className="hidden sm:flex items-center bg-gray-100 hover:bg-gray-200 px-3 h-full border-r border-gray-300 text-xs text-gray-700 cursor-pointer">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="bg-transparent text-xs text-gray-700 focus:outline-none cursor-pointer pr-1"
            >
              <option value="All">All Categories</option>
              <option value="Audio">Audio</option>
              <option value="Electronics">Electronics</option>
              <option value="Laptops">Laptops</option>
              <option value="Wearables">Wearables</option>
            </select>
          </div>

          {/* Input text */}
          <input
            type="text"
            placeholder="Search Buddy Mattress"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none h-full"
          />

          {/* Yellow Search Button */}
          <button
            type="submit"
            className="bg-amazon-yellow hover:bg-[#f3a847] px-4 h-full flex items-center justify-center transition-colors text-gray-900 shrink-0"
            aria-label="Search"
          >
            <Search className="w-5 h-5 font-bold" />
          </button>
        </form>

        {/* Language & Flag */}
        <div className="hidden xl:flex items-center gap-1 p-2 border border-transparent hover:border-white rounded cursor-pointer transition-colors text-xs font-bold shrink-0">
          <span className="text-sm">🇮🇳</span>
          <span>EN</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>

        {/* Account & Lists */}
        <div
          className="relative p-1.5 border border-transparent hover:border-white rounded cursor-pointer transition-colors shrink-0"
          onMouseEnter={() => setAccountDropdown(true)}
          onMouseLeave={() => setAccountDropdown(false)}
        >
          <div className="text-xs leading-tight">
            <span className="text-gray-300 text-[11px] block">
              Hello, {user ? user.name.split(" ")[0] : "sign in"}
            </span>
            <span className="font-bold text-white text-xs flex items-center gap-0.5">
              Account & Lists
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </span>
          </div>

          {/* Amazon Dropdown Flyout */}
          {accountDropdown && (
            <div className="absolute right-0 top-full pt-1 z-50 w-64">
              <div className="bg-white text-gray-900 rounded-md shadow-2xl border border-gray-200 p-4 text-xs">
                {!user ? (
                  <div className="text-center pb-3 border-b border-gray-200">
                    <Link
                      to="/login"
                      className="block w-full py-2 px-4 rounded-lg bg-gradient-to-b from-amazon-btnYellow to-[#f0c14b] border border-[#a88734] hover:from-[#f5d78e] hover:to-[#eeb933] font-semibold text-center text-xs shadow-sm text-gray-900"
                    >
                      Sign in
                    </Link>
                    <p className="text-[11px] text-gray-600 mt-2">
                      New customer?{" "}
                      <Link to="/register" className="text-amazon-blue hover:text-amazon-linkHover hover:underline font-semibold">
                        Start here.
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="pb-3 border-b border-gray-200 mb-2">
                    <p className="font-bold text-sm text-gray-900">{user.name}</p>
                    <p className="text-[11px] text-gray-500">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded border border-gray-200">
                      {user.role}
                    </span>
                  </div>
                )}

                <div className="space-y-2 pt-1 font-medium">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-1 text-[11px]">
                    Your Account
                  </h4>
                  <Link to="/profile" className="block hover:text-amazon-linkHover hover:underline">
                    Your Account
                  </Link>
                  <Link to="/orders" className="block hover:text-amazon-linkHover hover:underline">
                    Your Orders
                  </Link>
                  <Link to="/addresses" className="block hover:text-amazon-linkHover hover:underline">
                    Your Addresses
                  </Link>
                  {user?.role === "ADMIN" && (
                    <Link to="/admin" className="block text-amazon-blue font-bold hover:underline">
                      Admin Management Console
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
          className="hidden md:flex flex-col p-1.5 border border-transparent hover:border-white rounded transition-colors text-xs leading-tight shrink-0"
        >
          <span className="text-gray-300 text-[11px]">Returns</span>
          <span className="font-bold text-white text-xs">& Orders</span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="flex items-center gap-1 p-1.5 border border-transparent hover:border-white rounded transition-colors shrink-0"
        >
          <div className="relative flex items-center">
            <ShoppingCart className="w-8 h-8 text-white" />
            <span className="absolute top-0 left-4 font-bold text-amazon-orange text-sm leading-none">
              {totalCount}
            </span>
          </div>
          <span className="hidden sm:inline font-bold text-white text-xs mt-3">Cart</span>
        </Link>
      </div>

      {/* 2. Subnav Bar (Amazon Light Navy #232f3e) */}
      <div className="bg-amazon-subnav px-4 py-1.5 flex items-center justify-between text-xs text-white overflow-x-auto scrollbar-none h-[39px]">
        <div className="flex items-center gap-4 shrink-0 font-medium">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1 font-bold p-1 border border-transparent hover:border-white rounded"
          >
            <Menu className="w-4 h-4" />
            <span>All</span>
          </button>
          <Link to="/" className="p-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Amazon MiniTV
          </Link>
          <Link to="/" className="p-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Best Sellers
          </Link>
          <Link to="/" className="p-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Today's Deals
          </Link>
          <Link to="/" className="p-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Mobiles & Laptops
          </Link>
          <Link to="/" className="p-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Electronics
          </Link>
          <Link to="/" className="p-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Prime
          </Link>
          <Link to="/" className="p-1 border border-transparent hover:border-white rounded whitespace-nowrap">
            Customer Service
          </Link>
        </div>

        {/* Admin Portal Shortcut on right */}
        {user?.role === "ADMIN" && (
          <Link
            to="/admin"
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30 whitespace-nowrap shrink-0 ml-4"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
          </Link>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-amazon-dark border-b border-gray-700 px-4 py-3 space-y-2 text-xs">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-white hover:text-amazon-yellow"
          >
            Explore All Products
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-white hover:text-amazon-yellow"
          >
            Shopping Cart ({totalCount})
          </Link>
          {user ? (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-white hover:text-amazon-yellow"
              >
                Your Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 text-white hover:text-amazon-yellow"
              >
                Your Account
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-amazon-yellow font-bold"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left py-1 text-red-400 font-semibold"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-center font-bold text-gray-900 bg-amazon-btnYellow rounded"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
