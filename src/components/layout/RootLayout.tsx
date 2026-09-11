import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#191142] overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full max-w-[1500px] mx-auto px-2 sm:px-4 py-4 pb-20 md:pb-6">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
