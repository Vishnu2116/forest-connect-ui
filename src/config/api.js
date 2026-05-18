const isLocalhost = window.location.hostname === 'localhost';

export const API_BASE_URL = isLocalhost ? 'http://localhost:3000' : null;

export const USE_REAL_API = isLocalhost;

// Always reads the token fresh from localStorage. Never cache the return value.
// Use for multipart/form-data (file uploads) — do NOT set Content-Type, the
// browser will set it with the correct boundary automatically.
export const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('element_admin_token')}`,
});

// Use for JSON requests.
export const getAuthJsonHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('element_admin_token')}`,
  'Content-Type': 'application/json',
});

// Centralized 401 handler. On expired/invalid token: clear storage, notify,
// and redirect to the admin login screen.
let sessionExpiredHandled = false;
export const handleApiResponse = async (response) => {
  if (response && response.status === 401) {
    if (!sessionExpiredHandled) {
      sessionExpiredHandled = true;
      try {
        const { toast } = await import('sonner');
        toast.error('Session expired. Please log in again.');
      } catch (e) {
        // ignore
      }
      localStorage.clear();
      sessionStorage.removeItem('element_admin');
      // Small delay so the toast can render before navigation.
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 50);
    }
    throw new Error('Session expired');
  }
  return response;
};

// Global safety net: any fetch to an /api/admin/* endpoint that returns 401
// triggers the session-expired flow. This ensures coverage even if a call
// site forgets to invoke handleApiResponse explicitly.
if (typeof window !== 'undefined' && !window.__elementAdminFetchPatched) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    try {
      const url =
        typeof args[0] === 'string'
          ? args[0]
          : args[0] && args[0].url
          ? args[0].url
          : '';
      const onAdminRoute =
        typeof window !== 'undefined' &&
        window.location &&
        window.location.pathname.startsWith('/admin');
      if (
        response.status === 401 &&
        (url.includes('/api/admin/') || onAdminRoute)
      ) {
        // Fire and forget — handleApiResponse will redirect.
        handleApiResponse(response.clone()).catch(() => {});
      }
    } catch (e) {
      // ignore
    }
    return response;
  };
  window.__elementAdminFetchPatched = true;
}
