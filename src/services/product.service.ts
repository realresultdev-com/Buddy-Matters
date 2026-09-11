import { api } from "./api";

export interface ProductDetailsPayload {
  id?: string;
  productId?: string;
  ids?: string[];
  productIds?: string[];
  categoryId?: string;
  search?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
  limit?: number;
  page?: number;
  [key: string]: any;
}

export const productService = {
  // Single unified API to fetch product details via payload (future-ready for payload encryption/obfuscation)
  getDetails: (payload: ProductDetailsPayload = {}) =>
    api.post("/products/details", payload),
  getAll: (categoryId?: string) =>
    api.get("/products", { params: { categoryId } }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: FormData) => api.post("/products", data),   // admin only
  update: (id: string, data: FormData) => api.put(`/products/${id}`, data), // admin only
  remove: (id: string) => api.delete(`/products/${id}`),     // admin only
  getReviews: (id: string) => api.get(`/products/${id}/reviews`),
  canReview: (id: string) => api.get(`/products/${id}/can-review`),
  submitReview: (id: string, data: { rating: number; title?: string; comment: string; images?: string[] }) =>
    api.post(`/products/${id}/reviews`, data),
};
