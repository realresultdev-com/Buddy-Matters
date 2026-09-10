import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#eaeded] text-[#0f1111]">
      <Navbar />
      <main className="flex-1 w-full max-w-[1500px] mx-auto px-2 sm:px-4 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
