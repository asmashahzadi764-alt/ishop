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

dotenv.config();

// -------------------------------
// DB CONNECT
// -------------------------------
connectDB();

const app = express();

// -------------------------------
// 🔥 CORS FIX (IMPORTANT)
// -------------------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ishop-nu.vercel.app",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow mobile apps / postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(null, false);
    },
    credentials: true,
  })
);

// -------------------------------
// MIDDLEWARE
// -------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// -------------------------------
// LOGGER
// -------------------------------
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// -------------------------------
// ROUTES
// -------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", messagesRoute);
app.use("/api/contact", contactRoutes);

// -------------------------------
// ROOT
// -------------------------------
app.get("/", (req, res) => {
  res.send("🚀 iShop Backend is running successfully!");
});

// -------------------------------
// 404 HANDLER (IMPORTANT FIX)
// -------------------------------
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// -------------------------------
// JSON ERROR HANDLER
// -------------------------------
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON body",
    });
  }
  next(err);
});

// -------------------------------
// GLOBAL ERROR HANDLER
// -------------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});

// -------------------------------
// START SERVER
// -------------------------------
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});