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
        className="bg-[#37475a] hover:bg-[#485769] text-white py-3.5 text-center text-xs font-semibold cursor-pointer transition-colors"
      >
        Back to top
      </div>

      {/* 2. Directory Columns (#232f3e) */}
      <div className="bg-amazon-subnav border-b border-gray-700 py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Get to Know Us</h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><Link to="/" className="hover:underline">About Lumina</Link></li>
              <li><Link to="/" className="hover:underline">Careers</Link></li>
              <li><Link to="/" className="hover:underline">Press Releases</Link></li>
              <li><Link to="/" className="hover:underline">Lumina Science</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Connect with Us</h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter / X</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Make Money with Us</h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><Link to="/" className="hover:underline">Sell on Lumina</Link></li>
              <li><Link to="/" className="hover:underline">Sell under Lumina Accelerator</Link></li>
              <li><Link to="/" className="hover:underline">Protect and Build Your Brand</Link></li>
              <li><Link to="/" className="hover:underline">Lumina Global Selling</Link></li>
              <li><Link to="/" className="hover:underline">Become an Affiliate</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">Let Us Help You</h4>
            <ul className="space-y-2 text-gray-300 text-xs">
              <li><Link to="/profile" className="hover:underline">COVID-19 and Lumina</Link></li>
              <li><Link to="/profile" className="hover:underline">Your Account</Link></li>
              <li><Link to="/orders" className="hover:underline">Returns Centre</Link></li>
              <li><Link to="/" className="hover:underline">100% Purchase Protection</Link></li>
              <li><Link to="/" className="hover:underline">Help & Customer Care</Link></li>
            </ul>
          </div>
        </div>

        {/* Brand divider */}
        <div className="max-w-6xl mx-auto mt-10 pt-8 border-t border-gray-700 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-300">
          <div className="flex flex-col items-start leading-none">
            <span className="text-xl font-black text-white">
              amazon<span className="text-amazon-orange text-xs font-bold">.in</span>
            </span>
          </div>

          <div className="flex items-center gap-2 border border-gray-600 rounded px-3 py-1 cursor-pointer hover:border-gray-400">
            <Globe className="w-3.5 h-3.5" />
            <span>English</span>
          </div>

          <div className="flex items-center gap-2 border border-gray-600 rounded px-3 py-1 cursor-pointer hover:border-gray-400">
            <span>🇮🇳 India</span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Sub-Footer (#131921) */}
      <div className="bg-amazon-dark py-8 px-4 text-center text-[11px] text-gray-400 space-y-2">
        <div className="flex flex-wrap justify-center gap-4 text-gray-300">
          <a href="#" className="hover:underline">Conditions of Use & Sale</a>
          <a href="#" className="hover:underline">Privacy Notice</a>
          <a href="#" className="hover:underline">Interest-Based Ads</a>
        </div>
        <p>© 1996-{new Date().getFullYear()}, Amazon.com, Inc. or its affiliates. Cloudflare Edge Serverless Architecture.</p>
      </div>
    </footer>
  );
}
