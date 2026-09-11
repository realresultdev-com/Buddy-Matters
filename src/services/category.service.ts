import { api } from "./api";

// Client-side cache & request deduplication to conserve Cloudflare D1 free quota
let cachedCategories: any = null;
let cacheTimestamp = 0;
let inflightPromise: Promise<any> | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export const categoryService = {
  getAll: async (forceRefresh = false) => {
    const now = Date.now();
    // 1. Return memory-cached categories if still fresh
    if (!forceRefresh && cachedCategories && now - cacheTimestamp < CACHE_TTL_MS) {
      return { data: cachedCategories };
    }

    // 2. Deduplicate simultaneous in-flight calls (e.g., Navbar and Home mounting together)
    if (!forceRefresh && inflightPromise) {
      return inflightPromise;
    }

    inflightPromise = api
      .get("/categories")
      .then((res) => {
        cachedCategories = res.data;
        cacheTimestamp = Date.now();
        inflightPromise = null;
        return res;
      })
      .catch((err) => {
        inflightPromise = null;
        throw err;
      });

    return inflightPromise;
  },

  create: async (name: string) => {
    cachedCategories = null; // Bust cache on mutation
    return api.post("/categories", { name });
  },

  remove: async (id: string) => {
    cachedCategories = null; // Bust cache on mutation
    return api.delete(`/categories/${id}`);
  },

  clearCache: () => {
    cachedCategories = null;
    cacheTimestamp = 0;
  },
};
