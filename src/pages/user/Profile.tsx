import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { orderService } from "../../services/order.service";
import type { Order } from "../../types/order.types";
import type { UserAddress } from "./Addresses";
import {
  Package,
  RotateCcw,
  Truck,
  MapPin,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  Send,
} from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [defaultAddress, setDefaultAddress] = useState<UserAddress | null>(null);

  // Return request modal state
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState("Too firm / comfort preference");
  const [returnNotes, setReturnNotes] = useState("");
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  useEffect(() => {
    // Load recent orders
    orderService
      .myOrders()
      .then((res) => {
        if (res.data) setOrders(res.data);
      })
      .catch((err) => console.error("Failed to load orders in profile:", err))
      .finally(() => setLoadingOrders(false));

    // Load default address from local storage
    if (user) {
      try {
        const saved = localStorage.getItem(`buddy_addresses_${user.id}`);
        if (saved) {
          const addrs: UserAddress[] = JSON.parse(saved);
          const def = addrs.find((a) => a.isDefault) || addrs[0] || null;
          setDefaultAddress(def);
        }
      } catch (e) {
        console.error("Failed to load address:", e);
      }
    }
  }, [user]);

  if (!user) return null;

  const handleOpenReturnModal = (order: Order) => {
    setSelectedOrderForReturn(order);
    setReturnSubmitted(false);
    setReturnModalOpen(true);
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnSubmitted(true);
    setTimeout(() => {
      setReturnModalOpen(false);
      setReturnSubmitted(false);
      setSelectedOrderForReturn(null);
    }, 2500);
  };

  // Metrics
  const activeOrdersCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PAID" || o.status === "SHIPPED"
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Profile Hero Header */}
      <div className="bg-gradient-to-r from-[#191142] via-[#23175c] to-[#0ea9df] rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-36 h-36 bg-[#0ea9df]/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* User Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-inner shrink-0 overflow-hidden">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                user.name ? user.name.charAt(0).toUpperCase() : "U"
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{user.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs border border-white/30">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  {user.role === "ADMIN" ? t("storeAdmin") : t("clubMember")}
                </span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm mt-1">{user.email}</p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-cyan-100">
                <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  Google Verified Account
                </span>
                <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-cyan-200" />
                  100-Night Trial Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            {user.role === "ADMIN" && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur-md border border-white/30 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                Admin Portal
              </Link>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-white/90 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              {t("signOut")}
            </button>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED RETURNS & ORDERS SECTION (Placed prominently inside user profile) */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0ea9df] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#191142]">
                  {language === "ta" ? "ரிட்டர்ன்ஸ் & ஆர்டர்கள்" : "Returns & Orders"}
                </h2>
                <span className="bg-[#0ea9df]/10 text-[#0ea9df] text-xs font-bold px-2 py-0.5 rounded-full">
                  100-Night Trial
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Track shipments, view invoices, or initiate hassle-free returns & replacements
              </p>
            </div>
          </div>

          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0ea9df] hover:text-[#0c93c4] hover:underline"
          >
            <span>View All Orders & Return History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Order Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/80 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Total Orders
              </p>
              <p className="text-xl font-extrabold text-[#191142] mt-0.5">
                {orders.length}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50/80 border border-gray-200/80 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Active Deliveries
              </p>
              <p className="text-xl font-extrabold text-[#191142] mt-0.5">
                {activeOrdersCount}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-50/60 border border-cyan-200/60 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#0ea9df] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-cyan-800 uppercase tracking-wider">
                Trial & Return Window
              </p>
              <p className="text-xl font-extrabold text-[#191142] mt-0.5">
                100 Nights
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders List or Empty State */}
        {loadingOrders ? (
          <div className="py-10 text-center text-xs text-gray-400">
            Loading recent orders and return status...
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center space-y-3 bg-gray-50/50">
            <div className="w-12 h-12 rounded-full bg-cyan-50 text-[#0ea9df] flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191142]">No active orders or returns yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Ready to experience India's premier orthopedic mattress? Every purchase comes with our risk-free 100-night home trial.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold transition-all shadow-xs"
            >
              <span>Explore Mattress Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Recent Orders & Eligible Returns
            </h3>
            {orders.slice(0, 3).map((order) => {
              const statusColors: Record<string, string> = {
                PAID: "bg-blue-50 text-blue-700 border-blue-200",
                SHIPPED: "bg-amber-50 text-amber-700 border-amber-200",
                DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                PENDING: "bg-gray-100 text-gray-700 border-gray-200",
                CANCELLED: "bg-red-50 text-red-700 border-red-200",
              };
              const colorClass = statusColors[order.status] || "bg-gray-100 text-gray-700 border-gray-200";

              return (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-gray-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-[#191142]">
                        #{order.id.slice(0, 10).toUpperCase()}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${colorClass}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600">
                      <span>{order.items?.length || 1} item(s)</span>
                      <span className="mx-2">•</span>
                      <span className="font-bold text-[#191142]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      100-Night Free Return Trial applies to this order
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleOpenReturnModal(order)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Return / Replace
                    </button>
                    <Link
                      to="/orders"
                      className="px-3.5 py-1.5 rounded-lg bg-[#191142] hover:bg-[#23175c] text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>Track Order</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 100-Night Sleep Trial Guarantee Banner */}
        <div className="bg-cyan-50/50 border border-cyan-100 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0ea9df] text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
              ✓
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#191142]">
                100-Night Risk-Free Sleep Guarantee
              </h4>
              <p className="text-[11px] text-gray-600 mt-0.5">
                Sleep on your Buddy Mattress for at least 30 nights. If it's not a perfect match, return it for a 100% full refund with free doorstep pickup.
              </p>
            </div>
          </div>
          <a
            href="mailto:support@buddymattress.com"
            className="text-xs font-bold text-[#0ea9df] hover:underline shrink-0 whitespace-nowrap"
          >
            Contact Support →
          </a>
        </div>
      </section>

      {/* 3. Address & Account Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saved Addresses & Location Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#0ea9df] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#191142]">Delivery Address & Location</h3>
                  <p className="text-[11px] text-gray-500">Default shipping destination for fast delivery</p>
                </div>
              </div>
              <Link
                to="/addresses"
                className="text-xs font-bold text-[#0ea9df] hover:underline"
              >
                Manage
              </Link>
            </div>

            {defaultAddress ? (
              <div className="bg-gray-50/70 border border-gray-200/80 rounded-xl p-4 text-xs space-y-1 text-gray-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#191142]">{defaultAddress.name}</span>
                  <span className="text-[10px] font-bold uppercase bg-cyan-50 text-[#0ea9df] px-2 py-0.5 rounded-md border border-cyan-200">
                    Default
                  </span>
                </div>
                <p>{defaultAddress.addressLine}</p>
                <p>
                  {defaultAddress.city}, {defaultAddress.state} -{" "}
                  <span className="font-semibold text-[#191142]">{defaultAddress.pincode}</span>
                </p>
                <p className="text-gray-500 pt-1">Phone: {defaultAddress.phone}</p>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center text-xs text-gray-500">
                No delivery address set. Add one to speed up checkout.
              </div>
            )}
          </div>

          <Link
            to="/addresses"
            className="w-full py-2 px-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-center text-[#191142] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View All Saved Addresses</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </Link>
        </div>

        {/* Sleep Club Membership & Language Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-[#0ea9df] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#191142]">Sleep Club Membership</h3>
                  <p className="text-[11px] text-gray-500">Member benefits and preferences</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5 p-3 rounded-xl bg-gray-50 border border-gray-200/80 text-gray-700">
                <p className="font-semibold text-[#191142] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0ea9df]" /> 100-Night Risk-Free Sleep Trial
                </p>
                <p className="font-semibold text-[#191142] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0ea9df]" /> 10-Year Comprehensive Warranty
                </p>
                <p className="font-semibold text-[#191142] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0ea9df]" /> Free Doorstep Shipping Across India
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200/80">
                <div>
                  <span className="font-semibold text-[#191142] block">Language</span>
                  <span className="text-[11px] text-gray-500">
                    {language === "ta" ? "தமிழ் (Tamil)" : "English (EN)"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      language === "en"
                        ? "bg-[#0ea9df] text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("ta")}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      language === "ta"
                        ? "bg-[#0ea9df] text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full py-2 px-3 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-xs font-semibold text-center text-red-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>

      {/* 4. Interactive Return & Exchange Modal */}
      {returnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#0ea9df]" />
                <h3 className="text-base font-bold text-[#191142]">
                  Initiate Return / Exchange
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReturnModalOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {returnSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#191142]">
                  Return Request Registered
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Our Buddy Sleep logistics team will contact you within 24 hours to schedule free doorstep pickup and initiate your 100% refund.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmReturn} className="space-y-4 pt-4">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs">
                  <span className="text-gray-500 block">Order ID:</span>
                  <span className="font-mono font-bold text-[#191142]">
                    #{selectedOrderForReturn.id}
                  </span>
                  <span className="text-gray-500 block mt-1">Total Paid:</span>
                  <span className="font-bold text-[#191142]">
                    ₹{selectedOrderForReturn.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191142] mb-1.5">
                    Reason for Return / Replacement
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 text-[#191142] focus:outline-none focus:border-[#0ea9df]"
                  >
                    <option value="Too firm / comfort preference">Too firm / comfort preference</option>
                    <option value="Too soft / need extra orthopedic support">Too soft / need extra orthopedic support</option>
                    <option value="Need different size (King / Queen / Single)">Need different size (King / Queen / Single)</option>
                    <option value="Damage during shipping / packaging issue">Damage during shipping / packaging issue</option>
                    <option value="Other / 100-Night Trial Exercise">Other / 100-Night Trial Exercise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191142] mb-1.5">
                    Additional Feedback (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="Tell us about your sleep experience or request a replacement size..."
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 text-[#191142] focus:outline-none focus:border-[#0ea9df] resize-none"
                  />
                </div>

                <div className="bg-cyan-50/70 border border-cyan-200/80 rounded-xl p-3 text-[11px] text-cyan-900 leading-relaxed">
                  <strong>Zero-Cost Pickup:</strong> You do not need to pack the mattress in original plastic. Our logistics partner will bring industrial protective mattress bags.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setReturnModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Return Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
