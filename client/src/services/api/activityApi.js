import { get } from "./apiClient";

// ----------------------------------
// Activity Logs
// ----------------------------------

export async function getActivity() {
  return await get("/activity");
}