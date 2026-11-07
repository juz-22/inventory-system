// =====================================================
// InventorySys - Sales Service
// =====================================================

const API_URL =
  `${import.meta.env.VITE_API_URL}/sales`;

async function readResponse(response, fallbackMessage) {
  const body = await response.text();
  let data;

  if (!body) {
    throw new Error(
      `${fallbackMessage} The API returned an empty response.`
    );
  }

  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(
      `${fallbackMessage} The API returned an invalid response.`
    );
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || fallbackMessage);
  }

  return data;
}

// =====================================================
// Get All Sales
// =====================================================

export async function getSales() {
  const response = await fetch(API_URL);
  return readResponse(response, "Failed to fetch sales.");
}

// =====================================================
// Get Single Sale
// =====================================================

export async function getSale(id) {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch sale.");
  }

  return response.json();
}

// =====================================================
// Create Sale
// =====================================================

export async function createSale(saleData) {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(saleData),
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(
      error.message || "Failed to create sale."
    );
  }

  return response.json();
}

// =====================================================
// Update Sale
// =====================================================

export async function updateSale(id, saleData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(saleData),
  });

  if (!response.ok) {
    throw new Error("Failed to update sale.");
  }

  return response.json();
}

// =====================================================
// Delete Sale
// =====================================================

export async function deleteSale(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete sale.");
  }

  return response.json();
}

// =====================================================
// Today's Sales
// =====================================================

export async function getTodaySales() {
  const response = await fetch(
    `${API_URL}/today`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch today's sales."
    );
  }

  return response.json();
}

// =====================================================
// Sales History
// =====================================================

export async function getSalesHistory() {
  const response = await fetch(
    `${API_URL}/history`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch sales history."
    );
  }

  return response.json();
}

export async function clearSalesHistory(password, year) {
  const response = await fetch(`${API_URL}/history`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, year }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to clear sales history."
    );
  }

  return data;
}

export async function authenticateAdmin(password) {
  const response = await fetch(`${API_URL}/admin/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return readResponse(response, "Unable to authenticate administrator.");
}

export async function changeAdminPassword(currentPassword, newPassword) {
  const response = await fetch(`${API_URL}/admin/password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return readResponse(response, "Failed to change password.");
}