import { useState, useEffect, useMemo } from "react";
import { orderService } from "../../services/order.service";
import Loader from "../../components/common/Loader";
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Navigation,
  MapPin,
  XCircle,
  ShoppingBag,
  Search,
  RefreshCw,
  Check,
  Filter,
  ArrowRight,
  Layers,
  Table as TableIcon,
} from "lucide-react";

export interface OrderItem {
  name?: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items?: OrderItem[];
}

// Order fulfillment lifecycle stages
export const FULFILLMENT_STEPS = [
  { id: "PAID", label: "Placed / Paid", icon: Clock, color: "blue", shortDesc: "Payment verified" },
  { id: "PACKING", label: "Packing", icon: Package, color: "amber", shortDesc: "Items packaging & QC" },
  { id: "DISPATCHED", label: "Dispatched", icon: Truck, color: "indigo", shortDesc: "Handed to courier" },
  { id: "ON_THE_WAY", label: "On the Way", icon: Navigation, color: "purple", shortDesc: "In transit to hub" },
  { id: "ARRIVING_TODAY", label: "Arriving Today", icon: MapPin, color: "sky", shortDesc: "Out for final delivery" },
  { id: "DELIVERED", label: "Delivered", icon: CheckCircle2, color: "emerald", shortDesc: "Completed" },
];

export const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  PENDING: { label: "Payment Pending", bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", icon: Clock },
  PAID: { label: "Order Placed", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: Clock },
  PACKING: { label: "Packing", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-300", icon: Package },
  DISPATCHED: { label: "Dispatched", bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-300", icon: Truck },
  SHIPPED: { label: "Dispatched", bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-300", icon: Truck },
  ON_THE_WAY: { label: "On the Way", bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-300", icon: Navigation },
  ARRIVING_TODAY: { label: "Arriving Today", bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-300", icon: MapPin },
  DELIVERED: { label: "Delivered", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-300", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: XCircle },
};

export default function OrdersManage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<{ id: string; msg: string } | null>(null);

  // Filters & Views
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const loadOrders = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await orderService.allOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load all orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      const statusName = STATUS_CONFIG[newStatus]?.label || newStatus;
      setSuccessToast({
        id: orderId,
        msg: `Order updated to "${statusName}" live!`,
      });

      setTimeout(() => {
        setSuccessToast(null);
      }, 3500);
    } catch (err) {
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Status index for fulfillment pipeline
  const getStepIndex = (status: string): number => {
    if (status === "SHIPPED") status = "DISPATCHED";
    if (status === "PENDING") return 0;
    const idx = FULFILLMENT_STEPS.findIndex((s) => s.id === status);
    return idx === -1 ? 0 : idx;
  };

  // Next recommended action
  const getNextStatus = (currentStatus: string): string | null => {
    const map: Record<string, string> = {
      PENDING: "PAID",
      PAID: "PACKING",
      PACKING: "DISPATCHED",
      SHIPPED: "ON_THE_WAY",
      DISPATCHED: "ON_THE_WAY",
      ON_THE_WAY: "ARRIVING_TODAY",
      ARRIVING_TODAY: "DELIVERED",
    };
    return map[currentStatus] || null;
  };

  // Counts by status
  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: orders.length };
    orders.forEach((o) => {
      let st = o.status;
      if (st === "SHIPPED") st = "DISPATCHED";
      c[st] = (c[st] || 0) + 1;
    });
    return c;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Status filter
      let st = o.status;
      if (st === "SHIPPED") st = "DISPATCHED";
      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "PAID"
          ? st === "PAID" || st === "PENDING"
          : st === statusFilter;

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        (o.userName || "").toLowerCase().includes(q) ||
        (o.userEmail || "").toLowerCase().includes(q) ||
        o.items?.some((it) => (it.name || "").toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  if (loading) return <Loader text="Loading orders and live shipment status..." />;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#191142] flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-[#0ea9df]" />
            Live Order & Shipment Tracking
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Update order fulfillment status live: Packing, Dispatched, On the Way, and Arriving Today
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewMode === "cards"
                  ? "bg-white text-[#191142] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-white text-[#191142] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => loadOrders(false)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer shadow-2xs"
            title="Refresh orders ledger"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gray-500 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Global Success Notification Toast */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-between gap-3 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast.msg}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-sm px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Status Filter Cards / Tabs (Smooth horizontal touch swipe on mobile, grid on desktop) */}
      <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2 overflow-x-auto scrollbar-none pb-1.5 sm:pb-0 -mx-1 px-1">
        <button
          type="button"
          onClick={() => setStatusFilter("ALL")}
          className={`shrink-0 w-28 sm:w-auto p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "ALL"
              ? "border-[#191142] bg-[#191142] text-white shadow-sm"
              : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">All Orders</div>
          <div className="text-lg font-extrabold mt-0.5">{counts.ALL || 0}</div>
        </button>

        {FULFILLMENT_STEPS.map((step) => {
          const count = counts[step.id] || 0;
          const isSelected = statusFilter === step.id;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setStatusFilter(step.id)}
              className={`shrink-0 w-28 sm:w-auto p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-[#0ea9df] bg-[#0ea9df] text-white shadow-sm"
                  : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 truncate">
                  {step.label}
                </span>
                <Icon className="w-3 h-3 opacity-70 shrink-0" />
              </div>
              <div className="text-lg font-extrabold mt-0.5">{count}</div>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setStatusFilter("CANCELLED")}
          className={`shrink-0 w-28 sm:w-auto p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            statusFilter === "CANCELLED"
              ? "border-red-600 bg-red-600 text-white shadow-sm"
              : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Cancelled</span>
            <XCircle className="w-3 h-3 opacity-70 shrink-0" />
          </div>
          <div className="text-lg font-extrabold mt-0.5">{counts.CANCELLED || 0}</div>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-200 shadow-2xs">
        <Search className="w-4 h-4 text-gray-400 shrink-0 ml-1.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Order ID, Buyer name, email, or item name..."
          className="flex-1 text-xs text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-gray-400 hover:text-gray-600 px-2 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Orders List / Content */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-300" />
          <p className="text-base font-bold text-gray-800">No orders match the current filter</p>
          <p className="text-xs text-gray-500">
            {searchQuery || statusFilter !== "ALL"
              ? "Try resetting filters or search terms."
              : "No customer orders have been placed yet."}
          </p>
          {(searchQuery || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setSearchQuery("");
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#191142] text-white text-xs font-semibold hover:bg-[#0ea9df] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        /* CARDS VIEW WITH VISUAL STEPPER AND ONE-CLICK LIVE UPDATE BUTTONS */
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const currentStatus = order.status === "SHIPPED" ? "DISPATCHED" : order.status;
            const statusMeta = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.PENDING;
            const currentStepIdx = getStepIndex(currentStatus);
            const nextStatus = getNextStatus(currentStatus);
            const isCancelled = currentStatus === "CANCELLED";
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 shadow-xs transition-all duration-200"
              >
                {/* Card Header: Order ID, Buyer, Date, Total Amount */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-sm text-[#191142]">
                        #{order.id.slice(0, 16)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                      >
                        <statusMeta.icon className="w-3 h-3" />
                        {statusMeta.label}
                      </span>
                      {isUpdating && (
                        <span className="text-[10px] text-[#0ea9df] font-bold animate-pulse flex items-center gap-1">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Saving live...
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3 pt-0.5">
                      <span className="font-semibold text-gray-900">{order.userName || "Customer"}</span>
                      <span>•</span>
                      <span>{order.userEmail}</span>
                      <span>•</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-[#191142]">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      {order.items?.reduce((acc, it) => acc + (it.quantity || 1), 0) || 1} Item(s)
                    </div>
                  </div>
                </div>

                {/* VISUAL SHIPMENT TRACKER TIMELINE (Interactive: Admin can click any stage) */}
                {!isCancelled ? (
                  <div className="py-5">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Live Fulfillment Pipeline</span>
                      <span className="text-[11px] text-gray-400 font-normal normal-case">
                        Click any step to set status directly
                      </span>
                    </div>

                    {/* Stepper Bar (Horizontally scrollable on small mobile screens to prevent squishing) */}
                    <div className="overflow-x-auto scrollbar-none py-2 -mx-1 px-1">
                      <div className="relative flex items-center justify-between min-w-[500px] sm:min-w-0 sm:w-full">
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 -z-0">
                          <div
                            className="h-full bg-[#0ea9df] transition-all duration-300"
                            style={{
                              width: `${(currentStepIdx / (FULFILLMENT_STEPS.length - 1)) * 100}%`,
                            }}
                          />
                        </div>

                      {/* Steps */}
                      {FULFILLMENT_STEPS.map((step, idx) => {
                        const isCompleted = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        const StepIcon = step.icon;

                        return (
                          <button
                            key={step.id}
                            type="button"
                            onClick={() => handleStatusChange(order.id, step.id)}
                            disabled={isUpdating}
                            title={`Set status to ${step.label}`}
                            className="group relative z-10 flex flex-col items-center focus:outline-none cursor-pointer"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                                isCurrent
                                  ? "bg-[#191142] border-[#0ea9df] text-white ring-4 ring-[#0ea9df]/20 scale-110 shadow-sm"
                                  : isCompleted
                                  ? "bg-[#0ea9df] border-[#0ea9df] text-white shadow-2xs"
                                  : "bg-white border-gray-300 text-gray-400 group-hover:border-gray-400 group-hover:text-gray-600"
                              }`}
                            >
                              {isCompleted && !isCurrent ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : (
                                <StepIcon className="w-4 h-4" />
                              )}
                            </div>

                            <span
                              className={`text-[11px] font-bold mt-1.5 transition-colors ${
                                isCurrent
                                  ? "text-[#191142]"
                                  : isCompleted
                                  ? "text-[#0ea9df]"
                                  : "text-gray-400 group-hover:text-gray-600"
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="hidden sm:block text-[9px] text-gray-400 mt-0.5 max-w-[70px] text-center truncate">
                              {step.shortDesc}
                            </span>
                          </button>
                        );
                      })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 my-2 px-4 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-red-600" />
                      This order has been cancelled.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(order.id, "PAID")}
                      className="text-xs font-bold text-red-700 hover:text-red-900 underline cursor-pointer"
                    >
                      Re-activate as Paid
                    </button>
                  </div>
                )}

                {/* QUICK ACTION BUTTONS BAR */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  {/* Left: Next recommended action button */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 mr-1">Quick Update:</span>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(order.id, "PACKING")}
                      disabled={isUpdating || currentStatus === "PACKING"}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        currentStatus === "PACKING"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-white hover:bg-amber-50 text-gray-700 hover:text-amber-800 border border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <Package className="w-3.5 h-3.5 text-amber-600" />
                      <span>Packing</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(order.id, "DISPATCHED")}
                      disabled={isUpdating || currentStatus === "DISPATCHED"}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        currentStatus === "DISPATCHED"
                          ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                          : "bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-800 border border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Dispatched</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(order.id, "ON_THE_WAY")}
                      disabled={isUpdating || currentStatus === "ON_THE_WAY"}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        currentStatus === "ON_THE_WAY"
                          ? "bg-purple-100 text-purple-800 border border-purple-300"
                          : "bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-800 border border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <Navigation className="w-3.5 h-3.5 text-purple-600" />
                      <span>On the Way</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(order.id, "ARRIVING_TODAY")}
                      disabled={isUpdating || currentStatus === "ARRIVING_TODAY"}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        currentStatus === "ARRIVING_TODAY"
                          ? "bg-sky-100 text-sky-800 border border-sky-300"
                          : "bg-white hover:bg-sky-50 text-gray-700 hover:text-sky-800 border border-gray-200 hover:border-sky-300"
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5 text-sky-600" />
                      <span>Arriving Today</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(order.id, "DELIVERED")}
                      disabled={isUpdating || currentStatus === "DELIVERED"}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        currentStatus === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Delivered</span>
                    </button>
                  </div>

                  {/* Right: Dropdown Selector for all statuses */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-medium">All Statuses:</span>
                    <select
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 bg-white hover:border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#191142]/10 cursor-pointer shadow-2xs"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="PACKING">PACKING</option>
                      <option value="DISPATCHED">DISPATCHED</option>
                      <option value="ON_THE_WAY">ON_THE_WAY</option>
                      <option value="ARRIVING_TODAY">ARRIVING_TODAY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                {/* Items in order preview */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-2 text-[11px] text-gray-600">
                    <span className="font-semibold text-gray-400">Items:</span>
                    {order.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-gray-50 border border-gray-200/60 font-medium"
                      >
                        {item.name || item.productId.slice(0, 10)} (Qty: {item.quantity})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW (Compact overview) */
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/80 text-gray-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Order / Buyer</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Live Tracking Status</th>
                  <th className="p-3.5">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredOrders.map((order) => {
                  const currentStatus = order.status === "SHIPPED" ? "DISPATCHED" : order.status;
                  const statusMeta = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.PENDING;
                  const nextStatus = getNextStatus(currentStatus);
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="p-3.5">
                        <p className="font-mono font-bold text-[#191142]">
                          #{order.id.slice(0, 14)}...
                        </p>
                        <p className="font-semibold text-gray-900 mt-0.5">
                          {order.userName || "Customer"}
                        </p>
                        <p className="text-[11px] text-gray-400">{order.userEmail}</p>
                      </td>

                      <td className="p-3.5">
                        <div className="space-y-0.5 max-w-[220px]">
                          {order.items?.map((item, i) => (
                            <div key={i} className="text-gray-700 truncate text-[11px]">
                              • <span className="font-medium">{item.name || item.productId.slice(0, 8)}</span> (Qty: {item.quantity})
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="p-3.5 font-bold text-[#191142] text-sm">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </td>

                      <td className="p-3.5 text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="p-3.5">
                        <select
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#191142]/10 cursor-pointer ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="PACKING">PACKING</option>
                          <option value="DISPATCHED">DISPATCHED</option>
                          <option value="ON_THE_WAY">ON_THE_WAY</option>
                          <option value="ARRIVING_TODAY">ARRIVING_TODAY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="p-3.5">
                        {nextStatus ? (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, nextStatus)}
                            disabled={isUpdating}
                            className="px-2.5 py-1 rounded-md bg-[#191142] hover:bg-[#0ea9df] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                          >
                            <span>Mark {STATUS_CONFIG[nextStatus]?.label || nextStatus}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
