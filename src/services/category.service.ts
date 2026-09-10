import { api } from "./api";

export const categoryService = {
  getAll: () => api.get("/categories"),
  create: (name: string) => api.post("/categories", { name }),   // admin only
  remove: (id: string) => api.delete(`/categories/${id}`),       // admin only
};
