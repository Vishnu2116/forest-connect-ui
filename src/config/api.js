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
