import {
  get,
  post,
  put,
  remove,
} from "./apiClient";

// =============================================
// Get All Products
// =============================================

export async function getProducts() {
  return await get("/products");
}

// =============================================
// Create Product
// =============================================

export async function createProduct(product) {
  return await post(
    "/products",
    product
  );
}

// =============================================
// Update Product
// =============================================

export async function updateProduct(
  id,
  product
) {
  return await put(
    `/products/${id}`,
    product
  );
}

// =============================================
// Update Product Stock
// =============================================

export async function updateProductStock(
  id,
  stock
) {
  return await put(
    `/products/${id}/stock`,
    {
      stock,
    }
  );
}

// =============================================
// Receive Supplier Stock
// =============================================

export async function receiveStock(
  id,
  quantity
) {
  return await put(
    `/products/${id}/receive`,
    {
      quantity,
    }
  );
}

// =============================================
// Delete Product
// =============================================

export async function deleteProduct(
  id
) {
  return await remove(
    `/products/${id}`
  );
}

// =============================================
// Import Products
// =============================================

export async function importProducts(
  products
) {
  return await post(
    "/inventory/upload",
    products
  );
}