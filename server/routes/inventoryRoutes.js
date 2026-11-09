import express from "express";
import { uploadInventory } from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/upload", uploadInventory);

export default router;
