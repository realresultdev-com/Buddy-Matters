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

// Client-side cache & request deduplication to conserve Cloudflare D1 free quota
const productCache = new Map<string, { data: any; timestamp: number }>();
const inflightProducts = new Map<string, Promise<any>>();
const PRODUCT_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes cache

export const productService = {
  // Single unified API to fetch product details via payload
  getDetails: (payload: ProductDetailsPayload = {}) =>
    api.post("/products/details", payload),

  getAll: async (categoryId?: string, forceRefresh = false) => {
    const cacheKey = categoryId || "__all__";
    const now = Date.now();
    const cached = productCache.get(cacheKey);

    // 1. Return fresh cached products if available
    if (!forceRefresh && cached && now - cached.timestamp < PRODUCT_CACHE_TTL_MS) {
      return { data: cached.data };
    }

    // 2. Deduplicate simultaneous in-flight calls (e.g., StrictMode double mounting)
    if (!forceRefresh && inflightProducts.has(cacheKey)) {
      return inflightProducts.get(cacheKey)!;
    }

    const promise = api
      .get("/products", { params: { categoryId } })
      .then((res) => {
        productCache.set(cacheKey, { data: res.data, timestamp: Date.now() });
        inflightProducts.delete(cacheKey);
        return res;
      })
      .catch((err) => {
        inflightProducts.delete(cacheKey);
        throw err;
      });

    inflightProducts.set(cacheKey, promise);
    return promise;
  },

  getById: (id: string) => api.get(`/products/${id}`),

  create: async (data: FormData) => {
    productCache.clear(); // Bust cache on mutations
    return api.post("/products", data);
  },

  update: async (id: string, data: FormData) => {
    productCache.clear(); // Bust cache on mutations
    return api.put(`/products/${id}`, data);
  },

  remove: async (id: string) => {
    productCache.clear(); // Bust cache on mutations
    return api.delete(`/products/${id}`);
  },

  getReviews: (id: string) => api.get(`/products/${id}/reviews`),
  canReview: (id: string) => api.get(`/products/${id}/can-review`),
  submitReview: (id: string, data: { rating: number; title?: string; comment: string; images?: string[] }) => {
    productCache.clear(); // Refresh rating aggregates
    return api.post(`/products/${id}/reviews`, data);
  },

  clearCache: () => {
    productCache.clear();
  },
};
