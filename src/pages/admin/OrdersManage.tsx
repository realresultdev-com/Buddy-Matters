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
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review, fulfill, and update shipment status for customer orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-300 rounded-lg p-12 text-center space-y-3 shadow-xs">
          <ShoppingBag className="w-10 h-10 mx-auto text-gray-400" />
          <p className="text-sm font-medium text-gray-600">No customer orders placed yet</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-300 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-100 text-gray-700 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Order / Buyer</th>
                  <th className="p-3.5">Items Ordered</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-mono font-bold text-amazon-blue hover:underline cursor-pointer">
                        #{order.id.slice(0, 14)}...
                      </p>
                      <p className="font-semibold text-gray-900 mt-0.5">{order.userName || "Customer"}</p>
                      <p className="text-[11px] text-gray-500">{order.userEmail}</p>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1 max-w-[240px]">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="text-gray-700 truncate text-[11px]">
                            • <span className="font-medium text-gray-900">{item.name || item.productId.slice(0, 8)}</span> (Qty: {item.quantity})
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 font-bold text-gray-900 text-sm">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="p-3.5 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="p-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded text-xs font-bold border shadow-xs focus:outline-none focus:ring-2 focus:ring-amazon-yellow ${
                          order.status === "PAID"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : order.status === "SHIPPED"
                            ? "border-blue-500 bg-blue-50 text-blue-800"
                            : order.status === "DELIVERED"
                            ? "border-teal-500 bg-teal-50 text-teal-800"
                            : order.status === "CANCELLED"
                            ? "border-red-500 bg-red-50 text-red-800"
                            : "border-amber-500 bg-amber-50 text-amber-800"
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
