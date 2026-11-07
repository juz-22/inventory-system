const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// ----------------------------
// Generic API Request
// ----------------------------

export async function apiRequest(
  endpoint,
  options = {}
) {
  try {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      options
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "API request failed."
      );
    }

    return data;

  } catch (error) {

    console.error(
      "API Error:",
      error
    );

    throw error;

  }
}

// ----------------------------
// GET
// ----------------------------

export function get(endpoint) {
  return apiRequest(endpoint);
}

// ----------------------------
// POST
// ----------------------------

export function post(
  endpoint,
  body,
  isFormData = false
) {
  return apiRequest(endpoint, {
    method: "POST",

    headers: isFormData
      ? {}
      : {
          "Content-Type":
            "application/json",
        },

    body: isFormData
      ? body
      : JSON.stringify(body),
  });
}

// ----------------------------
// PUT
// ----------------------------

export function put(
  endpoint,
  body
) {
  return apiRequest(endpoint, {
    method: "PUT",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify(body),
  });
}

// ----------------------------
// DELETE
// ----------------------------

export function remove(endpoint) {
  return apiRequest(endpoint, {
    method: "DELETE",
  });
}