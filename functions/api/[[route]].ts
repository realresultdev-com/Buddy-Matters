import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { cors } from "hono/cors";
import { sign, verify } from "hono/jwt";
import bcrypt from "bcryptjs";

export type Env = {
  DB: D1Database;
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

// Middleware: Admin Role
const adminMiddleware = async (c: any, next: any) => {
  const user = c.get("user") as UserPayload | undefined;
  if (!user || user.role !== "ADMIN") {
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
    "SELECT id, name, email, password, role FROM users WHERE email = ?"
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
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
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
  if (!email) {
    return c.json({ message: "Email not provided by Google account" }, 400);
  }

  // Look up existing user in D1
  let user: any = await c.env.DB.prepare(
    "SELECT id, name, email, role FROM users WHERE email = ?"
  ).bind(email).first();

  if (!user) {
    const userId = `usr-google-${googleUser.sub || crypto.randomUUID().slice(0, 8)}`;
    const role = "USER";
    const dummyPassword = await bcrypt.hash(crypto.randomUUID(), 10);

    await c.env.DB.prepare(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)"
    ).bind(userId, name, email, dummyPassword, role).run();

    user = { id: userId, name, email, role };
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
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?"
  ).bind(userPayload.userId).first();

  if (!user) {
    return c.json({ message: "User not found" }, 404);
  }

  return c.json(user);
});

/* ==========================================================================
   2. CATEGORIES
   ========================================================================== */

app.get("/categories", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM categories ORDER BY name ASC").all();
  return c.json(results);
});

app.post("/categories", authMiddleware, adminMiddleware, async (c) => {
  const { name } = await c.req.json();
  if (!name) return c.json({ message: "Name is required" }, 400);

  const id = `cat-${crypto.randomUUID()}`;
  await c.env.DB.prepare("INSERT INTO categories (id, name) VALUES (?, ?)").bind(id, name).run();

  return c.json({ id, name }, 201);
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
  let query = `
    SELECT p.id, p.name, p.description, p.price, p.stock, p.images, p.category_id as categoryId,
           c.id as cat_id, c.name as cat_name, p.created_at as createdAt
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `;
  const params: string[] = [];
  if (categoryId) {
    query += ` WHERE p.category_id = ?`;
    params.push(categoryId);
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
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      stock: row.stock,
      images,
      categoryId: row.categoryId,
      category: {
        id: row.cat_id,
        name: row.cat_name,
      },
      createdAt: row.createdAt,
    };
  });

  return c.json(formatted);
});

app.get("/products/:id", async (c) => {
  const id = c.req.param("id");
  const row: any = await c.env.DB.prepare(`
    SELECT p.id, p.name, p.description, p.price, p.stock, p.images, p.category_id as categoryId,
           c.id as cat_id, c.name as cat_name, p.created_at as createdAt
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

  return c.json({
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    stock: row.stock,
    images,
    categoryId: row.categoryId,
    category: {
      id: row.cat_id,
      name: row.cat_name,
    },
    createdAt: row.createdAt,
  });
});

app.post("/products", authMiddleware, adminMiddleware, async (c) => {
  let body: any = {};
  const contentType = c.req.header("content-type") || "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await c.req.parseBody();
    body = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock || 0),
      categoryId: formData.categoryId,
      images: formData.images ? (Array.isArray(formData.images) ? formData.images : [formData.images]) : [],
    };
  } else {
    body = await c.req.json();
  }

  const id = `prod-${crypto.randomUUID()}`;
  const imagesJson = JSON.stringify(Array.isArray(body.images) ? body.images : [body.images || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"]);

  await c.env.DB.prepare(
    "INSERT INTO products (id, name, description, price, stock, images, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, body.name, body.description, Number(body.price), Number(body.stock || 0), imagesJson, body.categoryId).run();

  return c.json({ id, ...body, images: JSON.parse(imagesJson) }, 201);
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
      price: Number(formData.price),
      stock: Number(formData.stock || 0),
      categoryId: formData.categoryId,
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

  await c.env.DB.prepare(
    "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, images = ? WHERE id = ?"
  ).bind(name, description, price, stock, categoryId, images, id).run();

  return c.json({ id, name, description, price, stock, categoryId, images: JSON.parse(images) });
});

app.delete("/products/:id", authMiddleware, adminMiddleware, async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
  return c.json({ success: true });
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
    "SELECT COALESCE(sum(total_amount), 0) as totalRevenue FROM orders WHERE status = 'PAID'"
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
    "SELECT id, name, email, role, created_at as createdAt FROM users ORDER BY created_at DESC"
  ).all();
  return c.json(results);
});

export const onRequest = handle(app);
export default app;
