import express from "express";

import upload from "../middlewares/upload.js";

import {
  importProducts,
} from "../controllers/importController.js";

const router = express.Router();

router.post(
  "/products",
  upload.single("file"),
  importProducts
);

export default router;