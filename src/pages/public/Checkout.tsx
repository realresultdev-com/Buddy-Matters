import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { orderService } from "../../services/order.service";
import { paymentService } from "../../services/payment.service";
import { Lock, ShieldCheck, AlertCircle } from "lucide-react";

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
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">Sign in to Checkout</h2>
        <p className="text-xs text-gray-600">Please sign in to proceed with your address and payment.</p>
        <Link
          to="/login?redirect=/checkout"
          className="inline-block py-2 px-6 rounded-lg bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#a88734] font-semibold text-xs text-gray-900"
        >
          Sign in to your account
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white border border-gray-200 p-8 shadow-sm">
        <p className="text-gray-800 text-sm">Your cart is empty.</p>
        <Link
          to="/"
          className="inline-block py-2 px-6 rounded-lg bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#a88734] font-semibold text-xs text-gray-900"
        >
          Continue Shopping
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

      if (typeof window.Razorpay !== "undefined" && !razorpayKeyId.includes("mock")) {
        const options = {
          key: razorpayKeyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency || "INR",
          name: "Amazon.in (Lumina)",
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
            color: "#febd69",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Mock payment flow
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
        }, 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Amazon Minimalist Checkout Header */}
      <div className="flex items-center justify-between border-b border-gray-300 pb-3">
        <Link to="/" className="flex flex-col items-start leading-none">
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            amazon<span className="text-amazon-orange text-sm font-bold ml-0.5">.in</span>
          </span>
        </Link>
        <div className="flex items-center gap-1.5 text-gray-600 text-sm font-semibold">
          <Lock className="w-4 h-4 text-gray-500" />
          <span>Checkout</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3 Accordion Steps (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Step 1: Address */}
          <div className="bg-white border border-gray-300 p-5 rounded-md space-y-4">
            <h2 className="text-base font-bold text-[#0f1111] flex items-center justify-between">
              <span>1. Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Full name</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Mobile number</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">Flat, House no., Building, Street</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Town / City</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-400 rounded focus:border-amazon-orange focus:ring-1 focus:ring-amazon-orange outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment */}
          <div className="bg-white border border-gray-300 p-5 rounded-md space-y-3">
            <h2 className="text-base font-bold text-[#0f1111]">2. Payment Method</h2>
            <div className="border border-amazon-orange bg-[#fcf5ee] p-3 rounded text-xs space-y-1">
              <span className="font-bold text-gray-900 block">Razorpay Gateway (All payment options)</span>
              <p className="text-gray-600">Supports UPI (GPay, PhonePe), Credit/Debit Cards, NetBanking, and Wallets.</p>
            </div>
          </div>

          {/* Step 3: Items review */}
          <div className="bg-white border border-gray-300 p-5 rounded-md space-y-3">
            <h2 className="text-base font-bold text-[#0f1111]">3. Review Items and Delivery</h2>
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.productId} className="py-2 flex justify-between items-center text-xs">
                  <span className="text-gray-900 font-medium">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sticky (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-300 p-5 rounded-md shadow-sm space-y-4">
          <button
            type="submit"
            disabled={processing}
            className="w-full py-2.5 px-4 rounded-full bg-amazon-btnYellow hover:bg-amazon-btnYellowHover border border-[#fcd200] font-medium text-xs text-[#0f1111] shadow-sm transition-colors"
          >
            {processing ? "Processing Order..." : "Place Your Order and Pay"}
          </button>

          <p className="text-[11px] text-gray-500 text-center leading-tight">
            By placing your order, you agree to Amazon's privacy notice and conditions of use.
          </p>

          <div className="border-t border-gray-200 pt-3 space-y-2 text-xs">
            <h3 className="font-bold text-sm text-gray-900 mb-2">Order Summary</h3>
            <div className="flex justify-between text-gray-600">
              <span>Items:</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery:</span>
              <span className="text-[#007600] font-semibold">₹0.00</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-[#b12704]">
              <span>Order Total:</span>
              <span>₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
