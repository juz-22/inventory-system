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

const app = express();

// ==========================================
// Middleware
// ==========================================

app.use(
  cors({
    origin: [
      "https://inventory-system-44-tech1.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

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