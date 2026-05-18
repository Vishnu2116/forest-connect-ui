import { API_BASE_URL, USE_REAL_API, getAuthHeaders, getAuthJsonHeaders, handleApiResponse } from "@/config/api";
import { reports as dummyReports, publications as dummyPublications, knowledgeHubItems as dummyKH, announcements as dummyAnnouncements } from "@/data/content";

export type KHType =
  | "publication" | "report" | "iec_material" | "newsletter"
  | "success_story" | "thematic_study" | "documentation"
  | "case_study" | "notification" | "lessons_learned";

export const KH_TYPES: { value: KHType; label: string; categoryLabel: string }[] = [
  { value: "publication",     label: "Publications",       categoryLabel: "Publications" },
  { value: "report",          label: "Reports",            categoryLabel: "Reports" },
  { value: "iec_material",    label: "IEC Materials",      categoryLabel: "IEC Materials" },
  { value: "newsletter",      label: "Newsletters",        categoryLabel: "Newsletters" },
  { value: "success_story",   label: "Success Stories",    categoryLabel: "Success Stories" },
  { value: "thematic_study",  label: "Thematic Studies",   categoryLabel: "Thematic Studies" },
  { value: "documentation",   label: "Documentation",      categoryLabel: "Documentation" },
  { value: "case_study",      label: "Case Studies",       categoryLabel: "Case Studies" },
  { value: "notification",    label: "Notifications",      categoryLabel: "Notifications" },
  { value: "lessons_learned", label: "Lessons Learned",    categoryLabel: "Lessons Learned" },
];

export function categoryToType(category: string): KHType | null {
  const f = KH_TYPES.find((t) => t.categoryLabel === category);
  return f ? f.value : null;
}

export function typeLabel(t: string): string {
  return KH_TYPES.find((x) => x.value === t)?.label || t;
}

export interface ApiKHItem {
  id: string;
  type: KHType | string;
  title: string;
  description?: string | null;
  file_path?: string | null;
  file_size?: number | null;        // in KB
  file_type?: string | null;        // e.g. "PDF"
  language?: string | null;
  thumbnail_path?: string | null;
  published_date?: string | null;
  is_active?: boolean;
  created_at?: string;
}

export interface PaginatedKH {
  data: ApiKHItem[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export function resolveUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  if (path.startsWith("/")) return `${API_BASE_URL ?? ""}${path}`;
  return path;
}

export function formatSizeMB(kb?: number | null): string {
  if (!kb && kb !== 0) return "—";
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function formatMonthYear(date?: string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export function isNew(created_at?: string): boolean {
  if (!created_at) return false;
  const t = new Date(created_at).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t < 7 * 24 * 60 * 60 * 1000;
}

/* ---------- Dummy fallbacks ---------- */
function fromLegacySize(s?: string): number | null {
  if (!s) return null;
  const m = s.match(/([\d.]+)\s*MB/i);
  return m ? Math.round(parseFloat(m[1]) * 1024) : null;
}

function dummyFor(type: KHType): ApiKHItem[] {
  const today = new Date().toISOString();
  const map: Record<string, any[]> = {
    report: dummyReports.map((r, i) => ({ ...r, type: "report" as const, id: `dummy-r-${i}` })),
    publication: dummyPublications.map((r, i) => ({ ...r, type: "publication" as const, id: `dummy-p-${i}` })),
  };
  if (type in map) {
    return map[type].map((r) => ({
      id: r.id, type, title: r.title,
      description: null, file_path: null,
      file_size: fromLegacySize(r.size), file_type: r.type || "PDF",
      language: "English", thumbnail_path: null,
      published_date: r.date, created_at: today, is_active: true,
    }));
  }
  // Card/notification fallbacks from knowledgeHubItems
  const labelToCat: Record<KHType, string> = {
    publication: "Publications", report: "Reports", iec_material: "IEC Materials",
    newsletter: "Newsletters", success_story: "Success Stories", thematic_study: "Thematic Studies",
    documentation: "Documentation", case_study: "Case Studies", notification: "Notifications",
    lessons_learned: "Lessons Learned",
  };
  const cat = labelToCat[type];
  const items = dummyKH.filter((k) => k.category === cat);
  // For notifications, fall back to announcements list when KH has none
  if (type === "notification" && items.length === 0) {
    return dummyAnnouncements.map((a, i) => ({
      id: `dummy-n-${i}`, type, title: a.title, description: null,
      file_path: null, file_size: null, file_type: null, language: "English",
      thumbnail_path: null, published_date: a.date, created_at: today, is_active: true,
    }));
  }
  return items.map((k, i) => ({
    id: `dummy-${type}-${i}`, type, title: k.title, description: null,
    file_path: null, file_size: 2400, file_type: "PDF", language: "English",
    thumbnail_path: null, published_date: k.date, created_at: today, is_active: true,
  }));
}

/* ---------- Public fetchers (with dummy fallback) ---------- */
export interface FetchKHParams {
  type: KHType;
  search?: string;
  year?: string;
  page?: number;
  limit?: number;
}

export async function fetchKnowledgeHub(params: FetchKHParams): Promise<PaginatedKH> {
  const { type, search, year, page = 1, limit = 10 } = params;
  const fallback = (): PaginatedKH => {
    let data = dummyFor(type);
    if (search) data = data.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));
    if (year) data = data.filter((d) => (d.published_date || "").includes(year));
    const total = data.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const paged = data.slice((page - 1) * limit, page * limit);
    return { data: paged, pagination: { total, page, limit, totalPages } };
  };
  if (!USE_REAL_API) return fallback();
  try {
    const qs = new URLSearchParams();
    if (search) qs.set("search", search);
    if (year) qs.set("year", year);
    qs.set("page", String(page));
    qs.set("limit", String(limit));
    const r = await fetch(`${API_BASE_URL}/api/knowledge-hub/${type}?${qs.toString()}`);
    if (!r.ok) throw new Error();
    const json = await r.json();
    const data: ApiKHItem[] = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    if (!data.length) return fallback();
    return {
      data,
      pagination: json?.pagination || { total: data.length, page, limit, totalPages: 1 },
    };
  } catch {
    return fallback();
  }
}

/* ---------- Home page mixed feeds ---------- */
export async function fetchWhatsNew(): Promise<ApiKHItem[]> {
  if (!USE_REAL_API) return [];
  try {
    const r = await fetch(`${API_BASE_URL}/api/home/whats-new`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
export async function fetchHomeNotifications(): Promise<ApiKHItem[]> {
  if (!USE_REAL_API) return [];
  try {
    const r = await fetch(`${API_BASE_URL}/api/home/notifications`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/* ---------- Admin (no dummy fallback) ---------- */
export async function fetchKHAdmin(type?: KHType | "all"): Promise<ApiKHItem[]> {
  const qs = type && type !== "all" ? `?type=${type}` : "";
  const r = await fetch(`${API_BASE_URL}/api/admin/knowledge-hub${qs}`, { headers: getAuthHeaders() });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();
  return Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
}

export async function createKHAdmin(fd: FormData): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/knowledge-hub`, {
    method: "POST", headers: getAuthHeaders(), body: fd,
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

export async function updateKHAdmin(id: string, fd: FormData): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/knowledge-hub/${id}`, {
    method: "PUT", headers: getAuthHeaders(), body: fd,
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

export async function deleteKHAdmin(id: string): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/knowledge-hub/${id}`, {
    method: "DELETE", headers: getAuthHeaders(),
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}
