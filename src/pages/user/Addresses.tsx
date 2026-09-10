import { MapPin, Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function Addresses() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="border-b border-gray-300 pb-3">
        <h1 className="text-2xl font-normal text-[#0f1111]">Your Addresses</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {/* Add Address Card */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 min-h-[220px]">
          <Plus className="w-10 h-10 text-gray-400 mb-2" />
          <span className="font-bold text-base text-gray-800">Add Address</span>
        </div>

        {/* Default Address Card */}
        <div className="bg-white border border-gray-300 rounded-lg p-5 flex flex-col justify-between shadow-sm min-h-[220px]">
          <div>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-200 flex justify-between items-center">
              <span>Default Address</span>
              <Check className="w-4 h-4 text-amazon-orange" />
            </div>

            <div className="mt-3 text-xs text-gray-800 space-y-1">
              <p className="font-bold text-sm text-[#0f1111]">Alex Johnson</p>
              <p>123 Silicon Boulevard, 4th Floor</p>
              <p>Bengaluru, Karnataka 560001</p>
              <p>India</p>
              <p className="text-gray-500 pt-1">Phone number: +91 98765 43210</p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex gap-3 text-xs text-amazon-blue font-medium">
            <button className="hover:underline">Edit</button>
            <span>|</span>
            <button className="hover:underline">Remove</button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Link to="/profile" className="text-xs text-amazon-blue hover:text-amazon-linkHover hover:underline font-semibold">
          ← Back to Your Account
        </Link>
      </div>
    </div>
  );
}
