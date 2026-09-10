import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { orderService } from "../../services/order.service";
import { paymentService } from "../../services/payment.service";
import { ShieldCheck, Lock, CreditCard, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "9876543210",
    street: "123 Silicon Boulevard, 4th Floor",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Authentication Required</h2>
        <p className="text-xs text-slate-400">Please sign in to proceed with checkout and order tracking.</p>
        <Link
          to="/login?redirect=/checkout"
          className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30"
        >
          Sign In to Checkout
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <p className="text-slate-400 text-sm">Your cart is empty. Add items before checking out.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // 1. Create order on Cloudflare D1
      const orderRes = await orderService.createFromCart(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      );
      const order = orderRes.data;

      // 2. Create Razorpay order on edge
      const paymentOrderRes = await paymentService.createOrder(order.totalAmount);
      const razorpayOrder = paymentOrderRes.data;

      const razorpayKeyId =
        import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mockkey123";

      // 3. Check if Razorpay SDK is available in window
      if (typeof window.Razorpay !== "undefined" && !razorpayKeyId.includes("mock")) {
        const options = {
          key: razorpayKeyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || "INR",
          name: "Lumina Store",
          description: `Order #${order.id.slice(0, 8)}`,
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            try {
              await paymentService.verify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.id,
              });
              clearCart();
              navigate(`/order-success?orderId=${order.id}`);
            } catch (err: any) {
              setError("Payment verification failed on server: " + (err.message || "Unknown error"));
              setProcessing(false);
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            email: shippingAddress.email,
            contact: shippingAddress.phone,
          },
          theme: {
            color: "#4f46e5",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp: any) {
          setError(`Payment Failed: ${resp.error.description}`);
          setProcessing(false);
        });
        rzp.open();
      } else {
        // Mock payment flow for local dev or demo when test keys aren't provisioned yet
        console.log("Mock Payment Triggered for Order:", order.id);
        setTimeout(async () => {
          try {
            await paymentService.verify({
              razorpay_order_id: razorpayOrder.id || `order_mock_${Date.now()}`,
              razorpay_payment_id: `pay_mock_${Date.now()}`,
              razorpay_signature: "mock_signature_verified",
              orderId: order.id,
            });
            clearCart();
            navigate(`/order-success?orderId=${order.id}`);
          } catch (err: any) {
            setError(err.response?.data?.message || "Verification failed");
            setProcessing(false);
          }
        }, 1200);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link to="/cart" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Express Checkout</h1>
          <p className="text-xs text-slate-400">Order verification & Razorpay edge gateway</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                1
              </span>
              Shipping Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Postal Code (PIN)</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                2
              </span>
              Payment Method
            </h2>
            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Razorpay Checkout</p>
                  <p className="text-[11px] text-slate-400">UPI, Cards, NetBanking, Wallets</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Order Review Sidebar */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white">Order Review</h3>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-xs py-1 border-b border-slate-800/60">
                  <span className="text-slate-300 truncate max-w-[150px]">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-white font-medium">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="text-emerald-400">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Securing Payment...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Pay ₹{totalAmount.toLocaleString("en-IN")}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
