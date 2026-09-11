import { useState, useEffect } from "react";
import { orderService } from "../../services/order.service";
import type { Order } from "../../types/order.types";
import Loader from "../../components/common/Loader";
import { Link } from "react-router-dom";
import { Search, ChevronDown, RotateCcw, Package, Truck, ArrowLeft, ExternalLink } from "lucide-react";
import { getProductUrl } from "../../utils/urlSecurity";

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.myOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader text="Loading your orders & returns..." />;

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "Not Yet Shipped") {
      return order.status === "PAID" || order.status === "PENDING";
    }
    if (activeTab === "Cancelled") {
      return order.status === "CANCELLED";
    }
    if (activeTab === "Delivered") {
      return order.status === "DELIVERED";
    }
    return true;
  }).filter((order) => {
    if (!searchTerm.trim()) return true;
    return order.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 pb-12 px-4 sm:px-6">
      {/* Breadcrumb back to profile */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/profile" className="flex items-center gap-1 hover:text-[#0ea9df] font-medium transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to User Profile
        </Link>
        <span>/</span>
        <span className="text-[#191142] font-bold">Returns & Orders</span>
      </div>

      {/* Title & Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#191142] tracking-tight">Returns & Orders</h1>
          <p className="text-xs text-gray-500 mt-1">
            Track deliveries, view past purchases, and manage 100-night trial returns
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID..."
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-xl text-xs bg-white text-[#191142] focus:border-[#0ea9df] focus:ring-1 focus:ring-[#0ea9df] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs: All Orders, Delivered, Not Yet Shipped, Cancelled */}
      <div className="flex border-b border-gray-200 text-xs font-semibold text-gray-500 gap-6 overflow-x-auto scrollbar-none">
        {["All Orders", "Delivered", "Not Yet Shipped", "Cancelled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 border-b-2 font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? "border-[#0ea9df] text-[#0ea9df]"
                : "border-transparent text-gray-500 hover:text-[#191142]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Count */}
      <div className="text-xs text-gray-600 font-medium">
        <span className="font-bold text-[#191142]">{filteredOrders.length} orders</span> found
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-cyan-50 text-[#0ea9df] flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[#191142] font-bold text-sm">No orders matching your criteria</p>
            <p className="text-xs text-gray-500 mt-1">Explore our mattresses and pillows with 100-night trial benefits.</p>
          </div>
          <Link
            to="/"
            className="inline-block py-2 px-5 rounded-xl bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold transition-colors shadow-xs"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusBadgeColors: Record<string, string> = {
              PAID: "bg-blue-50 text-blue-700 border-blue-200",
              SHIPPED: "bg-amber-50 text-amber-700 border-amber-200",
              DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
              PENDING: "bg-gray-100 text-gray-700 border-gray-200",
              CANCELLED: "bg-red-50 text-red-700 border-red-200",
            };
            const colorClass = statusBadgeColors[order.status] || "bg-gray-100 text-gray-700 border-gray-200";

            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                {/* Order Header */}
                <div className="bg-gray-50 border-b border-gray-200 p-4 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                    <div>
                      <span className="uppercase text-[10px] text-gray-400 font-bold block">ORDER PLACED</span>
                      <span className="font-semibold text-[#191142]">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="uppercase text-[10px] text-gray-400 font-bold block">TOTAL</span>
                      <span className="font-bold text-[#191142]">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div>
                      <span className="uppercase text-[10px] text-gray-400 font-bold block">STATUS</span>
                      <span className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded-full border ${colorClass}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="uppercase text-[10px] text-gray-400 font-bold block">
                      ORDER # {order.id.slice(0, 14)}...
                    </span>
                    <Link to="/profile" className="text-[#0ea9df] hover:underline text-[11px] font-bold">
                      Return or Replace Items
                    </Link>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#191142]">
                      {order.status === "PAID"
                        ? "Order Confirmed — Preparing for Dispatch"
                        : order.status === "DELIVERED"
                        ? "Delivered Successfully"
                        : order.status === "SHIPPED"
                        ? "In Transit with Buddy Logistics"
                        : order.status === "CANCELLED"
                        ? "Order Cancelled"
                        : "Processing Confirmation"}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      100-Night Sleep Trial guarantee active. Zero-cost doorstep returns & replacements.
                    </p>
                  </div>

                  {/* Items in order */}
                  <div className="space-y-3 pt-2">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-gray-100 first:border-0 first:pt-0">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.images?.[0] || "/logo-transparent.png"}
                            alt=""
                            className="w-14 h-14 object-contain p-1 rounded-lg border border-gray-200 bg-gray-50"
                          />
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-[#191142]">
                              {item.name || `Buddy Sleep Product #${item.productId.slice(0, 8)}`}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Quantity: {item.quantity} | ₹{item.price.toLocaleString("en-IN")} each
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            to={getProductUrl(item.productId)}
                            className="py-1.5 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-[#191142] transition-colors"
                          >
                            Buy Again
                          </Link>
                          <Link
                            to="/profile"
                            className="py-1.5 px-3 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] text-white text-xs font-bold transition-colors shadow-2xs"
                          >
                            Return Item
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
