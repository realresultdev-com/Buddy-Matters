import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { Package, Shield, MapPin, CreditCard, User, LogOut, ShieldAlert } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const accountCards = [
    {
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      icon: Package,
      to: "/orders",
    },
    {
      title: "Login & Security",
      desc: "Edit login, name, and role credentials",
      icon: Shield,
      to: "/profile",
    },
    {
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      icon: MapPin,
      to: "/addresses",
    },
    {
      title: "Payment Options",
      desc: "Edit or add payment methods & Razorpay",
      icon: CreditCard,
      to: "/profile",
    },
    {
      title: "Your Profile",
      desc: "Manage and update your public persona",
      icon: User,
      to: "/profile",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="border-b border-gray-300 pb-3">
        <h1 className="text-2xl font-normal text-[#0f1111]">Your Account</h1>
        <p className="text-xs text-gray-500 mt-0.5">Signed in as {user.name} ({user.email})</p>
      </div>

      {/* Grid of Amazon Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {accountCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.to}
              className="bg-white border border-gray-300 rounded-lg p-4 flex gap-4 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="p-2.5 rounded-full bg-gray-100 text-gray-700 shrink-0 h-fit">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f1111] leading-snug">{card.title}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{card.desc}</p>
              </div>
            </Link>
          );
        })}

        {user.role === "ADMIN" && (
          <Link
            to="/admin"
            className="bg-[#fcf5ee] border border-amazon-orange rounded-lg p-4 flex gap-4 hover:bg-[#faebd7] transition-colors shadow-sm"
          >
            <div className="p-2.5 rounded-full bg-amber-100 text-amber-800 shrink-0 h-fit">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 leading-snug">Admin Console</h3>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Manage D1 products, orders & user directory
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Sign Out Button */}
      <div className="pt-4">
        <button
          onClick={logout}
          className="flex items-center gap-2 py-2 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-red-600 shadow-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out of All Sessions
        </button>
      </div>
    </div>
  );
}
