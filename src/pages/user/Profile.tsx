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
  MapPin,
  LogOut,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  X,
  Send,
  ShoppingCart,
  ShieldCheck,
  Globe,
  Sparkles,
  HelpCircle,
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

  // 100-Night Trial Info modal state
  const [trialModalOpen, setTrialModalOpen] = useState(false);

  useEffect(() => {
    // Load user orders
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

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    PAID: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    PACKING: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
    DISPATCHED: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
    SHIPPED: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
    ON_THE_WAY: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
    ARRIVING_TODAY: { bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200" },
    DELIVERED: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    PENDING: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
    CANCELLED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 pb-24 lg:pb-12">
      {/* 1. Clean, Minimalist Profile Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* User Details */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 font-bold text-xl sm:text-2xl shadow-2xs shrink-0 overflow-hidden">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                user.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-[#0f1111] truncate">
                  {user.name}
                </h1>
                {user.role === "ADMIN" && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
            {user.role === "ADMIN" && (
              <Link
                to="/admin"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold border border-gray-300 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Seller Central</span>
              </Link>
            )}

            <button
              type="button"
              onClick={logout}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("signOut")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Amazon "Your Account" Clean Action Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Your Orders */}
        <Link
          to="/orders"
          className="group p-4 bg-white border border-gray-200 hover:border-[#0ea9df] rounded-2xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111] group-hover:text-[#0ea9df] transition-colors">
                Your Orders
              </h2>
              <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                Track shipments, view invoices, or return items
              </p>
            </div>
          </div>
          <div className="pt-3 flex items-center text-xs font-semibold text-[#0ea9df] group-hover:translate-x-0.5 transition-transform">
            <span>{orders.length} order(s)</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </Link>

        {/* Your Addresses */}
        <Link
          to="/addresses"
          className="group p-4 bg-white border border-gray-200 hover:border-[#0ea9df] rounded-2xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111] group-hover:text-[#0ea9df] transition-colors">
                Your Addresses
              </h2>
              <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                Edit shipping destinations for fast checkout
              </p>
            </div>
          </div>
          <div className="pt-3 flex items-center text-xs font-semibold text-[#0ea9df] group-hover:translate-x-0.5 transition-transform">
            <span>Manage</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </Link>

        {/* Shopping Cart */}
        <Link
          to="/cart"
          className="group p-4 bg-white border border-gray-200 hover:border-[#0ea9df] rounded-2xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111] group-hover:text-[#0ea9df] transition-colors">
                Shopping Cart
              </h2>
              <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                Review items ready for checkout
              </p>
            </div>
          </div>
          <div className="pt-3 flex items-center text-xs font-semibold text-[#0ea9df] group-hover:translate-x-0.5 transition-transform">
            <span>View cart</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </Link>

        {/* 100-Night Home Trial */}
        <button
          type="button"
          onClick={() => setTrialModalOpen(true)}
          className="group p-4 bg-white border border-gray-200 hover:border-[#0ea9df] rounded-2xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between text-left cursor-pointer"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0ea9df] group-hover:scale-105 transition-transform">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111] group-hover:text-[#0ea9df] transition-colors">
                100-Night Trial
              </h2>
              <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                Zero-risk home sleep trial &amp; warranty details
              </p>
            </div>
          </div>
          <div className="pt-3 flex items-center text-xs font-semibold text-[#0ea9df] group-hover:translate-x-0.5 transition-transform">
            <span>Policy info</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </button>

        {/* Language Switcher */}
        <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0f1111]">Language / மொழி</h2>
              <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                Choose English or தமிழ்
              </p>
            </div>
          </div>
          <div className="pt-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === "en"
                  ? "bg-[#191142] text-white shadow-2xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("ta")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === "ta"
                  ? "bg-[#191142] text-white shadow-2xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        {/* Admin Portal Tile (Only if user is ADMIN) */}
        {user.role === "ADMIN" && (
          <Link
            to="/admin"
            className="group p-4 bg-white border border-amber-200 hover:border-amber-400 rounded-2xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0f1111] group-hover:text-amber-800 transition-colors">
                  Seller Central
                </h2>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                  Manage inventory, orders &amp; product catalog
                </p>
              </div>
            </div>
            <div className="pt-3 flex items-center text-xs font-semibold text-amber-700 group-hover:translate-x-0.5 transition-transform">
              <span>Open dashboard</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </Link>
        )}
      </div>

      {/* 3. Recent Orders & Tracking Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#0f1111]">Your Recent Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review placed orders, live shipment status, and invoices
            </p>
          </div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0ea9df] hover:underline"
          >
            <span>View all orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingOrders ? (
          <div className="py-8 text-center text-xs text-gray-400">
            Loading recent orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto text-gray-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">No orders placed yet</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Every purchase comes with our risk-free 100-night home trial.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border border-[#fcd200] text-xs font-bold shadow-xs transition-all"
            >
              <span>Explore Mattresses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => {
              const statusCfg = statusColors[order.status] || {
                bg: "bg-gray-100",
                text: "text-gray-700",
                border: "border-gray-200",
              };

              return (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#0f1111]">
                        #{order.id.slice(0, 10).toUpperCase()}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
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
                      <span className="mx-1.5 text-gray-300">•</span>
                      <span className="font-bold text-[#0f1111]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Eligible for 100-Night Home Trial
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleOpenReturnModal(order)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                    >
                      Return / Replace
                    </button>
                    <Link
                      to="/orders"
                      className="px-3 py-1.5 rounded-lg bg-[#0f1111] hover:bg-[#232f3e] text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
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
      </div>

      {/* 4. Default Delivery Address Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-bold text-[#0f1111]">Default Delivery Address</h2>
          </div>
          <Link
            to="/addresses"
            className="text-xs font-bold text-[#0ea9df] hover:underline"
          >
            Manage Addresses
          </Link>
        </div>

        {defaultAddress ? (
          <div className="text-xs text-gray-700 space-y-0.5">
            <p className="font-bold text-[#0f1111]">{defaultAddress.name}</p>
            <p>{defaultAddress.addressLine}</p>
            <p>
              {defaultAddress.city}, {defaultAddress.state} -{" "}
              <span className="font-semibold text-gray-900">{defaultAddress.pincode}</span>
            </p>
            <p className="text-gray-500 pt-1">Phone: {defaultAddress.phone}</p>
          </div>
        ) : (
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <span>No default shipping address configured yet.</span>
            <Link
              to="/addresses"
              className="text-xs font-semibold text-[#0ea9df] hover:underline"
            >
              + Add Address
            </Link>
          </div>
        )}
      </div>

      {/* 5. Return & Exchange Request Modal */}
      {returnModalOpen && selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#0ea9df]" />
                <h3 className="text-base font-bold text-[#0f1111]">
                  Initiate Return / Replacement
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
                <h4 className="text-base font-bold text-[#0f1111]">
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
                  <span className="font-mono font-bold text-[#0f1111]">
                    #{selectedOrderForReturn.id}
                  </span>
                  <span className="text-gray-500 block mt-1">Total Paid:</span>
                  <span className="font-bold text-[#0f1111]">
                    ₹{selectedOrderForReturn.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f1111] mb-1.5">
                    Reason for Return / Replacement
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 text-[#0f1111] focus:outline-none focus:border-[#0ea9df]"
                  >
                    <option value="Too firm / comfort preference">Too firm / comfort preference</option>
                    <option value="Too soft / need extra orthopedic support">Too soft / need extra orthopedic support</option>
                    <option value="Need different size (King / Queen / Single)">Need different size (King / Queen / Single)</option>
                    <option value="Damage during shipping / packaging issue">Damage during shipping / packaging issue</option>
                    <option value="Other / 100-Night Trial Exercise">Other / 100-Night Trial Exercise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0f1111] mb-1.5">
                    Additional Feedback (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="Tell us about your sleep experience or request a replacement size..."
                    className="w-full text-xs border border-gray-300 rounded-lg p-2.5 text-[#0f1111] focus:outline-none focus:border-[#0ea9df] resize-none"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-900 leading-relaxed">
                  <strong>Zero-Cost Doorstep Pickup:</strong> You do not need to pack the mattress into original cardboard boxes. Our courier partner brings dedicated protective mattress packaging.
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
                    className="px-4 py-2 rounded-xl bg-[#0f1111] hover:bg-[#232f3e] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. 100-Night Trial Info Modal */}
      {trialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#0ea9df]" />
                <h3 className="text-base font-bold text-[#0f1111]">
                  100-Night Risk-Free Home Trial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setTrialModalOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <p>
                We believe your body requires at least 3 to 4 weeks to adjust to the orthopedic support of a high-density memory foam mattress.
              </p>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                <p className="font-bold text-gray-900">How it works:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Sleep on your Buddy Mattress for up to 100 nights in your home.</li>
                  <li>If you are not 100% satisfied with the comfort, initiate a return from your profile.</li>
                  <li>We provide 100% free doorstep pickup and full refund to your original payment method.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setTrialModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0f1111] text-white text-xs font-bold hover:bg-[#232f3e] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
