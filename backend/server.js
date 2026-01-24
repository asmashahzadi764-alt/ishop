// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messagesRoute from "./routes/messagesRoute.js";
import contactRoutes from "./routes/contactRoutes.js";

// Load environment variables and allow local .env to override existing process.env
dotenv.config({ override: true }); // ensures PORT from this .env takes priority

// -------------------------------
// ✅ Connect Database
// -------------------------------
connectDB(); // using config/db.js

const app = express();

// -------------------------------
// ✅ Middleware
// -------------------------------
// Configure CORS: allow the configured CLIENT_URL in production,
// but during development accept the origin of the incoming request
// (so Vite running on different ports can proxy requests without CORS errors).
app.use(
  cors({
    origin: function (origin, callback) {
      if (process.env.NODE_ENV !== 'production') {
        // Allow any origin in development (use only for local dev)
        return callback(null, true);
      }
      const allowed = process.env.CLIENT_URL || 'http://localhost:5174';
      callback(null, origin === allowed);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Simple request logger to help debug proxied requests
app.use((req, res, next) => {
  const safeBody = req.body && typeof req.body === 'object' ? JSON.stringify(req.body).slice(0, 200) : '';
  console.log(`REQ ${new Date().toISOString()} -> ${req.method} ${req.originalUrl} ${safeBody}`);
  next();
});

// -------------------------------
// ✅ API Routes
// -------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
// Mount messages routes under /api/admin so frontend can call /api/admin/messages
app.use("/api/admin", messagesRoute);
app.use("/api/contact", contactRoutes);

// -------------------------------
// ✅ Root Test Route
// -------------------------------
app.get("/", (req, res) => {
  res.send("🚀 iShop Backend is running successfully!");
});

// -------------------------------
// Global error handler
// -------------------------------
// Handle JSON parse errors from body-parser (invalid JSON)
app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON received:', err.message);
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  return next(err);
});

// -------------------------------
// Global error handler
// -------------------------------
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  if (res.headersSent) return next(err);
  try {
    res.status(500).json({ message: 'Server error', error: err && err.message });
  } catch (e) {
    console.error('Failed to send JSON error response:', e);
    res.status(500).end();
  }
});

// -------------------------------
// ✅ Start Server
// -------------------------------
const PORT = process.env.PORT || 5001;
// Diagnostic: log env PORT vs chosen port so we can see where 5000/5001 comes from
console.log('DEBUG: process.env.PORT (after dotenv.override) =', process.env.PORT);
console.log('DEBUG: effective PORT used =', PORT);
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
