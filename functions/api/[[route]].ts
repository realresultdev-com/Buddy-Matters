/// <reference types="@cloudflare/workers-types" />
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import bcrypt from "bcryptjs";

export type Env = {
  DB: D1Database;
  BUCKET?: R2Bucket;
  R2_PUBLIC_URL?: string;
  JWT_SECRET?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
};

type UserPayload = {
  userId: string;
  role: string;
  exp: number;
};

const app = new Hono<{ Bindings: Env; Variables: { user?: UserPayload } }>().basePath("/api");

// Enable CORS and JSON error handling
app.use("*", cors());

app.onError((err, c) => {
  console.error("API Error:", err);
  return c.json({ error: err.message || "Internal Server Error" }, 500);
});

// Helper for JWT Secret
const getJwtSecret = (env: Env) => env.JWT_SECRET || "supersecret_jwt_key_cf_ecommerce_2024";

// URL Security & ID Decryption Helper
const SECRET_KEY = "Buddy_Mattress_Secure_Salt_Key_2024";
const decryptId = (cipherText: string | undefined): string => {
  if (!cipherText || typeof cipherText !== "string") return "";
  if (!cipherText.startsWith("enc_")) {
    return cipherText;
  }

  const hex = cipherText.slice(4);
  if (hex.length < 4 || hex.length % 2 !== 0) {
    return cipherText;
  }

  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }

  const checksum = bytes.pop();
  const keyChars = SECRET_KEY.split("").map((c) => c.charCodeAt(0));
  let decrypted = "";

  for (let i = 0; i < bytes.length; i++) {
    const keyByte = keyChars[i % keyChars.length];
    decrypted += String.fromCharCode(bytes[i] ^ keyByte);
  }

  let expectedChecksum = 0;
  for (let i = 0; i < decrypted.length; i++) {
    expectedChecksum = (expectedChecksum + decrypted.charCodeAt(i) * (i + 1)) % 256;
  }

  if (checksum !== expectedChecksum) {
    return cipherText;
  }

  return decrypted;
};

// Middleware: Authentication
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized: Missing token" }, 401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = (await verify(token, getJwtSecret(c.env), "HS256")) as unknown as UserPayload;
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ message: "Unauthorized: Invalid or expired token" }, 401);
  }
};

// Middleware: Admin Role (Dynamic from D1 database)
const adminMiddleware = async (c: any, next: any) => {
  const user = c.get("user") as UserPayload | undefined;
  if (!user?.userId) {
    return c.json({ message: "Forbidden: Admin access required" }, 403);
  }

  // Always query database directly to ensure role is dynamically managed in D1
  const dbUser: any = await c.env.DB.prepare(
    "SELECT role FROM users WHERE id = ?"
  ).bind(user.userId).first();

  if (!dbUser || dbUser.role !== "ADMIN") {
    return c.json({ message: "Forbidden: Admin access required" }, 403);
  }

  await next();
};

/* ==========================================================================
   1. AUTHENTICATION
   ========================================================================== */

app.post("/auth/register", async (c) => {
  const { name, email, password } = await c.req.json();
  if (!name || !email || !password) {
    return c.json({ message: "Name, email, and password are required" }, 400);
  }

  // Check if user exists
  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email.toLowerCase()).first();
  if (existing) {
    return c.json({ message: "Email is already registered" }, 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = `usr-${crypto.randomUUID()}`;
  const role = "USER";

  await c.env.DB.prepare(
    "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
  ).bind(userId, name, email.toLowerCase(), hashedPassword, role).run();

  const token = await sign(
    { userId, role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
    getJwtSecret(c.env)
  );

  return c.json(
    {
      user: { id: userId, name, email: email.toLowerCase(), role },
      token,
    },
    201
  );
});

app.post("/auth/login", async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) {
    return c.json({ message: "Email and password are required" }, 400);
  }

  const user: any = await c.env.DB.prepare(
    "SELECT id, name, email, password, role, avatar_url FROM users WHERE email = ?"
  ).bind(email.toLowerCase()).first();

  if (!user) {
    return c.json({ message: "Invalid email or password" }, 401);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return c.json({ message: "Invalid email or password" }, 401);
  }

  const token = await sign(
    { userId: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
    getJwtSecret(c.env)
  );

  return c.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url },
    token,
  });
});

app.post("/auth/google", async (c) => {
  const { credential } = await c.req.json();
  if (!credential) {
    return c.json({ message: "Google credential token is required" }, 400);
  }

  let googleUser: any;
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error("Invalid Google token: " + errText);
    }
    googleUser = await res.json();
  } catch (err: any) {
    return c.json({ message: err.message || "Failed to verify Google token" }, 401);
  }

  const email = (googleUser.email || "").toLowerCase();
  const name = googleUser.name || googleUser.given_name || "Google User";
  const picture = googleUser.picture || "";
  if (!email) {
    return c.json({ message: "Email not provided by Google account" }, 400);
  }

  // Look up existing user in D1
  let user: any = await c.env.DB.prepare(
    "SELECT id, name, email, role, avatar_url FROM users WHERE email = ?"
  ).bind(email).first();

  if (!user) {
    const userId = `usr-google-${googleUser.sub || crypto.randomUUID().slice(0, 8)}`;
    const role = "USER";
    const dummyPassword = await bcrypt.hash(crypto.randomUUID(), 10);

    await c.env.DB.prepare(
      "INSERT INTO users (id, name, email, password, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(userId, name, email, dummyPassword, role, picture).run();

    user = { id: userId, name, email, role, avatar_url: picture };
  } else if (picture && user.avatar_url !== picture) {
    // Dynamically store/update Google profile picture in D1 database
    await c.env.DB.prepare(
      "UPDATE users SET avatar_url = ? WHERE id = ?"
    ).bind(picture, user.id).run();
    user.avatar_url = picture;
  }

  const token = await sign(
    { userId: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
    getJwtSecret(c.env)
  );

  return c.json({ user, token });
});

app.get("/auth/me", authMiddleware, async (c) => {
  const userPayload = c.get("user")!;
  const user: any = await c.env.DB.prepare(
    "SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ?"
  ).bind(userPayload.userId).first();

  if (!user) {
    return c.json({ message: "User not found" }, 404);
  }

  return c.json(user);
});

/* ==========================================================================
   USER SEARCH HISTORY (PERSISTED ON DB)
   ========================================================================== */

app.get("/user/searches", authMiddleware, async (c) => {
  const user = c.get("user");
  const { results } = await c.env.DB.prepare(
    "SELECT id, query, created_at FROM user_searches WHERE user_id = ? ORDER BY created_at DESC LIMIT 8"
  ).bind(user.userId).all();
  return c.json(results || []);
});

app.post("/user/searches", authMiddleware, async (c) => {
  const user = c.get("user");
  const { query } = await c.req.json();
  if (!query || typeof query !== "string" || !query.trim()) {
    return c.json({ message: "Query is required" }, 400);
  }

  const trimmed = query.trim().slice(0, 80);
  // Delete any existing duplicate query for this user to bump to top
  await c.env.DB.prepare(
    "DELETE FROM user_searches WHERE user_id = ? AND LOWER(query) = LOWER(?)"
  ).bind(user.userId, trimmed).run();

  const id = `srch-${crypto.randomUUID()}`;
  await c.env.DB.prepare(
    "INSERT INTO user_searches (id, user_id, query) VALUES (?, ?, ?)"
  ).bind(id, user.userId, trimmed).run();

  // Keep only latest 15 searches per user
  await c.env.DB.prepare(`
    DELETE FROM user_searches 
    WHERE user_id = ? AND id NOT IN (
      SELECT id FROM user_searches WHERE user_id = ? ORDER BY created_at DESC LIMIT 15
    )
  `).bind(user.userId, user.userId).run();

  return c.json({ id, query: trimmed, success: true }, 201);
});

app.delete("/user/searches/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  if (id === "all") {
    await c.env.DB.prepare("DELETE FROM user_searches WHERE user_id = ?").bind(user.userId).run();
    return c.json({ success: true });
  }
  await c.env.DB.prepare("DELETE FROM user_searches WHERE id = ? AND user_id = ?").bind(id, user.userId).run();
  return c.json({ success: true });
});

/* ==========================================================================
   2. CATEGORIES
   ========================================================================== */

app.get("/categories", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM categories ORDER BY name ASC").all();
  c.header("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
  return c.json(results);
});

app.post("/categories", authMiddleware, adminMiddleware, async (c) => {
  const { name, offer_badge_prefix, offer_badge_value } = await c.req.json();
  if (!name) return c.json({ message: "Name is required" }, 400);

  const id = `cat-${crypto.randomUUID()}`;
  const prefix = offer_badge_prefix !== undefined ? offer_badge_prefix : "Starting";
  const value = offer_badge_value !== undefined ? offer_badge_value : "";
  await c.env.DB.prepare(
    "INSERT INTO categories (id, name, offer_badge_prefix, offer_badge_value) VALUES (?, ?, ?, ?)"
  ).bind(id, name, prefix, value).run();

  return c.json({ id, name, offer_badge_prefix: prefix, offer_badge_value: value }, 201);
});

app.put("/categories/:id", authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param("id");
  const { name, offer_badge_prefix, offer_badge_value } = await c.req.json();

  const existing: any = await c.env.DB.prepare("SELECT * FROM categories WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ message: "Category not found" }, 404);

  const updatedName = name !== undefined ? name : existing.name;
  const updatedPrefix = offer_badge_prefix !== undefined ? offer_badge_prefix : (existing.offer_badge_prefix ?? "Starting");
  const updatedValue = offer_badge_value !== undefined ? offer_badge_value : (existing.offer_badge_value ?? "");

  await c.env.DB.prepare(
    "UPDATE categories SET name = ?, offer_badge_prefix = ?, offer_badge_value = ? WHERE id = ?"
  ).bind(updatedName, updatedPrefix, updatedValue, id).run();

  return c.json({ id, name: updatedName, offer_badge_prefix: updatedPrefix, offer_badge_value: updatedValue });
});

app.delete("/categories/:id", authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

/* ==========================================================================
   3. PRODUCTS
   ========================================================================== */

app.get("/products", async (c) => {
  const categoryId = c.req.query("categoryId");
  const trending = c.req.query("trending");
  let query = `
    SELECT p.id, p.name, p.description, p.price, p.stock, p.images, p.category_id as categoryId, p.is_trending, p.about,
           p.offer_badge_prefix, p.offer_badge_value, p.original_price, p.discount_percent,
           c.id as cat_id, c.name as cat_name, c.offer_badge_prefix as cat_offer_badge_prefix, c.offer_badge_value as cat_offer_badge_value,
           p.created_at as createdAt,
           (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id) as avg_rating,
           (SELECT COUNT(r.id) FROM reviews r WHERE r.product_id = p.id) as review_count
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `;
  const whereClauses: string[] = [];
  const params: any[] = [];
  if (categoryId) {
    whereClauses.push("p.category_id = ?");
    params.push(categoryId);
  }
  if (trending !== undefined) {
    whereClauses.push("p.is_trending = ?");
    params.push(trending === "true" || trending === "1" ? 1 : 0);
  }
  if (whereClauses.length > 0) {
    query += ` WHERE ` + whereClauses.join(" AND ");
  }
  query += ` ORDER BY p.created_at DESC`;

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  const formatted = results.map((row: any) => {
    let images: string[] = [];
    try {
      images = typeof row.images === "string" ? JSON.parse(row.images) : row.images || [];
    } catch {
      images = row.images ? [row.images] : [];
    }
    let about: any[] = [];
    try {
      about = typeof row.about === "string" ? JSON.parse(row.about) : row.about || [];
    } catch {
      about = [];
    }
    const origPrice = row.original_price !== null && row.original_price !== undefined ? Number(row.original_price) : Math.round(row.price * 1.35);
    const discPercent = row.discount_percent !== null && row.discount_percent !== undefined ? Number(row.discount_percent) : (origPrice > row.price ? Math.round(((origPrice - row.price) / origPrice) * 100) : 0);

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      original_price: origPrice,
      originalMRP: origPrice,
      discount_percent: discPercent,
      discountPercent: discPercent,
      stock: row.stock,
      images,
      categoryId: row.categoryId,
      category: {
        id: row.cat_id,
        name: row.cat_name,
        offer_badge_prefix: row.cat_offer_badge_prefix || null,
        offer_badge_value: row.cat_offer_badge_value || null,
      },
      offer_badge_prefix: row.offer_badge_prefix || null,
      offer_badge_value: row.offer_badge_value || null,
      is_trending: Boolean(row.is_trending),
      rating: row.avg_rating !== null && row.avg_rating !== undefined ? Number(row.avg_rating) : null,
      review_count: row.review_count !== null && row.review_count !== undefined ? Number(row.review_count) : 0,
      about: Array.isArray(about) ? about : [],
      createdAt: row.createdAt,
    };
  });

  c.header("Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
  return c.json(formatted);
});

app.get("/products/:id", async (c) => {
  const rawId = c.req.param("id");
  const id = decryptId(rawId);
  const row: any = await c.env.DB.prepare(`
    SELECT p.id, p.name, p.description, p.price, p.stock, p.images, p.category_id as categoryId, p.is_trending, p.about,
           p.offer_badge_prefix, p.offer_badge_value, p.original_price, p.discount_percent,
           c.id as cat_id, c.name as cat_name, c.offer_badge_prefix as cat_offer_badge_prefix, c.offer_badge_value as cat_offer_badge_value,
           p.created_at as createdAt,
           (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id) as avg_rating,
           (SELECT COUNT(r.id) FROM reviews r WHERE r.product_id = p.id) as review_count
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `).bind(id).first();

  if (!row) {
    return c.json({ message: "Product not found" }, 404);
  }

  let images: string[] = [];
  try {
    images = typeof row.images === "string" ? JSON.parse(row.images) : row.images || [];
  } catch {
    images = row.images ? [row.images] : [];
  }

  let about: any[] = [];
  try {
    about = typeof row.about === "string" ? JSON.parse(row.about) : row.about || [];
  } catch {
    about = [];
  }

  const origPrice = row.original_price !== null && row.original_price !== undefined ? Number(row.original_price) : Math.round(row.price * 1.35);
  const discPercent = row.discount_percent !== null && row.discount_percent !== undefined ? Number(row.discount_percent) : (origPrice > row.price ? Math.round(((origPrice - row.price) / origPrice) * 100) : 0);

  c.header("Cache-Control", "public, max-age=60, s-maxage=120, stale-while-revalidate=300");
  return c.json({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    original_price: origPrice,
    originalMRP: origPrice,
    discount_percent: discPercent,
    discountPercent: discPercent,
    stock: row.stock,
    images,
    categoryId: row.categoryId,
    category: {
      id: row.cat_id,
      name: row.cat_name,
      offer_badge_prefix: row.cat_offer_badge_prefix || null,
      offer_badge_value: row.cat_offer_badge_value || null,
    },
    offer_badge_prefix: row.offer_badge_prefix || null,
    offer_badge_value: row.offer_badge_value || null,
    is_trending: Boolean(row.is_trending),
    rating: row.avg_rating !== null && row.avg_rating !== undefined ? Number(row.avg_rating) : null,
    review_count: row.review_count !== null && row.review_count !== undefined ? Number(row.review_count) : 0,
    about: Array.isArray(about) ? about : [],
    createdAt: row.createdAt,
  });
});

// Reviews API
app.get("/products/:id/reviews", async (c) => {
  const rawId = c.req.param("id");
  const id = decryptId(rawId);
  const { results } = await c.env.DB.prepare(`
    SELECT r.id, r.product_id, r.user_id, r.rating, r.title, r.comment, r.images, r.is_verified_purchase, r.created_at,
           u.name as user_name, u.avatar_url as user_avatar
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `).bind(id).all();

  const formatted = results.map((row: any) => {
    let images: string[] = [];
    try {
      images = typeof row.images === "string" ? JSON.parse(row.images) : row.images || [];
    } catch {
      images = row.images ? [row.images] : [];
    }
    return {
      id: row.id,
      productId: row.product_id,
      userId: row.user_id,
      userName: row.user_name || "Verified Customer",
      userAvatar: row.user_avatar || null,
      rating: Number(row.rating),
      title: row.title || "",
      comment: row.comment,
      images,
      isVerifiedPurchase: Boolean(row.is_verified_purchase),
      createdAt: row.created_at,
    };
  });

  return c.json(formatted);
});

// Check if current user can review (must have purchased the product)
app.get("/products/:id/can-review", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user?.userId) {
    return c.json({ canReview: false, alreadyReviewed: false, isPurchased: false, reason: "Login required" }, 401);
  }
  const rawId = c.req.param("id");
  const id = decryptId(rawId);

  // Check if user has an order with this product
  const purchased: any = await c.env.DB.prepare(`
    SELECT oi.id
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = ? AND oi.product_id = ? AND o.status != 'CANCELLED'
    LIMIT 1
  `).bind(user.userId, id).first();

  // Check if user already reviewed
  const existingReview: any = await c.env.DB.prepare(`
    SELECT id FROM reviews WHERE user_id = ? AND product_id = ? LIMIT 1
  `).bind(user.userId, id).first();

  const canReview = Boolean(purchased) || user.role === "ADMIN";
  const alreadyReviewed = Boolean(existingReview);

  return c.json({
    canReview,
    alreadyReviewed,
    isPurchased: Boolean(purchased),
    reason: !canReview
      ? "Only verified purchasers of this item can leave a review."
      : alreadyReviewed
      ? "You have already reviewed this product."
      : null,
  });
});

// Post a review (Only verified buyers or admins)
app.post("/products/:id/reviews", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const rawId = c.req.param("id");
  const id = decryptId(rawId);
  const body = await c.req.json();

  const rating = Number(body.rating);
  if (!rating || rating < 1 || rating > 5) {
    return c.json({ error: "Rating must be between 1 and 5 stars" }, 400);
  }

  const comment = (body.comment || "").trim();
  if (!comment) {
    return c.json({ error: "Review comment is required" }, 400);
  }

  // Check verified purchase
  const purchased: any = await c.env.DB.prepare(`
    SELECT oi.id
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = ? AND oi.product_id = ? AND o.status != 'CANCELLED'
    LIMIT 1
  `).bind(user.userId, id).first();

  if (!purchased && user.role !== "ADMIN") {
    return c.json({
      error: "Only verified buyers who purchased this product can submit a review.",
    }, 403);
  }

  // Check if already reviewed
  const existingReview: any = await c.env.DB.prepare(`
    SELECT id FROM reviews WHERE user_id = ? AND product_id = ? LIMIT 1
  `).bind(user.userId, id).first();

  if (existingReview) {
    return c.json({ error: "You have already reviewed this product." }, 400);
  }

  // Retrieve user name & avatar from database
  const dbUser: any = await c.env.DB.prepare(
    "SELECT id, name, avatar_url FROM users WHERE id = ?"
  ).bind(user.userId).first();

  const images = Array.isArray(body.images) ? JSON.stringify(body.images) : "[]";
  const title = (body.title || "").trim();
  const reviewId = `rev-${crypto.randomUUID().slice(0, 12)}`;

  await c.env.DB.prepare(`
    INSERT INTO reviews (id, product_id, user_id, rating, title, comment, images, is_verified_purchase)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `).bind(reviewId, id, user.userId, rating, title, comment, images).run();

  return c.json({
    success: true,
    message: "Review submitted successfully!",
    review: {
      id: reviewId,
      productId: id,
      userId: user.userId,
      userName: dbUser?.name || "Customer",
      userAvatar: dbUser?.avatar_url || null,
      rating,
      title,
      comment,
      images: Array.isArray(body.images) ? body.images : [],
      isVerifiedPurchase: true,
      createdAt: new Date().toISOString(),
    },
  });
});

/* ==========================================================================
   UNIFIED PRODUCT DETAILS API (PAYLOAD BASED)
   Future-ready: Supports JSON body payload for single product, batch IDs,
   category, search, pricing, and stock filtering. In the future, this payload
   can be encrypted/hidden over the network and decrypted seamlessly.
   ========================================================================== */
const handleProductDetailsQuery = async (c: any) => {
  let payload: any = {};
  try {
    payload = await c.req.json();
  } catch {
    payload = {};
  }

  // [FUTURE ENCRYPTION / DECRYPTION HOOK]
  // When payload encryption is activated in the future, decrypt payload here:
  // if (payload.data && typeof payload.data === "string") {
  //   payload = decryptPayload(payload.data, c.env.PAYLOAD_SECRET);
  // }

  const rawTargetId = payload.id || payload.productId;
  const targetId = rawTargetId ? decryptId(rawTargetId) : undefined;

  const rawTargetIds = payload.ids || payload.productIds;
  const targetIds = Array.isArray(rawTargetIds)
    ? rawTargetIds.map((item: string) => decryptId(item))
    : undefined;

  const rawCategoryId = payload.categoryId;
  const categoryId = rawCategoryId ? decryptId(rawCategoryId) : undefined;
  const search = payload.search || payload.query;
  const minPrice = payload.minPrice !== undefined ? Number(payload.minPrice) : undefined;
  const maxPrice = payload.maxPrice !== undefined ? Number(payload.maxPrice) : undefined;
  const inStockOnly = Boolean(payload.inStockOnly);
  const sort = payload.sort || "newest";
  const limit = payload.limit ? Number(payload.limit) : undefined;
  const offset = payload.page && limit ? (Number(payload.page) - 1) * limit : undefined;

  let query = `
    SELECT p.id, p.name, p.description, p.price, p.stock, p.images, p.category_id as categoryId, p.is_trending, p.about,
           p.offer_badge_prefix, p.offer_badge_value, p.original_price, p.discount_percent,
           c.id as cat_id, c.name as cat_name, c.offer_badge_prefix as cat_offer_badge_prefix, c.offer_badge_value as cat_offer_badge_value,
           p.created_at as createdAt,
           (SELECT ROUND(AVG(r.rating), 1) FROM reviews r WHERE r.product_id = p.id) as avg_rating,
           (SELECT COUNT(r.id) FROM reviews r WHERE r.product_id = p.id) as review_count
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const binds: any[] = [];

  // 1. Filter by Single ID
  if (targetId) {
    query += ` AND p.id = ?`;
    binds.push(targetId);
  }

  // 2. Filter by Multiple IDs (Batch)
  if (Array.isArray(targetIds) && targetIds.length > 0) {
    const placeholders = targetIds.map(() => "?").join(",");
    query += ` AND p.id IN (${placeholders})`;
    binds.push(...targetIds);
  }

  // 3. Filter by Category (ID or Name)
  if (categoryId && categoryId !== "All") {
    query += ` AND (p.category_id = ? OR c.name = ?)`;
    binds.push(categoryId, categoryId);
  }

  // 4. Keyword Search in name or description
  if (search) {
    query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
    binds.push(`%${search}%`, `%${search}%`);
  }

  // 5. Filter by Min Price
  if (minPrice !== undefined) {
    query += ` AND p.price >= ?`;
    binds.push(minPrice);
  }

  // 6. Filter by Max Price
  if (maxPrice !== undefined) {
    query += ` AND p.price <= ?`;
    binds.push(maxPrice);
  }

  // 7. Filter In Stock
  if (inStockOnly) {
    query += ` AND p.stock > 0`;
  }

  // 8. Sorting
  if (sort === "price-low") {
    query += ` ORDER BY p.price ASC`;
  } else if (sort === "price-high") {
    query += ` ORDER BY p.price DESC`;
  } else if (sort === "rating") {
    query += ` ORDER BY avg_rating DESC NULLS LAST`;
  } else {
    // Default newest
    query += ` ORDER BY p.created_at DESC`;
  }

  // 9. Pagination
  if (limit) {
    query += ` LIMIT ?`;
    binds.push(limit);
    if (offset !== undefined) {
      query += ` OFFSET ?`;
      binds.push(offset);
    }
  }

  const { results } = await c.env.DB.prepare(query).bind(...binds).all();

  const formatProduct = (row: any) => {
    let images: string[] = [];
    try {
      images = typeof row.images === "string" ? JSON.parse(row.images) : row.images || [];
    } catch {
      images = row.images ? [row.images] : [];
    }
    const originalMRP = row.original_price !== null && row.original_price !== undefined ? Number(row.original_price) : Math.round(row.price * 1.35);
    const discountPercent = row.discount_percent !== null && row.discount_percent !== undefined ? Number(row.discount_percent) : (originalMRP > row.price ? Math.round(((originalMRP - row.price) / originalMRP) * 100) : 0);
    let about: any[] = [];
    try {
      about = typeof row.about === "string" ? JSON.parse(row.about) : row.about || [];
    } catch {
      about = [];
    }

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      original_price: originalMRP,
      originalMRP,
      discount_percent: discountPercent,
      discountPercent,
      stock: row.stock,
      inStock: row.stock > 0,
      images,
      thumbnail: images[0] || "/logo-transparent.png",
      categoryId: row.categoryId,
      category: {
        id: row.cat_id,
        name: row.cat_name,
        offer_badge_prefix: row.cat_offer_badge_prefix || null,
        offer_badge_value: row.cat_offer_badge_value || null,
      },
      offer_badge_prefix: row.offer_badge_prefix || null,
      offer_badge_value: row.offer_badge_value || null,
      rating: row.avg_rating !== null && row.avg_rating !== undefined ? Number(row.avg_rating) : null,
      reviewsCount: row.review_count !== null && row.review_count !== undefined ? Number(row.review_count) : 0,
      review_count: row.review_count !== null && row.review_count !== undefined ? Number(row.review_count) : 0,
      about: Array.isArray(about) ? about : [],
      createdAt: row.createdAt,
    };
  };

  const formatted = results.map(formatProduct);

  // If a single product was requested by ID
  if (targetId) {
    if (formatted.length === 0) {
      return c.json({ success: false, message: "Product not found", data: null }, 404);
    }
    const product = formatted[0];

    // Fetch related products in the same category
    const { results: related } = await c.env.DB.prepare(`
      SELECT p.id, p.name, p.description, p.price, p.stock, p.images, p.category_id as categoryId, p.is_trending,
             p.offer_badge_prefix, p.offer_badge_value,
             c.id as cat_id, c.name as cat_name, c.offer_badge_prefix as cat_offer_badge_prefix, c.offer_badge_value as cat_offer_badge_value,
             p.created_at as createdAt
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ?
      ORDER BY p.created_at DESC
      LIMIT 4
    `).bind(product.categoryId, product.id).all();

    return c.json({
      success: true,
      data: product,
      product: product,
      relatedProducts: related.map(formatProduct),
    });
  }

  return c.json({
    success: true,
    total: formatted.length,
    data: formatted,
    products: formatted,
  });
};

app.post("/products/details", handleProductDetailsQuery);
app.post("/products/query", handleProductDetailsQuery);

app.post("/products", authMiddleware, adminMiddleware, async (c) => {
  let body: any = {};
  const contentType = c.req.header("content-type") || "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await c.req.parseBody();
    body = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      original_price: formData.original_price !== undefined && formData.original_price !== "" ? Number(formData.original_price) : null,
      discount_percent: formData.discount_percent !== undefined && formData.discount_percent !== "" ? Number(formData.discount_percent) : null,
      stock: Number(formData.stock || 0),
      categoryId: formData.categoryId,
      is_trending: String(formData.is_trending) === "true" || String(formData.is_trending) === "1",
      offer_badge_prefix: formData.offer_badge_prefix || "",
      offer_badge_value: formData.offer_badge_value || "",
      images: formData.images ? (Array.isArray(formData.images) ? formData.images : [formData.images]) : [],
    };
  } else {
    body = await c.req.json();
  }

  const id = `prod-${crypto.randomUUID()}`;
  const imagesJson = JSON.stringify(Array.isArray(body.images) ? body.images : [body.images || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"]);
  const isTrending = body.is_trending ? 1 : 0;
  const aboutJson = JSON.stringify(Array.isArray(body.about) ? body.about : []);
  const offerBadgePrefix = body.offer_badge_prefix || "";
  const offerBadgeValue = body.offer_badge_value || "";
  const originalPrice = body.original_price !== undefined && body.original_price !== null && body.original_price !== "" ? Number(body.original_price) : Math.round(Number(body.price) * 1.35);
  const discountPercent = body.discount_percent !== undefined && body.discount_percent !== null && body.discount_percent !== "" ? Number(body.discount_percent) : (originalPrice > Number(body.price) ? Math.round(((originalPrice - Number(body.price)) / originalPrice) * 100) : 0);

  await c.env.DB.prepare(
    "INSERT INTO products (id, name, description, price, stock, images, category_id, is_trending, about, offer_badge_prefix, offer_badge_value, original_price, discount_percent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, body.name, body.description, Number(body.price), Number(body.stock || 0), imagesJson, body.categoryId, isTrending, aboutJson, offerBadgePrefix, offerBadgeValue, originalPrice, discountPercent).run();

  return c.json({
    id,
    ...body,
    original_price: originalPrice,
    originalMRP: originalPrice,
    discount_percent: discountPercent,
    discountPercent: discountPercent,
    is_trending: Boolean(isTrending),
    offer_badge_prefix: offerBadgePrefix,
    offer_badge_value: offerBadgeValue,
    images: JSON.parse(imagesJson),
    about: JSON.parse(aboutJson),
  }, 201);
});

app.put("/products/:id", authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param("id");
  let body: any = {};
  const contentType = c.req.header("content-type") || "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await c.req.parseBody();
    body = {
      name: formData.name,
      description: formData.description,
      price: formData.price !== undefined ? Number(formData.price) : undefined,
      original_price: formData.original_price !== undefined && formData.original_price !== "" ? Number(formData.original_price) : undefined,
      discount_percent: formData.discount_percent !== undefined && formData.discount_percent !== "" ? Number(formData.discount_percent) : undefined,
      stock: formData.stock !== undefined ? Number(formData.stock) : undefined,
      categoryId: formData.categoryId,
      is_trending: formData.is_trending !== undefined ? (String(formData.is_trending) === "true" || String(formData.is_trending) === "1") : undefined,
      offer_badge_prefix: formData.offer_badge_prefix,
      offer_badge_value: formData.offer_badge_value,
      images: formData.images ? (Array.isArray(formData.images) ? formData.images : [formData.images]) : undefined,
    };
  } else {
    body = await c.req.json();
  }

  const existing: any = await c.env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ message: "Product not found" }, 404);

  const name = body.name ?? existing.name;
  const description = body.description ?? existing.description;
  const price = body.price !== undefined ? Number(body.price) : existing.price;
  const stock = body.stock !== undefined ? Number(body.stock) : existing.stock;
  const categoryId = body.categoryId ?? existing.category_id;
  const images = body.images ? JSON.stringify(body.images) : existing.images;
  const isTrending = body.is_trending !== undefined ? (body.is_trending ? 1 : 0) : (existing.is_trending || 0);
  const about = body.about !== undefined ? (typeof body.about === "string" ? body.about : JSON.stringify(body.about)) : (existing.about || "[]");
  const offerBadgePrefix = body.offer_badge_prefix !== undefined ? body.offer_badge_prefix : (existing.offer_badge_prefix || "");
  const offerBadgeValue = body.offer_badge_value !== undefined ? body.offer_badge_value : (existing.offer_badge_value || "");

  let originalPrice = existing.original_price;
  if (body.original_price !== undefined) {
    originalPrice = body.original_price === null || body.original_price === "" ? null : Number(body.original_price);
  } else if (!originalPrice && price) {
    originalPrice = Math.round(price * 1.35);
  }

  let discountPercent = existing.discount_percent;
  if (body.discount_percent !== undefined) {
    discountPercent = body.discount_percent === null || body.discount_percent === "" ? null : Number(body.discount_percent);
  } else if (originalPrice && price && originalPrice > price) {
    discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  await c.env.DB.prepare(
    "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, images = ?, is_trending = ?, about = ?, offer_badge_prefix = ?, offer_badge_value = ?, original_price = ?, discount_percent = ? WHERE id = ?"
  ).bind(name, description, price, stock, categoryId, images, isTrending, about, offerBadgePrefix, offerBadgeValue, originalPrice, discountPercent, id).run();

  let parsedAbout: any[] = [];
  try {
    parsedAbout = JSON.parse(about);
  } catch {
    parsedAbout = [];
  }

  return c.json({
    id,
    name,
    description,
    price,
    original_price: originalPrice,
    originalMRP: originalPrice,
    discount_percent: discountPercent,
    discountPercent: discountPercent,
    stock,
    categoryId,
    is_trending: Boolean(isTrending),
    offer_badge_prefix: offerBadgePrefix,
    offer_badge_value: offerBadgeValue,
    images: JSON.parse(images),
    about: parsedAbout,
  });
});

app.delete("/products/:id", authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
  return c.json({ success: true });
});

/* ==========================================================================
   R2 IMAGE STORAGE & UPLOAD
   ========================================================================== */

// Serve image directly from R2 (works even when R2 public development URL is disabled)
app.get("/images/:key{.+}", async (c) => {
  const key = c.req.param("key");
  if (!c.env.BUCKET) {
    return c.text("R2 Storage bucket is not bound", 503);
  }

  const object = await c.env.BUCKET.get(key);
  if (!object) {
    return c.text("Image not found in R2 storage", 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
});

// Upload endpoint: accepts multipart/form-data with 'file' or 'files' (Admins or authenticated buyers for reviews)
app.post("/upload", authMiddleware, async (c) => {
  try {
    const formData = await c.req.parseBody({ all: true });
    let files: any = formData["file"] || formData["files"] || formData["image"] || formData["images"];
    if (!files) {
      return c.json({ error: "No image file provided" }, 400);
    }

    if (!Array.isArray(files)) {
      files = [files];
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
      const uniqueKey = `products/${Date.now()}-${cleanName}.${ext}`;

      if (c.env.BUCKET) {
        await c.env.BUCKET.put(uniqueKey, file.stream(), {
          httpMetadata: {
            contentType: file.type || `image/${ext}`,
          },
        });

        const r2PublicUrl = c.env.R2_PUBLIC_URL || "https://pub-e9f02df81ad34d8da252578b86423390.r2.dev";
        const baseUrl = r2PublicUrl.replace(/\/$/, "");
        uploadedUrls.push(`${baseUrl}/${uniqueKey}`);
      } else {
        // Fallback for mock environments
        uploadedUrls.push(`https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800`);
      }
    }

    if (uploadedUrls.length === 0) {
      return c.json({ error: "No valid image files processed" }, 400);
    }

    return c.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (err: any) {
    console.error("R2 Upload Error:", err);
    return c.json({ error: err.message || "Failed to upload file to R2" }, 500);
  }
});

// Admin media list from R2 bucket
app.get("/admin/media", authMiddleware, adminMiddleware, async (c) => {
  if (!c.env.BUCKET) {
    return c.json({ success: true, items: [] });
  }

  try {
    const listed = await c.env.BUCKET.list({ prefix: "products/", limit: 100 });
    const r2PublicUrl = c.env.R2_PUBLIC_URL || "https://pub-e9f02df81ad34d8da252578b86423390.r2.dev";
    const baseUrl = r2PublicUrl.replace(/\/$/, "");
    const items = listed.objects.map((obj: any) => {
      const url = `${baseUrl}/${obj.key}`;
      return {
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
        url,
      };
    });

    return c.json({ success: true, items });
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to list R2 media" }, 500);
  }
});


/* ==========================================================================
   4. ORDERS
   ========================================================================== */

app.post("/orders", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const { items } = await c.req.json<{ items: { productId: string; quantity: number }[] }>();

  if (!items || !items.length) {
    return c.json({ message: "Order must contain at least one item" }, 400);
  }

  // Fetch prices securely from D1 to prevent client tampering
  let totalAmount = 0;
  const pricedItems: { productId: string; quantity: number; price: number; name: string }[] = [];

  for (const item of items) {
    const product: any = await c.env.DB.prepare("SELECT id, name, price, stock FROM products WHERE id = ?")
      .bind(item.productId)
      .first();

    if (!product) {
      return c.json({ message: `Product ${item.productId} not found` }, 404);
    }

    const price = product.price;
    totalAmount += price * item.quantity;
    pricedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price,
      name: product.name,
    });
  }

  const orderId = `ord-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  // Create order
  await c.env.DB.prepare(
    "INSERT INTO orders (id, user_id, total_amount, status, created_at) VALUES (?, ?, ?, 'PENDING', ?)"
  ).bind(orderId, user.userId, totalAmount, now).run();

  // Insert order items
  for (const item of pricedItems) {
    const itemId = `oi-${crypto.randomUUID()}`;
    await c.env.DB.prepare(
      "INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)"
    ).bind(itemId, orderId, item.productId, item.quantity, item.price).run();
  }

  return c.json(
    {
      id: orderId,
      userId: user.userId,
      totalAmount,
      status: "PENDING",
      items: pricedItems,
      createdAt: now,
    },
    201
  );
});

app.get("/orders/me", authMiddleware, async (c) => {
  const user = c.get("user")!;
  const { results: orders } = await c.env.DB.prepare(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(user.userId).all();

  const populated = await Promise.all(
    orders.map(async (order: any) => {
      const { results: items } = await c.env.DB.prepare(`
        SELECT oi.id, oi.product_id as productId, oi.quantity, oi.price, p.name, p.images
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).bind(order.id).all();

      return {
        id: order.id,
        userId: order.user_id,
        totalAmount: order.total_amount,
        status: order.status,
        razorpayOrderId: order.razorpay_order_id,
        paymentId: order.payment_id,
        createdAt: order.created_at,
        items: items.map((i: any) => ({
          ...i,
          images: typeof i.images === "string" ? JSON.parse(i.images) : i.images,
        })),
      };
    })
  );

  return c.json(populated);
});

app.get("/orders", authMiddleware, adminMiddleware, async (c) => {
  const { results: orders } = await c.env.DB.prepare(`
    SELECT o.id, o.user_id as userId, o.total_amount as totalAmount, o.status,
           o.razorpay_order_id as razorpayOrderId, o.payment_id as paymentId,
           o.created_at as createdAt, u.name as userName, u.email as userEmail
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `).all();

  const populated = await Promise.all(
    orders.map(async (order: any) => {
      const { results: items } = await c.env.DB.prepare(`
        SELECT oi.id, oi.product_id as productId, oi.quantity, oi.price, p.name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).bind(order.id).all();

      return {
        ...order,
        items,
      };
    })
  );

  return c.json(populated);
});

app.patch("/orders/:id/status", authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json<{ status: string }>();

  const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    return c.json({ message: "Invalid status value" }, 400);
  }

  await c.env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(status, id).run();
  const updated = await c.env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();

  return c.json(updated);
});

/* ==========================================================================
   5. RAZORPAY PAYMENT
   ========================================================================== */

app.post("/payment/create-order", authMiddleware, async (c) => {
  const { amount } = await c.req.json<{ amount: number }>();
  if (!amount || amount <= 0) {
    return c.json({ message: "Valid amount is required" }, 400);
  }

  const keyId = c.env.RAZORPAY_KEY_ID;
  const keySecret = c.env.RAZORPAY_KEY_SECRET;

  // If real Razorpay keys are configured, call Razorpay API directly from Edge
  if (keyId && keySecret && !keyId.includes("mock")) {
    try {
      const resp = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // amount in paise
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("Razorpay API error:", errText);
        throw new Error("Razorpay order creation failed");
      }

      const razorpayData = await resp.json();
      return c.json(razorpayData);
    } catch (e: any) {
      console.warn("Razorpay API request error, falling back to mock mode:", e.message);
    }
  }

  // Development / Mock order generation
  const mockOrderId = `order_mock_${crypto.randomUUID().replace(/-/g, "").substring(0, 14)}`;
  return c.json({
    id: mockOrderId,
    entity: "order",
    amount: Math.round(amount * 100),
    amount_paid: 0,
    amount_due: Math.round(amount * 100),
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    status: "created",
  });
});

app.post("/payment/verify", authMiddleware, async (c) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await c.req.json();

  if (!orderId) {
    return c.json({ message: "orderId is required" }, 400);
  }

  const keySecret = c.env.RAZORPAY_KEY_SECRET;
  let isValid = true;

  if (keySecret && !keySecret.includes("mock")) {
    try {
      const data = `${razorpay_order_id}|${razorpay_payment_id}`;
      const enc = new TextEncoder();
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        enc.encode(keySecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
      const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      isValid = expectedSignature === razorpay_signature;
    } catch (err) {
      console.error("Signature verification error:", err);
      isValid = false;
    }
  }

  if (!isValid) {
    return c.json({ message: "Invalid payment signature" }, 400);
  }

  // Update order status in D1
  await c.env.DB.prepare(
    "UPDATE orders SET status = 'PAID', razorpay_order_id = ?, payment_id = ? WHERE id = ?"
  ).bind(razorpay_order_id || null, razorpay_payment_id || null, orderId).run();

  const updatedOrder = await c.env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();

  return c.json({ success: true, order: updatedOrder });
});

/* ==========================================================================
   6. ADMIN DASHBOARD & USERS
   ========================================================================== */

app.get("/admin/dashboard", authMiddleware, adminMiddleware, async (c) => {
  const productCountResult: any = await c.env.DB.prepare("SELECT count(*) as count FROM products").first();
  const orderCountResult: any = await c.env.DB.prepare("SELECT count(*) as count FROM orders").first();
  const userCountResult: any = await c.env.DB.prepare("SELECT count(*) as count FROM users").first();
  const revenueResult: any = await c.env.DB.prepare(
    "SELECT COALESCE(sum(total_amount), 0) as totalRevenue FROM orders WHERE status NOT IN ('CANCELLED', 'PENDING')"
  ).first();

  return c.json({
    productCount: productCountResult?.count || 0,
    orderCount: orderCountResult?.count || 0,
    userCount: userCountResult?.count || 0,
    totalRevenue: revenueResult?.totalRevenue || 0,
  });
});

app.get("/admin/users", authMiddleware, adminMiddleware, async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT id, name, email, role, avatar_url, created_at as createdAt FROM users ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

app.patch("/admin/users/:id/role", authMiddleware, adminMiddleware, async (c) => {
  const targetUserId = c.req.param("id");
  const { role } = await c.req.json();
  if (!["USER", "ADMIN"].includes(role)) {
    return c.json({ message: "Invalid role. Must be 'USER' or 'ADMIN'" }, 400);
  }
  await c.env.DB.prepare("UPDATE users SET role = ? WHERE id = ?").bind(role, targetUserId).run();
  return c.json({ success: true, message: `User role updated to ${role}` });
});

export const onRequest = handle(app);
export default app;
