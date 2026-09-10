import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex bg-[#eaeded] min-h-[calc(100vh-6rem)] border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-white overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
