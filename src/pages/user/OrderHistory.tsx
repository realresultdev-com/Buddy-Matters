import { useState, useEffect } from "react";
import { orderService } from "../../services/order.service";
import type { Order } from "../../types/order.types";
import Loader from "../../components/common/Loader";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowRight } from "lucide-react";

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.myOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load user orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> Paid
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Pending Payment
          </span>
        );
    }
  };

  if (loading) return <Loader text="Fetching your orders..." />;

  if (orders.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Package className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white">No orders yet</h2>
        <p className="text-xs text-slate-400">When you complete a purchase, your order history appears here.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Order History</h1>
        <p className="text-xs text-slate-400 mt-1">Review status and receipts for your past purchases</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[11px] text-slate-400">Order ID</span>
                <p className="font-mono text-xs font-semibold text-white">{order.id}</p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400">Date</span>
                <p className="text-xs text-slate-300">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>{getStatusBadge(order.status)}</div>
            </div>

            {/* Items in order */}
            <div className="space-y-2">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">
                    {item.name || `Product #${item.productId.slice(0, 8)}`} × {item.quantity}
                  </span>
                  <span className="font-medium text-white">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Paid</span>
              <span className="text-sm font-bold text-white">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
