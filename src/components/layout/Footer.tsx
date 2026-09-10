import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full select-none text-white text-xs">
      {/* 1. Back to top */}
      <div
        onClick={scrollToTop}
        className="bg-[#261d5e] hover:bg-[#34287d] text-white py-3.5 text-center text-xs font-bold cursor-pointer transition-colors"
      >
        Back to top
      </div>

      {/* 2. Directory Columns (Brand Navy #191142) */}
      <div className="bg-[#191142] border-b border-[#2e236b] py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-white text-sm mb-3">About Buddy Mattress</h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">Our Ergonomic Story</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">100-Night Home Trial</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">10-Year Warranty Guide</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">Orthopedic Spine Research</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Sleep Collections</h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">Orthopedic Memory Foam</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">Cooling Gel Contour Pillows</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">Breathable Mattress Protectors</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">Luxury Comfort Toppers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Customer Support</h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><Link to="/profile" className="hover:text-[#0ea9df] hover:underline">Your Sleep Account</Link></li>
              <li><Link to="/orders" className="hover:text-[#0ea9df] hover:underline">Track Delivery Status</Link></li>
              <li><Link to="/orders" className="hover:text-[#0ea9df] hover:underline">Easy Return Request</Link></li>
              <li><Link to="/" className="hover:text-[#0ea9df] hover:underline">Free Sleep Expert Advice</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Connect With Us</h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><a href="#" className="hover:text-[#0ea9df] hover:underline">Instagram: @buddymattress</a></li>
              <li><a href="#" className="hover:text-[#0ea9df] hover:underline">Facebook Community</a></li>
              <li><a href="#" className="hover:text-[#0ea9df] hover:underline">WhatsApp Sleep Support</a></li>
              <li><a href="#" className="hover:text-[#0ea9df] hover:underline">support@buddymattress.com</a></li>
            </ul>
          </div>
        </div>

        {/* Brand divider */}
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-[#2e236b] flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300">
          <Link to="/" className="flex items-center">
            <img
              src="/logo-white.png"
              alt="Buddy Mattress"
              className="h-8 w-auto object-contain drop-shadow-xs"
            />
          </Link>

          <div className="flex items-center gap-2 border border-[#3d2f85] rounded-lg px-3 py-1.5 cursor-pointer hover:border-[#0ea9df]">
            <Globe className="w-3.5 h-3.5 text-[#0ea9df]" />
            <span>English</span>
          </div>

          <div className="flex items-center gap-2 border border-[#3d2f85] rounded-lg px-3 py-1.5 cursor-pointer hover:border-[#0ea9df]">
            <span>🇮🇳 India</span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Sub-Footer (#110b2e) */}
      <div className="bg-[#110b2e] py-8 px-4 text-center text-[11px] text-gray-400 space-y-2">
        <div className="flex flex-wrap justify-center gap-4 text-gray-300">
          <a href="#" className="hover:underline">Conditions of Use & Sale</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">100-Night Trial Terms</a>
          <a href="#" className="hover:underline">Warranty Registration</a>
        </div>
        <p>© {new Date().getFullYear()}, Buddy Mattress Co. or its affiliates. Cloudflare Edge Serverless Architecture.</p>
      </div>
    </footer>
  );
}
