import { api } from "./api";

export const productService = {
  getAll: (categoryId?: string) =>
    api.get("/products", { params: { categoryId } }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: FormData) => api.post("/products", data),   // admin only
  update: (id: string, data: FormData) => api.put(`/products/${id}`, data), // admin only
  remove: (id: string) => api.delete(`/products/${id}`),     // admin only
};
