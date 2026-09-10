import { useState, useEffect } from "react";
import { orderService } from "../../services/order.service";
import type { Order } from "../../types/order.types";
import Loader from "../../components/common/Loader";
import { Link } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Orders");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.myOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader text="Loading your orders..." />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Title & Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-normal text-[#0f1111]">Your Orders</h1>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search all orders"
              className="pl-9 pr-3 py-1.5 border border-gray-400 rounded text-xs bg-white text-[#0f1111] focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
            />
          </div>
          <button className="py-1.5 px-3 rounded-full bg-[#131921] hover:bg-gray-800 text-white text-xs font-semibold">
            Search Orders
          </button>
        </div>
      </div>

      {/* Tabs: Orders, Buy Again, Not Yet Shipped, Cancelled */}
      <div className="flex border-b border-gray-300 text-xs font-medium text-gray-600 gap-6">
        {["Orders", "Buy Again", "Not Yet Shipped", "Cancelled Orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 border-b-2 font-semibold transition-colors ${
              activeTab === tab
                ? "border-amazon-orange text-[#0f1111]"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Count and Filter */}
      <div className="text-xs text-gray-700">
        <span className="font-bold">{orders.length} orders</span> placed in the past 3 months
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center space-y-3">
          <p className="text-gray-800 font-semibold text-sm">You haven't placed any orders in this period.</p>
          <Link to="/" className="text-amazon-blue hover:underline text-xs font-bold inline-block">
            Start shopping today's deals
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
              {/* Order Header (#f0f2f2) */}
              <div className="bg-[#f0f2f2] border-b border-gray-300 p-4 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                  <div>
                    <span className="uppercase text-[10px] text-gray-500 font-bold block">ORDER PLACED</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="uppercase text-[10px] text-gray-500 font-bold block">TOTAL</span>
                    <span className="font-semibold text-gray-800">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div>
                    <span className="uppercase text-[10px] text-gray-500 font-bold block">SHIP TO</span>
                    <span className="font-semibold text-amazon-blue hover:underline cursor-pointer flex items-center gap-0.5">
                      Delivery Address <ChevronDown className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="uppercase text-[10px] text-gray-500 font-bold block">
                    ORDER # {order.id.slice(0, 16)}...
                  </span>
                  <div className="flex gap-2 justify-end text-amazon-blue hover:underline text-[11px] font-semibold">
                    <a href="#">View order details</a>
                    <span>|</span>
                    <a href="#">Invoice</a>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-5 space-y-4">
                {/* Delivery status */}
                <div>
                  <h3 className="text-base font-bold text-[#007600]">
                    {order.status === "PAID"
                      ? "Arriving Tomorrow by 11 AM"
                      : order.status === "DELIVERED"
                      ? "Delivered"
                      : order.status === "SHIPPED"
                      ? "Shipped"
                      : "Pending Payment Confirmation"}
                  </h3>
                  <p className="text-xs text-gray-500">Package was dispatched with Amazon Prime delivery</p>
                </div>

                {/* Items in order */}
                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"}
                          alt=""
                          className="w-16 h-16 object-contain p-1 border border-gray-200"
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-amazon-blue hover:underline cursor-pointer">
                            {item.name || `Hardware Item #${item.productId.slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Quantity: {item.quantity} | ₹{item.price.toLocaleString("en-IN")} each
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Link
                              to={`/product/${item.productId}`}
                              className="py-1 px-3 rounded-full bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#fcd200] text-[11px] font-medium text-gray-900 shadow-sm"
                            >
                              Buy it again
                            </Link>
                            <Link
                              to={`/product/${item.productId}`}
                              className="py-1 px-3 rounded-full border border-gray-300 hover:bg-gray-50 text-[11px] font-medium text-gray-900 shadow-sm"
                            >
                              View your item
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Right action button */}
                      <div className="w-full sm:w-44 space-y-1.5 shrink-0 text-xs">
                        <button className="w-full py-1.5 rounded-full border border-gray-300 hover:bg-gray-50 font-medium text-gray-900 shadow-sm">
                          Track package
                        </button>
                        <button className="w-full py-1.5 rounded-full border border-gray-300 hover:bg-gray-50 font-medium text-gray-900 shadow-sm">
                          Leave seller feedback
                        </button>
                        <button className="w-full py-1.5 rounded-full border border-gray-300 hover:bg-gray-50 font-medium text-gray-900 shadow-sm">
                          Write a product review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
