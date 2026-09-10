import { api } from "./api";

export const orderService = {
  createFromCart: (items: { productId: string; quantity: number }[]) =>
    api.post("/orders", { items }),
  myOrders: () => api.get("/orders/me"),
  allOrders: () => api.get("/orders"),               // admin only
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),    // admin only
};
