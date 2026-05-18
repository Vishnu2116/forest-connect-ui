/**
 * Central API helper for the ELEMENT frontend.
 *
 * Rules:
 * - Public pages: try backend only on localhost/127.0.0.1, otherwise fall back
 *   to the static/dummy data already shipped in the frontend.
 * - Admin pages: ALWAYS call the real backend. No dummy fallback.
 *   If token is missing/expired -> redirect to /admin/login.
 */

export const API_BASE_URL = "http://localhost:5001";

export const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const ADMIN_TOKEN_KEY = "adminToken";
const ADMIN_USER_KEY = "adminUser";

export const adminAuth = {
  getToken: () => localStorage.getItem(ADMIN_TOKEN_KEY),
  setToken: (t: string) => localStorage.setItem(ADMIN_TOKEN_KEY, t),
  clear: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },
  setUser: (u: unknown) => localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(u)),
  getUser: <T = any>(): T | null => {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    try { return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
  },
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
};

/**
 * Fetch a PUBLIC endpoint. If not on localhost OR the request fails OR the
 * response success is false, return `fallbackData`. Never throws.
 */
export async function fetchPublicWithFallback<T>(
  endpoint: string,
  fallbackData: T,
  init?: RequestInit
): Promise<T> {
  if (!isLocalhost) return fallbackData;
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
      ...init,
    });
    if (!res.ok) return fallbackData;
    const json: ApiEnvelope<T> = await res.json();
    if (!json?.success || json.data === undefined) return fallbackData;
    return json.data;
  } catch {
    return fallbackData;
  }
}

export class AdminApiError extends Error {
  status: number;
  body?: any;
  constructor(message: string, status: number, body?: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/**
 * Fetch an ADMIN endpoint. Always hits the backend, attaches the bearer token,
 * and on 401 clears the token + redirects to /admin/login.
 *
 * NOTE: For multipart uploads, pass `body: FormData` and do NOT set
 * Content-Type — the browser will set the correct multipart boundary.
 */
export async function fetchAdmin<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = adminAuth.getToken();
  if (!token) {
    redirectToLogin();
    throw new AdminApiError("Missing admin token", 401);
  }

  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string> | undefined),
  };
  if (!isFormData && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  } catch (e) {
    throw new AdminApiError(
      "Backend is not available. Please start the local backend server.",
      0
    );
  }

  let json: ApiEnvelope<T> | null = null;
  try { json = await res.json(); } catch { /* non-json */ }

  if (res.status === 401) {
    adminAuth.clear();
    redirectToLogin();
    throw new AdminApiError(json?.message || "Unauthorized", 401, json);
  }

  if (!res.ok || !json?.success) {
    throw new AdminApiError(json?.message || `Request failed (${res.status})`, res.status, json);
  }

  return json.data as T;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  if (!window.location.pathname.startsWith("/admin/login")) {
    window.location.href = "/admin/login";
  }
}
