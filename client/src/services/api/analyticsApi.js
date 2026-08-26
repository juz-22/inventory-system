import { get } from "./apiClient";

// ==========================================
// Business Health / Analytics
// ==========================================

export async function getAnalytics() {
  return await get("/analytics");
}