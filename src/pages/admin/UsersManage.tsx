import { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import Loader from "../../components/common/Loader";
import { Users, Shield, User } from "lucide-react";

export default function UsersManage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update user role in D1 database.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader text="Loading registered accounts..." />;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users & Roles</h1>
        <p className="text-xs text-gray-500 mt-1">
          Dynamic role permissions stored and verified in Cloudflare D1.
        </p>
      </div>

      {/* Mobile Card Layout (Visible on phone/tablet screens) */}
      <div className="block md:hidden space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="p-3.5 bg-white border border-gray-200 rounded-xl shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-700 shrink-0 overflow-hidden">
                  {u.avatar_url ? (
                    <img
                      src={u.avatar_url}
                      alt={u.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    u.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-gray-900 truncate">{u.name || "Customer"}</p>
                  <p className="text-[11px] text-gray-500 truncate">{u.email}</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  u.role === "ADMIN"
                    ? "bg-amber-100 text-amber-900 border border-amber-300"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {u.role === "ADMIN" ? (
                  <Shield className="w-3 h-3 text-amber-700" />
                ) : (
                  <User className="w-3 h-3 text-gray-500" />
                )}
                {u.role}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
              <span className="text-[10px] text-gray-400">
                {u.createdAt
                  ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Seed account"}
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-500 font-medium">Role:</span>
                <select
                  value={u.role}
                  disabled={updatingId === u.id}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="text-xs font-semibold border border-gray-300 rounded-lg px-2.5 py-1 bg-gray-50 text-gray-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0ea9df]"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (Visible on md and larger screens) */}
      <div className="hidden md:block rounded-xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-700 uppercase tracking-wider font-bold">
            <tr>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Dynamic Role</th>
              <th className="p-3.5">Registered Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center font-bold text-xs text-gray-700 shrink-0 overflow-hidden shadow-2xs">
                    {u.avatar_url ? (
                      <img
                        src={u.avatar_url}
                        alt={u.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      u.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{u.name}</p>
                    <p className="text-[10px] font-mono text-gray-400">{u.id}</p>
                  </div>
                </td>
                <td className="p-3.5 text-gray-700">{u.email}</td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        u.role === "ADMIN"
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {u.role === "ADMIN" ? (
                        <Shield className="w-3 h-3 text-amber-700" />
                      ) : (
                        <User className="w-3 h-3 text-gray-500" />
                      )}
                      {u.role}
                    </span>

                    <select
                      value={u.role}
                      disabled={updatingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="text-[11px] font-medium border border-gray-300 rounded px-2 py-0.5 bg-white hover:bg-gray-50 text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0ea9df]"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </td>
                <td className="p-3.5 text-gray-500">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Seed account"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
