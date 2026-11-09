import prisma from "../prisma/prismaClient.js";

const MAX_UPLOAD_ROWS = 10000;

export const uploadInventory = async (req, res) => {
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body must be a non-empty array of inventory items.",
    });
  }

  if (items.length > MAX_UPLOAD_ROWS) {
    return res.status(413).json({
      success: false,
      message: `A maximum of ${MAX_UPLOAD_ROWS} inventory items can be uploaded at once.`,
    });
  }

  const invalidIndex = items.findIndex((item) => {
    return (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item) ||
      typeof item.name !== "string" ||
      !item.name.trim() ||
      typeof item.category !== "string" ||
      !item.category.trim() ||
      !Number.isInteger(item.stock) ||
      item.stock < 0 ||
      typeof item.price !== "number" ||
      !Number.isFinite(item.price) ||
      item.price < 0
    );
  });

  if (invalidIndex !== -1) {
    return res.status(400).json({
      success: false,
      message: `Inventory item at index ${invalidIndex} is invalid. Each item requires a name, category, non-negative integer stock, and non-negative price.`,
    });
  }

  const products = items.map((item) => ({
    name: item.name.trim(),
    category: item.category.trim(),
    stock: item.stock,
    price: item.price,
    stockStatus: "OPENING_STOCK",
  }));

  try {
    const count = await prisma.$transaction(async (transaction) => {
      const result = await transaction.product.createMany({
        data: products,
        skipDuplicates: true,
      });

      if (result.count > 0) {
        await transaction.activityLog.create({
          data: {
            action: "Imported Products",
            productName: `${result.count} Products`,
            details: `${result.count} product(s) imported from CSV`,
          },
        });
      }

      return result.count;
    });

    return res.status(201).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Inventory upload failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload inventory. Please try again.",
    });
  }
};
