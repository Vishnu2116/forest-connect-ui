export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.BASE_URL !== "/"
    ? import.meta.env.BASE_URL.replace(/\/$/, "")
    : "");

export const USE_REAL_API = true;

export const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("element_admin_token")}`,
});

export const getAuthJsonHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("element_admin_token")}`,
  "Content-Type": "application/json",
});

let sessionExpiredHandled = false;

export const resetSessionExpiredFlag = () => {
  sessionExpiredHandled = false;
};

export const handleApiResponse = async (response) => {
  if (response && response.status === 401) {
    if (!sessionExpiredHandled) {
      sessionExpiredHandled = true;
      try {
        const { toast } = await import("sonner");
        toast.error("Session expired. Please log in again.");
      } catch (e) {
        // ignore
      }
      localStorage.removeItem("element_admin_token");
      localStorage.removeItem("element_admin");
      sessionStorage.removeItem("element_admin");
      setTimeout(() => {
        window.location.href = `${import.meta.env.BASE_URL}admin/login`;
      }, 50);
    }
    throw new Error("Session expired");
  }
  return response;
};

// Global safety net: any fetch to an /api/admin/* endpoint that returns 401
// triggers the session-expired flow. This ensures coverage even if a call
// site forgets to invoke handleApiResponse explicitly.
if (typeof window !== "undefined" && !window.__elementAdminFetchPatched) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    try {
      const url =
        typeof args[0] === "string"
          ? args[0]
          : args[0] && args[0].url
            ? args[0].url
            : "";
      const onAdminRoute =
        typeof window !== "undefined" &&
        window.location &&
        window.location.pathname.includes("/admin");
      if (
        response.status === 401 &&
        (url.includes("/api/admin/") || onAdminRoute)
      ) {
        handleApiResponse(response.clone()).catch(() => {});
      }
    } catch (e) {
      // ignore
    }
    return response;
  };
  window.__elementAdminFetchPatched = true;
}
