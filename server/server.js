import express from "express";
import cors from "cors";
import "dotenv/config";

import productRoutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import commandRoutes from "./routes/commandRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import importRoutes from "./routes/importRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

const app = express();

// ==========================================
// Middleware
// ==========================================

const configuredOrigins = (process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (configuredOrigins.includes(origin)) return true;

  try {
    const url = new URL(origin);
    const isVercelDeployment =
      url.protocol === "https:" &&
      url.hostname.endsWith(".vercel.app");
    const isLocalDevelopment =
      process.env.NODE_ENV !== "production" &&
      ["http://localhost:5173", "http://127.0.0.1:5173"].includes(origin);

    return isVercelDeployment || isLocalDevelopment;
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) =>
      callback(null, isAllowedOrigin(origin)),
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
  res.send("🚀 InventorySys API Running...");
});

// ==========================================
// API Routes
// ==========================================

// Products
app.use("/api/products", productRoutes);
app.use("/api/import", importRoutes);
app.use("/api/inventory", inventoryRoutes);

// AI
app.use("/api/ai", aiRoutes);

// Activity
app.use("/api/activity", activityRoutes);

// Sales
app.use("/api/sales", salesRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Business Health / Analytics
app.use("/api/analytics", analyticsRoutes);

// Business Command Center
app.use("/api/command", commandRoutes);

// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ==========================================
// Global Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error(err);

  if (err.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request body exceeds the 10 MB limit.",
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Request body must contain valid JSON.",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 InventorySys API running on port ${PORT}`
  );
});