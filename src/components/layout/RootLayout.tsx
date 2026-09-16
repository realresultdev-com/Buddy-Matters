import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-gray-900 w-full max-w-full overflow-x-hidden relative">
      <Navbar />
      <main className="flex-1 w-full max-w-[1500px] mx-auto px-2 sm:px-4 py-4 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-6 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
