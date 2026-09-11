import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { categoryService } from "../../services/category.service";
import { getCategoryUrl } from "../../utils/urlSecurity";
import type { Category } from "../../types/product.types";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  User,
  LogIn,
  Check,
  Globe,
  RotateCcw,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => {
        if (res.data) setCategories(res.data);
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const catParam = searchCategory ? `&category=${encodeURIComponent(searchCategory)}` : "";
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}${catParam}`);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setAccountDropdown(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="w-full select-none sticky top-0 z-50 shadow-xs bg-white">
      {/* 1. Main Header Bar */}
      <div className="border-b border-gray-200 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 sm:gap-6 min-h-[60px] md:h-[68px]">
        {/* Left: Mobile Hamburger & Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 text-[#191142] transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#191142]" /> : <Menu className="w-5 h-5 text-[#191142]" />}
          </button>

          <Link
            to="/"
            className="flex items-center p-0.5 rounded-lg hover:opacity-90 transition-opacity shrink-0"
          >
            <img
              src="/logo-transparent.png"
              alt="Buddy Mattress"
              className="h-8 sm:h-11 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Search Bar (Hidden on Mobile) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-2xl items-center h-10 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#0ea9df] focus-within:border-[#0ea9df] focus-within:ring-2 focus-within:ring-[#0ea9df]/20 bg-white transition-all shadow-2xs"
        >
          {/* Category dropdown */}
          <div className="flex items-center bg-gray-50 hover:bg-gray-100 px-3 h-full border-r border-gray-200 text-xs font-semibold text-[#191142] cursor-pointer">
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="bg-transparent text-xs text-[#191142] font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="">{t("allDepartments")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 text-sm text-[#191142] placeholder-gray-400 focus:outline-none h-full font-medium"
          />

          <button
            type="submit"
            className="bg-[#0ea9df] hover:bg-[#0c93c4] px-5 h-full flex items-center justify-center transition-colors text-white shrink-0 font-bold shadow-xs cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4 font-bold" />
          </button>
        </form>

        {/* Right Action Icons (Language, Auth, Cart) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Language Switcher (Desktop flyout & Mobile quick button) */}
          <div
            className="relative hidden sm:flex items-center gap-1 p-1.5 sm:p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors text-xs font-bold text-[#191142]"
            onMouseEnter={() => setLangDropdown(true)}
            onMouseLeave={() => setLangDropdown(false)}
          >
            <Globe className="w-4 h-4 text-[#0ea9df]" />
            <span>{language === "ta" ? "தமிழ்" : "EN"}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />

            {langDropdown && (
              <div className="absolute top-full right-0 pt-2 z-50 w-44 animate-in fade-in-50 duration-100">
                <div className="bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 py-2 text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1">
                    {t("selectLanguage")}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage("en");
                      setLangDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors text-left cursor-pointer ${
                      language === "en" ? "text-[#0ea9df] bg-cyan-50/50 font-bold" : "text-[#191142]"
                    }`}
                  >
                    <span>English - EN</span>
                    {language === "en" && <Check className="w-3.5 h-3.5 text-[#0ea9df]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage("ta");
                      setLangDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors text-left cursor-pointer ${
                      language === "ta" ? "text-[#0ea9df] bg-cyan-50/50 font-bold" : "text-[#191142]"
                    }`}
                  >
                    <span>தமிழ் - TA</span>
                    {language === "ta" && <Check className="w-3.5 h-3.5 text-[#0ea9df]" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Sign In */}
          {!user ? (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t("signIn")}</span>
            </Link>
          ) : (
            <div
              className="relative shrink-0"
              onMouseEnter={() => setAccountDropdown(true)}
              onMouseLeave={() => setAccountDropdown(false)}
            >
              <button
                type="button"
                onClick={() => setAccountDropdown((prev) => !prev)}
                className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="User profile"
              >
                <div className="w-8 h-8 rounded-full bg-[#191142] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block font-bold text-[#191142] text-xs max-w-[90px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:inline" />
              </button>

              {accountDropdown && (
                <div className="absolute right-0 top-full pt-2 z-50 w-64 animate-in fade-in-50 duration-100">
                  <div className="bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 p-4 text-xs">
                    <div className="pb-3 border-b border-gray-200 mb-2">
                      <p className="font-bold text-sm text-[#191142]">{user.name}</p>
                      <p className="text-[11px] text-gray-500">{user.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-bold bg-cyan-50 text-[#0ea9df] rounded-full border border-cyan-200">
                        {user.role === "ADMIN" ? t("storeAdmin") : t("clubMember")}
                      </span>
                    </div>

                    <div className="space-y-2 pt-1 font-medium">
                      <Link
                        to="/profile"
                        onClick={() => setAccountDropdown(false)}
                        className="block py-1 text-gray-700 hover:text-[#0ea9df] hover:underline"
                      >
                        {t("yourProfile")}
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setAccountDropdown(false)}
                        className="block py-1 text-gray-700 hover:text-[#0ea9df] hover:underline"
                      >
                        {t("returnsAndOrders") || "Returns & Orders"}
                      </Link>
                      <Link
                        to="/addresses"
                        onClick={() => setAccountDropdown(false)}
                        className="block py-1 text-gray-700 hover:text-[#0ea9df] hover:underline"
                      >
                        {t("savedAddresses")}
                      </Link>
                      {user?.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountDropdown(false)}
                          className="block py-1 text-[#0ea9df] font-bold hover:underline"
                        >
                          {t("sellerCentral")}
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left pt-2 border-t border-gray-100 text-red-600 hover:underline font-semibold cursor-pointer"
                      >
                        {t("signOut")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Shopping Cart"
          >
            <div className="relative flex items-center">
              <ShoppingCart className="w-6 h-6 text-[#191142]" />
              <span className="absolute -top-1.5 -right-2 bg-[#0ea9df] text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            </div>
            <span className="hidden sm:inline font-bold text-[#191142] text-xs">{t("cart")}</span>
          </Link>
        </div>
      </div>

      {/* 2. Dedicated Full-Width Search Bar for Mobile Viewports (< md) */}
      <div className="md:hidden px-3 py-2 bg-gray-50 border-b border-gray-200">
        <form
          onSubmit={handleSearch}
          className="flex items-center h-10 w-full rounded-xl overflow-hidden border border-gray-300 bg-white shadow-2xs focus-within:border-[#0ea9df] focus-within:ring-2 focus-within:ring-[#0ea9df]/20"
        >
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 text-xs text-[#191142] placeholder-gray-400 focus:outline-none h-full font-medium"
          />
          <button
            type="submit"
            className="bg-[#0ea9df] hover:bg-[#0c93c4] px-4 h-full flex items-center justify-center text-white shrink-0 cursor-pointer"
            aria-label="Search mobile"
          >
            <Search className="w-4 h-4 font-bold" />
          </button>
        </form>
      </div>

      {/* 3. Subnav Bar (Categories Row) */}
      <div className="bg-[#f8fafc] border-b border-gray-200 px-3 sm:px-6 py-1.5 flex items-center justify-between text-xs text-[#191142] overflow-x-auto scrollbar-none h-[38px] sm:h-[42px]">
        <div className="flex items-center gap-3 sm:gap-6 shrink-0 font-semibold text-[11px] sm:text-xs">
          <Link
            to="/#catalog"
            className="py-1 px-1 text-gray-700 hover:text-[#0ea9df] transition-colors whitespace-nowrap"
          >
            {t("allDepartments")}
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={getCategoryUrl(cat.id)}
              className="py-1 px-1 text-gray-700 hover:text-[#0ea9df] transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {user?.role === "ADMIN" && (
          <Link
            to="/admin"
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#191142] text-white text-[11px] font-bold hover:bg-[#261d5e] whitespace-nowrap shrink-0 shadow-xs ml-3"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#0ea9df]" />
            <span className="hidden sm:inline">{t("adminPanel")}</span>
          </Link>
        )}
      </div>

      {/* 4. Enhanced Mobile Drawer with Backdrop */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white z-50 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="p-5 space-y-4">
              {/* Top Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <img src="/logo-transparent.png" alt="Buddy Mattress" className="h-8 w-auto object-contain" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Greeting Box */}
              {user ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-[#191142] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-[#191142] truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-100 text-center space-y-2">
                  <p className="text-xs font-semibold text-[#191142]">Welcome to Buddy Mattress</p>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-4 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold shadow-xs"
                  >
                    {t("signIn")}
                  </Link>
                </div>
              )}

              {/* Quick Language Toggle in Mobile Drawer */}
              <div className="flex items-center justify-between py-2 px-2 rounded-lg bg-gray-50 border border-gray-200 text-xs">
                <span className="font-medium text-gray-600 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#0ea9df]" /> Language:
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                      language === "en" ? "bg-[#0ea9df] text-white" : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("ta")}
                    className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                      language === "ta" ? "bg-[#0ea9df] text-white" : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 text-xs font-semibold text-[#191142]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 pt-2">
                  Navigation
                </p>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-2 rounded-lg hover:bg-gray-100 hover:text-[#0ea9df]"
                >
                  Home
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-gray-100 hover:text-[#0ea9df]"
                >
                  <span>{t("shoppingCart")}</span>
                  <span className="bg-[#0ea9df] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {totalCount}
                  </span>
                </Link>
                <Link
                  to={user ? "/profile" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-2 rounded-lg hover:bg-gray-100 hover:text-[#0ea9df]"
                >
                  {t("yourProfile")}
                </Link>
                <Link
                  to={user ? "/orders" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-2 rounded-lg hover:bg-gray-100 hover:text-[#0ea9df]"
                >
                  Returns & Orders
                </Link>
                <Link
                  to={user ? "/addresses" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-2 rounded-lg hover:bg-gray-100 hover:text-[#0ea9df]"
                >
                  {t("savedAddresses")}
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-2 rounded-lg text-[#0ea9df] font-bold hover:bg-cyan-50"
                  >
                    Admin Console
                  </Link>
                )}
              </div>

              {/* Categories Section */}
              <div className="pt-2 border-t border-gray-100 space-y-1 text-xs">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">
                  Categories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={getCategoryUrl(cat.id)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1.5 px-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[#0ea9df]"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Logout button at bottom of drawer if logged in */}
            {user && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 px-3 rounded-lg border border-red-200 bg-white text-xs font-semibold text-red-600 hover:bg-red-50 text-center cursor-pointer"
                >
                  {t("signOut")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
