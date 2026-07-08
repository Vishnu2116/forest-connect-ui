import { API_BASE_URL, USE_REAL_API, getAuthHeaders, handleApiResponse } from "@/config/api";
import { procurements as dummyProcurements } from "@/data/content";

export type ProcType = "tender" | "rfp";
export type ProcStatus = "open" | "closing_soon" | "closed" | "cancelled";

export interface ApiProcurement {
  id: string;
  type: ProcType | string;
  title: string;
  published_date?: string | null;
  deadline?: string | null;
  status?: ProcStatus | string | null;
  file_path?: string | null;
  file_size?: number | null;
  is_active?: boolean;
  created_at?: string;
}

export interface PaginatedProc {
  data: ApiProcurement[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const STATUS_OPTIONS: { value: ProcStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "closing_soon", label: "Closing Soon" },
  { value: "closed", label: "Closed" },
  { value: "cancelled", label: "Cancelled" },
];

export const TYPE_OPTIONS: { value: ProcType; label: string }[] = [
  { value: "tender", label: "E-Tender" },
  // { value: "rfp", label: "RFP" }, // Removed per request — kept for future use
];

export function resolveUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL ?? ""}${path}`;
  return path;
}

export function formatDate(date?: string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatSize(kb?: number | null): string {
  if (kb == null) return "";
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function statusLabel(s?: string | null): string {
  if (!s) return "—";
  const f = STATUS_OPTIONS.find((o) => o.value === s);
  return f ? f.label : s;
}

export function typeLabel(t?: string | null): string {
  if (!t) return "—";
  const f = TYPE_OPTIONS.find((o) => o.value === t);
  return f ? f.label : t;
}

export function statusClass(s?: string | null): string {
  switch (s) {
    case "open": return "bg-success/15 text-success";
    case "closing_soon": return "bg-accent/15 text-accent";
    case "closed": return "bg-muted text-muted-foreground";
    case "cancelled": return "bg-destructive/15 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
}

/* ---------- Dummy fallback ---------- */
function legacyStatusToApi(s: string): ProcStatus {
  if (s === "Open") return "open";
  if (s === "Closing Soon") return "closing_soon";
  if (s === "Closed") return "closed";
  if (s === "Cancelled") return "cancelled";
  return "open";
}
function parseLegacyDate(s: string): string {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toISOString().slice(0, 10);
}
function dummyFor(type: ProcType): ApiProcurement[] {
  const today = new Date().toISOString();
  return dummyProcurements.map((p, i) => ({
    id: `dummy-${type}-${i}`,
    type,
    title: p.title,
    published_date: parseLegacyDate(p.date),
    deadline: parseLegacyDate(p.deadline),
    status: legacyStatusToApi(p.status),
    file_path: null,
    is_active: true,
    created_at: today,
  }));
}

/* ---------- Public fetchers ---------- */
export interface FetchProcParams {
  type: ProcType;
  search?: string;
  year?: string;
  page?: number;
  limit?: number;
}

export async function fetchProcurements(params: FetchProcParams): Promise<PaginatedProc> {
  const { type, search, year, page = 1, limit = 10 } = params;
  const fallback = (): PaginatedProc => {
    let data = dummyFor(type);
    if (search) data = data.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));
    if (year) data = data.filter((d) => (d.published_date || "").includes(year));
    const total = data.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return { data: data.slice((page - 1) * limit, page * limit), pagination: { total, page, limit, totalPages } };
  };
  if (!USE_REAL_API) return fallback();
  try {
    const qs = new URLSearchParams();
    if (search) qs.set("search", search);
    if (year) qs.set("year", year);
    qs.set("page", String(page));
    qs.set("limit", String(limit));
    const path = type === "tender" ? "tenders" : "rfps";
    const r = await fetch(`${API_BASE_URL}/api/procurements/${path}?${qs.toString()}`);
    if (!r.ok) throw new Error();
    const json = await r.json();
    const data: ApiProcurement[] = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    if (!data.length) return fallback();
    return { data, pagination: json?.pagination || { total: data.length, page, limit, totalPages: 1 } };
  } catch {
    return fallback();
  }
}

export async function fetchHomeTenders(): Promise<ApiProcurement[]> {
  if (!USE_REAL_API) return [];
  try {
    const r = await fetch(`${API_BASE_URL}/api/home/tenders`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/* ---------- Admin (no dummy fallback) ---------- */
export async function fetchProcAdmin(type?: ProcType | "all"): Promise<ApiProcurement[]> {
  const qs = type && type !== "all" ? `?type=${type}` : "";
  const r = await fetch(`${API_BASE_URL}/api/admin/procurements${qs}`, { headers: getAuthHeaders() });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();
  return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
}

export async function createProcAdmin(fd: FormData): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/procurements`, {
    method: "POST", headers: getAuthHeaders(), body: fd,
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

export async function updateProcAdmin(id: string, fd: FormData): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/procurements/${id}`, {
    method: "PUT", headers: getAuthHeaders(), body: fd,
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

export async function deleteProcAdmin(id: string): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/procurements/${id}`, {
    method: "DELETE", headers: getAuthHeaders(),
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}
