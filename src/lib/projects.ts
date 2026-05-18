import { API_BASE_URL, USE_REAL_API, getAuthHeaders, getAuthJsonHeaders } from "@/config/api";
import { projects as dummyProjectsRaw } from "@/data/content";

export type ProjectStatus = "ongoing" | "pilot_phase" | "completed" | string;

export interface ApiComponentSummary {
  id: string;
  component_number?: number;
  label?: string;
  name?: string;
}

export interface ApiProjectCard {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  status: ProjectStatus;
  thumbnail_image_path?: string | null;
  component_id?: string | null;
  component?: ApiComponentSummary | null;
}

export interface ApiProjectComponent {
  id: string;
  component_number: number;
  label: string;
  name: string;
  description: string;
  icon_name?: string;
  stat1_label?: string | null;
  stat1_value?: string | null;
  stat2_label?: string | null;
  stat2_value?: string | null;
  stat3_label?: string | null;
  stat3_value?: string | null;
  stat4_label?: string | null;
  stat4_value?: string | null;
  display_order?: number;
  is_active?: boolean;
  projects?: ApiProjectCard[];
}

export interface ApiGalleryImage {
  id: string;
  image_path: string;
  caption?: string | null;
  display_order?: number;
}

export interface ApiProjectDetail extends ApiProjectCard {
  objective?: string | null;
  beneficiaries?: string | null;
  timeline_start?: string | null;
  timeline_end?: string | null;
  coverage?: string | null;
  about?: string | null;
  community_impact?: string | null;
  livelihood_opportunities?: string | null;
  landscape_development_benefits?: string | null;
  key_activities?: string[];
  expected_outcomes?: string[];
  area_covered?: string | null;
  households?: string | null;
  districts?: string | null;
  gallery?: ApiGalleryImage[];
  component?: ApiComponentSummary | null;
}

export function resolveImage(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
  // Only prefix backend upload paths with API_BASE_URL.
  if (path.startsWith("/uploads/")) return `${API_BASE_URL ?? ""}${path}`;
  // Local Vite-imported assets or other absolute paths — return as-is.
  return path;
}

// Backwards-compat: delegate to the central helper so the token is always read fresh.
export function getAuthHeaders(): HeadersInit {
  return getAuthHeaders();
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function statusBadgeClass(status?: string) {
  switch (status) {
    case "ongoing":
      return "bg-success/15 text-success";
    case "pilot_phase":
      return "bg-warning/15 text-warning";
    case "completed":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-success/15 text-success";
  }
}

export function statusLabel(status?: string) {
  switch (status) {
    case "ongoing": return "Ongoing";
    case "pilot_phase": return "Pilot Phase";
    case "completed": return "Completed";
    default: return status || "—";
  }
}

/* ---------- Dummy fallbacks ---------- */
export function dummyComponents(): ApiProjectComponent[] {
  return [
    {
      id: "component-1",
      component_number: 1,
      label: "PROJECT COMPONENT 1",
      name: "Landscape Management",
      description: "Restoring degraded landscapes, watershed management and climate-resilient interventions across Tripura.",
      icon_name: "Trees",
      stat1_label: "Area Restored", stat1_value: "18,500 Ha",
      stat2_label: "Households Benefited", stat2_value: "25,000+",
      stat3_label: "Livelihood Activities", stat3_value: "620+",
      stat4_label: "Districts Covered", stat4_value: "8",
      display_order: 1, is_active: true,
    },
    {
      id: "component-2",
      component_number: 2,
      label: "PROJECT COMPONENT 2",
      name: "Biodiversity & Ecosystem Services",
      description: "Strengthening biodiversity conservation, community plantation drives and ecosystem services.",
      icon_name: "Leaf",
      stat1_label: "Area Restored", stat1_value: "18,500 Ha",
      stat2_label: "Households Benefited", stat2_value: "25,000+",
      stat3_label: "Livelihood Activities", stat3_value: "620+",
      stat4_label: "Districts Covered", stat4_value: "8",
      display_order: 2, is_active: true,
    },
    {
      id: "component-3",
      component_number: 3,
      label: "PROJECT COMPONENT 3",
      name: "Livelihood Development",
      description: "Developing sustainable value chains, enterprise support and community-led eco-tourism.",
      icon_name: "Users",
      stat1_label: "Area Restored", stat1_value: "18,500 Ha",
      stat2_label: "Households Benefited", stat2_value: "25,000+",
      stat3_label: "Livelihood Activities", stat3_value: "620+",
      stat4_label: "Districts Covered", stat4_value: "8",
      display_order: 3, is_active: true,
    },
    {
      id: "component-4",
      component_number: 4,
      label: "PROJECT COMPONENT 4",
      name: "Project Management, Monitoring & Learning",
      description: "Project management, MIS/GIS, monitoring & evaluation, and knowledge dissemination.",
      icon_name: "BarChart3",
      stat1_label: "Area Restored", stat1_value: "18,500 Ha",
      stat2_label: "Households Benefited", stat2_value: "25,000+",
      stat3_label: "Livelihood Activities", stat3_value: "620+",
      stat4_label: "Districts Covered", stat4_value: "8",
      display_order: 4, is_active: true,
    },
  ];
}

export function dummyProjects(): ApiProjectCard[] {
  return dummyProjectsRaw.map((p, i) => ({
    id: `dummy-${i}`,
    title: p.title,
    slug: slugify(p.title),
    subtitle: p.objective,
    status: (p.status || "ongoing").toLowerCase().replace(/\s+/g, "_") as ProjectStatus,
    thumbnail_image_path: p.image || null,
    component_id: null,
    component: p.component ? { id: "", name: p.component, label: p.component, component_number: 0 } : null,
  }));
}

export function dummyProjectDetail(slug: string): ApiProjectDetail | null {
  const p = dummyProjectsRaw.find((x) => slugify(x.title) === slug);
  if (!p) return null;
  return {
    id: `dummy-${slug}`,
    title: p.title,
    slug,
    subtitle: p.description,
    status: (p.status || "ongoing").toLowerCase().replace(/\s+/g, "_"),
    thumbnail_image_path: p.image || null,
    objective: p.objective,
    beneficiaries: p.beneficiaries,
    timeline_start: "2024",
    timeline_end: "Ongoing",
    coverage: p.coverage,
    about: p.description,
    community_impact: null,
    livelihood_opportunities: null,
    landscape_development_benefits: null,
    key_activities: p.activities,
    expected_outcomes: [],
    area_covered: p.coverage,
    households: p.beneficiaries.match(/[\d,]+/)?.[0] || null,
    districts: "8",
    gallery: [],
    component: p.component ? { id: "", name: p.component, label: p.component, component_number: 0 } : null,
  };
}

/* ---------- Fetchers ---------- */
export async function fetchComponents(): Promise<ApiProjectComponent[]> {
  if (!USE_REAL_API) return dummyComponents();
  try {
    const r = await fetch(`${API_BASE_URL}/api/project-components`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    return Array.isArray(data) && data.length ? data : dummyComponents();
  } catch {
    return dummyComponents();
  }
}

export async function fetchComponent(id: string): Promise<ApiProjectComponent | null> {
  if (!USE_REAL_API) {
    return dummyComponents().find((c) => c.id === id) || null;
  }
  try {
    const r = await fetch(`${API_BASE_URL}/api/project-components/${id}`);
    if (!r.ok) throw new Error();
    return await r.json();
  } catch {
    return dummyComponents().find((c) => c.id === id) || null;
  }
}

export async function fetchProjects(): Promise<ApiProjectCard[]> {
  if (!USE_REAL_API) return dummyProjects();
  try {
    const r = await fetch(`${API_BASE_URL}/api/projects`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    return Array.isArray(data) && data.length ? data : dummyProjects();
  } catch {
    return dummyProjects();
  }
}

export async function fetchProject(slug: string): Promise<ApiProjectDetail | null> {
  if (!USE_REAL_API) return dummyProjectDetail(slug);
  try {
    const r = await fetch(`${API_BASE_URL}/api/projects/${slug}`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    if (!data || !data.id) return dummyProjectDetail(slug);
    return data;
  } catch {
    return dummyProjectDetail(slug);
  }
}

export async function fetchHighlights(): Promise<ApiProjectCard[]> {
  if (!USE_REAL_API) return dummyProjects().slice(0, 5);
  try {
    const r = await fetch(`${API_BASE_URL}/api/home/project-highlights`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    if (Array.isArray(data) && data.length) return data.slice(0, 5);
    return dummyProjects().slice(0, 5);
  } catch {
    return dummyProjects().slice(0, 5);
  }
}

/* ---------- Admin fetchers (no dummy fallback, always real API) ---------- */
export async function fetchProjectsAdmin(): Promise<ApiProjectCard[]> {
  const r = await fetch(`${API_BASE_URL}/api/projects`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchProjectAdmin(slug: string): Promise<ApiProjectDetail | null> {
  const r = await fetch(`${API_BASE_URL}/api/projects/${slug}`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.json();
}

export async function fetchComponentsAdmin(): Promise<ApiProjectComponent[]> {
  const r = await fetch(`${API_BASE_URL}/api/project-components`, { headers: getAuthHeaders() });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();
  return Array.isArray(data) ? data : [];
}
