import { useState, useEffect } from "react";
import { orderService } from "../../services/order.service";
import Loader from "../../components/common/Loader";
import { CheckCircle, Clock, Truck, XCircle, ShoppingBag } from "lucide-react";

export default function OrdersManage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const res = await orderService.allOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load all orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  if (loading) return <Loader text="Loading orders ledger..." />;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Customer Orders</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review, fulfill, and update shipment status for transactions stored in D1
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <ShoppingBag className="w-10 h-10 mx-auto text-slate-600" />
          <p className="text-sm font-medium text-slate-400">No orders placed yet</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Order / Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-semibold text-white">{order.id.slice(0, 14)}...</p>
                      <p className="text-slate-400 mt-0.5">{order.userName || "Customer"}</p>
                      <p className="text-[11px] text-slate-500">{order.userEmail}</p>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1 max-w-[200px]">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="text-slate-300 truncate">
                            • {item.name || item.productId.slice(0, 8)} (×{item.quantity})
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-white text-sm">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="p-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-950 focus:outline-none ${
                          order.status === "PAID"
                            ? "border-emerald-500/40 text-emerald-400"
                            : order.status === "SHIPPED"
                            ? "border-indigo-500/40 text-indigo-400"
                            : order.status === "DELIVERED"
                            ? "border-cyan-500/40 text-cyan-400"
                            : order.status === "CANCELLED"
                            ? "border-rose-500/40 text-rose-400"
                            : "border-amber-500/40 text-amber-400"
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
