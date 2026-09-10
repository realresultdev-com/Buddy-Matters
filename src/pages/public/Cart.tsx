import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount, totalCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
          <p className="text-xs text-slate-400">Discover premium hardware curated on our edge storefront.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Shopping Cart</h1>
          <p className="text-xs text-slate-400 mt-1">
            {totalCount} item{totalCount === 1 ? "" : "s"} selected
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:border-slate-700 transition-all"
            >
              <img
                src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover bg-slate-800 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.productId}`}
                  className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>
                <div className="mt-1 text-xs text-slate-400">
                  ₹{item.price.toLocaleString("en-IN")} each
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-1 text-xs font-semibold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-white">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          ))}

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white pt-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="h-fit p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
          <h3 className="text-base font-bold text-white">Order Summary</h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal ({totalCount} items)</span>
              <span className="text-white font-medium">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Standard Edge Shipping</span>
              <span className="text-emerald-400 font-medium">FREE</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Platform / Edge Fee</span>
              <span className="text-emerald-400 font-medium">₹0</span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between text-sm">
              <span className="font-semibold text-white">Estimated Total</span>
              <span className="font-extrabold text-white text-base">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-[11px] text-slate-500 text-center">
            Encrypted checkout secured by Cloudflare SSL and Razorpay.
          </p>
        </div>
      </div>
    </div>
  );
}
