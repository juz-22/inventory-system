import { get } from "./apiClient";

// ----------------------------------
// Dashboard
// ----------------------------------

export async function getDashboard() {
  return await get("/dashboard");
}