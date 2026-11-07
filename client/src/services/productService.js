import axios from "axios";

// ----------------------------------
// API Base URL
// ----------------------------------

const API =
  `${import.meta.env.VITE_API_URL}/products`;

// ----------------------------------
// Get Products
// ----------------------------------

export const getProducts = async () => {

  const response =
    await axios.get(API);

  return response.data;

};

// ----------------------------------
// Create Product
// ----------------------------------

export const createProduct = async (
  product
) => {

  const response =
    await axios.post(
      API,
      product
    );

  return response.data;

};

// ----------------------------------
// Update Product
// ----------------------------------

export const updateProduct = async (
  id,
  product
) => {

  const response =
    await axios.put(
      `${API}/${id}`,
      product
    );

  return response.data;

};

// ----------------------------------
// Manual Stock Adjustment
// ----------------------------------

export const updateProductStock =
  async (
    id,
    stock
  ) => {

    const response =
      await axios.put(
        `${API}/${id}/stock`,
        {
          stock: typeof stock === "object"
            ? stock.stock
            : stock,
        }
      );

    return response.data;

  };

// ----------------------------------
// Receive Supplier Stock
// ----------------------------------

export const receiveStock =
  async (
    id,
    quantity
  ) => {

    const response =
      await axios.put(
        `${API}/${id}/receive`,
        {
          quantity,
        }
      );

    return response.data;

  };

// ----------------------------------
// Delete Product
// ----------------------------------

export const deleteProduct =
  async (id) => {

    const response =
      await axios.delete(
        `${API}/${id}`
      );

    return response.data;

  };