import { api } from "./api";

export interface DashboardStats {
  productCount: number;
  orderCount: number;
  userCount: number;
  totalRevenue: number;
}

export const adminService = {
  getDashboardStats: () => api.get<DashboardStats>("/admin/dashboard"),
  getUsers: () => api.get("/admin/users"),
};
