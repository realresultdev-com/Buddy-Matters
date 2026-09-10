import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount, totalCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-8 rounded-xl text-center space-y-4 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-[#191142]">Your Buddy Mattress Cart is empty.</h2>
        <p className="text-xs text-gray-600">
          Your shopping cart is waiting. Treat yourself to deeper, restorative sleep with our orthopedic mattresses and ergonomic pillows.
        </p>
        <Link
          to="/"
          className="inline-block py-2.5 px-6 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] font-bold text-xs text-white shadow-sm transition-colors"
        >
          Explore Mattresses & Pillows
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-12">
      {/* Left Column: Items in Cart (8 cols) */}
      <div className="lg:col-span-8 bg-white border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h1 className="text-2xl font-normal text-[#0f1111]">Shopping Cart</h1>
            <button
              onClick={clearCart}
              className="text-xs text-amazon-blue hover:text-amazon-linkHover hover:underline pt-1"
            >
              Deselect all items / Clear Cart
            </button>
          </div>
          <span className="text-xs text-gray-500 font-medium self-end">Price</span>
        </div>

        {/* Items list */}
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.productId} className="py-4 flex gap-4">
              {/* Product Thumbnail */}
              <Link to={`/product/${item.productId}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-white shrink-0 p-1">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </Link>

              {/* Item Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <Link
                    to={`/product/${item.productId}`}
                    className="text-sm sm:text-base font-medium text-[#0f1111] hover:text-amazon-linkHover hover:underline line-clamp-2"
                  >
                    {item.name}
                  </Link>

                  <p className="text-xs font-semibold text-[#007600] mt-1">In stock</p>
                  <p className="text-[11px] text-gray-500">Eligible for FREE Shipping</p>
                  <span className="inline-block text-[#00a8e1] font-bold italic text-xs">✓prime</span>
                </div>

                {/* Actions row: Qty select, Delete, Save for later */}
                <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1 border border-gray-300 rounded bg-gray-100 px-2 py-0.5">
                    <label htmlFor={`qty-${item.productId}`} className="text-[11px] text-gray-500">
                      Qty:
                    </label>
                    <select
                      id={`qty-${item.productId}`}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                      className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="text-gray-300">|</span>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-amazon-blue hover:text-amazon-linkHover hover:underline cursor-pointer"
                  >
                    Delete
                  </button>

                  <span className="text-gray-300">|</span>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-amazon-blue hover:text-amazon-linkHover hover:underline cursor-pointer"
                  >
                    Save for later
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <span className="text-base sm:text-lg font-bold text-[#0f1111]">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Subtotal bottom bar */}
        <div className="border-t border-gray-200 pt-4 text-right">
          <span className="text-base text-gray-800">
            Subtotal ({totalCount} item{totalCount === 1 ? "" : "s"}):{" "}
            <span className="font-bold text-lg text-[#0f1111]">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </span>
        </div>
      </div>

      {/* Right Column: Checkout Summary Box (4 cols) */}
      <div className="lg:col-span-4 bg-white border border-gray-200 p-5 shadow-sm space-y-4">
        {/* Free Delivery alert */}
        <div className="flex items-center gap-2 text-xs text-[#007600] font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Part of your order qualifies for FREE Delivery.</span>
        </div>

        {/* Subtotal */}
        <div className="text-base text-gray-800">
          Subtotal ({totalCount} item{totalCount === 1 ? "" : "s"}):{" "}
          <span className="font-bold text-lg text-[#0f1111]">
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-700">
          <input type="checkbox" id="gift" className="rounded text-amazon-orange focus:ring-0" />
          <label htmlFor="gift">This order contains a gift</label>
        </div>

        {/* Proceed to Buy Cyan Button */}
        <Link
          to="/checkout"
          className="block w-full py-3 px-4 rounded-lg bg-[#0ea9df] hover:bg-[#0c93c4] text-center font-bold text-xs text-white shadow-xs hover:shadow-md transition-all"
        >
          Proceed to Buy ({totalCount} {totalCount === 1 ? "item" : "items"})
        </Link>

        {/* EMI info */}
        <div className="border border-gray-200 rounded p-3 text-[11px] text-gray-600 bg-gray-50">
          <span className="font-bold text-gray-900">EMI Available</span>
          <p className="mt-0.5">
            Your order qualifies for EMI with select bank debit and credit cards.
          </p>
        </div>
      </div>
    </div>
  );
}
