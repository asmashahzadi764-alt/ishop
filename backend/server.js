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

// Load environment variables
dotenv.config();

// -------------------------------
// ✅ Connect Database
// -------------------------------
connectDB();

const app = express();

// -------------------------------
// ✅ Middleware
// -------------------------------
app.use(
  cors({
    origin: function (origin, callback) {
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      const allowed = process.env.CLIENT_URL;

      if (!origin || origin === allowed) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// -------------------------------
// ✅ API Routes
// -------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", messagesRoute);
app.use("/api/contact", contactRoutes);

// -------------------------------
// ✅ Root Route
// -------------------------------
app.get("/", (req, res) => {
  res.send("🚀 iShop Backend is running successfully!");
});

// -------------------------------
// ✅ JSON Error Handler
// -------------------------------
app.use((err, req, res, next) => {
  if (
    err &&
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      message: "Invalid JSON body",
    });
  }

  next(err);
});

// -------------------------------
// ✅ Global Error Handler
// -------------------------------
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});

// -------------------------------
// ✅ Start Server
// -------------------------------
const PORT = process.env.PORT || 5001;

console.log("PORT =", PORT);
console.log(
  "MONGO_URI loaded =",
  process.env.MONGO_URI ? "YES" : "NO"
);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});