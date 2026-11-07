import express from "express";

import {
  getSales,
  createSale,
  getReceipt,
  clearSalesHistory,
  authenticateAdmin,
  changeAdminPassword,
} from "../controllers/salesController.js";

const router = express.Router();

// ==========================================
// Sales
// ==========================================

router.get("/", getSales);

router.post("/", createSale);

router.delete("/history", clearSalesHistory);
router.post("/admin/authenticate", authenticateAdmin);
router.post("/admin/password", changeAdminPassword);

// ==========================================
// Receipt
// ==========================================

router.get(
  "/receipt/:receiptNumber",
  getReceipt
);

export default router;