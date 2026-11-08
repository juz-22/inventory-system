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

    const sales = await prisma.sale.findMany({
      where: {
        receiptNumber,
      },
      orderBy: {
        id: "asc",
      },
    });

    if (sales.length === 0) {
      return res.status(404).json({
        error: "Receipt not found",
      });
    }

    res.json({
      receiptNumber,
      paymentMethod: sales[0].paymentMethod,
      createdAt: sales[0].createdAt,
      totalAmount: sales.reduce(
        (total, sale) => total + sale.totalAmount,
        0
      ),
      items: sales,
    });
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
    const { items, productName, quantity, paymentMethod } = req.body;
    const saleItems = Array.isArray(items)
      ? items
      : [{ productName, quantity }];

    if (
      saleItems.length === 0 ||
      saleItems.some(
        (item) =>
          (!item.productId && !item.productName) ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) <= 0
      )
    ) {
      return res.status(400).json({
        error: "At least one valid sale item is required.",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        error: "Payment method is required.",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const saleCount = await tx.sale.count();
      const receiptNumber = `RCP-${String(
        saleCount + 1
      ).padStart(6, "0")}`;
      const createdSales = [];

      for (const item of saleItems) {
        const product = item.productId
          ? await tx.product.findUnique({
              where: { id: Number(item.productId) },
            })
          : await tx.product.findFirst({
              where: { name: item.productName },
            });

        if (!product) {
          throw new Error(`Product not found: ${item.productName || item.productId}`);
        }

        const itemQuantity = Number(item.quantity);
        if (product.stock < itemQuantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const newStock = product.stock - itemQuantity;
        const totalAmount = product.price * itemQuantity;

        const sale = await tx.sale.create({
          data: {
            receiptNumber,
            productName: product.name,
            quantity: itemQuantity,
            unitPrice: product.price,
            totalAmount,
            paymentMethod,
          },
        });
        createdSales.push(sale);

        await tx.product.update({
          where: { id: product.id },
          data: { stock: newStock },
        });

        await tx.activityLog.create({
          data: {
            action: "Sale Completed",
            productName: product.name,
            details: `${itemQuantity} unit(s) sold`,
          },
        });

        if (
          product.stockStatus === "OPENING_STOCK" &&
          newStock <= 0
        ) {
          await tx.product.update({
            where: { id: product.id },
            data: { stockStatus: "WAITING_FOR_RESTOCK" },
          });

          await tx.activityLog.create({
            data: {
              action: "Opening Stock Finished",
              productName: product.name,
              details:
                "Opening stock sold out. Waiting for first verified restock.",
            },
          });
        }
      }

      return {
        receiptNumber,
        sales: createdSales,
        totalAmount: createdSales.reduce(
          (total, sale) => total + sale.totalAmount,
          0
        ),
      };
    });

    res.status(201).json({
      sales: result.sales,
      receiptNumber: result.receiptNumber,
      totalAmount: result.totalAmount,
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