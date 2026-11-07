import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcryptjs";

const ADMIN_PASSWORD_KEY = "admin_password_hash";

async function verifyAdminPassword(password) {
  if (!password) return false;

  const setting = await prisma.adminSetting.findUnique({
    where: { key: ADMIN_PASSWORD_KEY },
  });

  if (setting) {
    return bcrypt.compare(password, setting.value);
  }

  return password === process.env.SALES_ADMIN_PASSWORD;
}

async function saveAdminPassword(password) {
  const hash = await bcrypt.hash(password, 12);

  await prisma.adminSetting.upsert({
    where: { key: ADMIN_PASSWORD_KEY },
    update: { value: hash },
    create: { key: ADMIN_PASSWORD_KEY, value: hash },
  });
}

// ==========================================
// Get All Sales
// ==========================================

export const getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(sales);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ==========================================
// Get Receipt
// ==========================================

export const getReceipt = async (req, res) => {
  try {
    const { receiptNumber } = req.params;

    const sale = await prisma.sale.findUnique({
      where: {
        receiptNumber,
      },
    });

    if (!sale) {
      return res.status(404).json({
        error: "Receipt not found",
      });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ==========================================
// Create Sale
// ==========================================

export const createSale = async (req, res) => {
  try {
    const {
      productName,
      quantity,
      paymentMethod,
    } = req.body;

    const product = await prisma.product.findFirst({
      where: {
        name: productName,
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        error: "Insufficient stock",
      });
    }

    const saleCount = await prisma.sale.count();

    const receiptNumber = `RCP-${String(
      saleCount + 1
    ).padStart(6, "0")}`;

    const totalAmount = product.price * quantity;

    const newStock = product.stock - quantity;

    let sale;

    await prisma.$transaction(async (tx) => {

      // ==============================
      // Create Sale
      // ==============================

      sale = await tx.sale.create({
        data: {
          receiptNumber,
          productName,
          quantity,
          unitPrice: product.price,
          totalAmount,
          paymentMethod,
        },
      });

      // ==============================
      // Update Product Stock
      // ==============================

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          stock: newStock,
        },
      });

      // ==============================
      // Sale Activity
      // ==============================

      await tx.activityLog.create({
        data: {
          action: "Sale Completed",
          productName,
          details: `${quantity} unit(s) sold`,
        },
      });

      // ==============================
      // Opening Stock Finished
      // ==============================

      if (
        product.stockStatus === "OPENING_STOCK" &&
        newStock <= 0
      ) {

        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            stockStatus: "WAITING_FOR_RESTOCK",
          },
        });

        await tx.activityLog.create({
          data: {
            action: "Opening Stock Finished",
            productName,
            details:
              "Opening stock sold out. Waiting for first verified restock.",
          },
        });

      }

    });

    res.status(201).json({
      sale,
      receiptNumber,
      totalAmount,
      paymentMethod,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const clearSalesHistory = async (req, res) => {
  try {
    const { password, year } = req.body;

    if (!(await verifyAdminPassword(password))) {
      return res.status(401).json({
        message: "Invalid administrator password.",
      });
    }

    const selectedYear = Number(year);

    if (!Number.isInteger(selectedYear) || selectedYear < 2000) {
      return res.status(400).json({
        message: "A valid sales year is required.",
      });
    }

    const deleted = await prisma.sale.deleteMany({
      where: {
        createdAt: {
          gte: new Date(Date.UTC(selectedYear, 0, 1)),
          lt: new Date(Date.UTC(selectedYear + 1, 0, 1)),
        },
      },
    });

    res.json({
      message: `${deleted.count} sale(s) cleared for ${selectedYear}.`,
      deleted: deleted.count,
      year: selectedYear,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const authenticateAdmin = async (req, res) => {
  try {
    if (!(await verifyAdminPassword(req.body.password))) {
      return res.status(401).json({
        message: "Invalid administrator password.",
      });
    }

    res.json({ success: true, name: "Wah Ajavon" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!(await verifyAdminPassword(currentPassword))) {
      return res.status(401).json({
        message: "Current administrator password is incorrect.",
      });
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters.",
      });
    }

    await saveAdminPassword(newPassword);

    res.json({ success: true, message: "Administrator password changed." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};