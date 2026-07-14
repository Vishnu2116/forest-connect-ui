import { API_BASE_URL, USE_REAL_API, getAuthHeaders, getAuthJsonHeaders, handleApiResponse } from "@/config/api";
import { plantations as dummyPlantations } from "@/data/content";

function dummySites(year?: number, district?: string): GisSite[] {
  const all: GisSite[] = dummyPlantations.map((p) => ({
    id: `dummy-${p.id}`,
    name: p.name,
    district: p.district,
    year: p.year,
    area_covered: `${p.area} hectares`,
    species_products: p.species,
    description: null,
    kml_files: [],
  }));
  return all.filter((s) =>
    (year == null || s.year === year) &&
    (!district || district === "All Districts" || s.district === district)
  );
}

function dummyYears(): number[] {
  return Array.from(new Set(dummyPlantations.map((p) => p.year))).sort((a, b) => b - a);
}

function dummyDistricts(): string[] {
  return Array.from(new Set(dummyPlantations.map((p) => p.district))).sort();
}

export interface GisKmlFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size?: number | null;
  display_order?: number;
}

export interface GisSite {
  id: string;
  // --- Legacy fields (commented out — replaced by new schema)
  // name?: string;
  // year?: number;
  // area_covered?: string | null;
  // species_products?: string | null;
  // description?: string | null;
  sl_no?: number | null;
  district: string;
  sub_division?: string | null;
  range?: string | null;
  beat?: string | null;
  jfmc_name: string;
  area_sanction?: number | null;
  area_kobo?: number | null;
  remarks?: string | null;
  overlapping_area?: string | null;
  display_order?: number | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  kml_files?: GisKmlFile[];
}


export const TRIPURA_DISTRICTS = [
  "West Tripura", "Sepahijala", "Khowai", "Gomati",
  "South Tripura", "Dhalai", "Unakoti", "North Tripura",
];

export function formatKmlSize(kb?: number | null): string {
  if (kb == null) return "";
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function resolveGisUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL ?? ""}${path.startsWith("/") ? "" : "/"}${path}`;
}

/* ---------- Public ---------- */
export async function fetchMapKey(): Promise<string | null> {
  if (!USE_REAL_API) return null;
  try {
    const r = await fetch(`${API_BASE_URL}/api/gis/map-key`);
    if (!r.ok) return null;
    const j = await r.json();
    return j?.key || null;
  } catch { return null; }
}

export async function fetchGisYears(): Promise<number[]> {
  if (!USE_REAL_API) return dummyYears();
  try {
    const r = await fetch(`${API_BASE_URL}/api/gis/years`);
    if (!r.ok) return dummyYears();
    const j = await r.json();
    const arr = Array.isArray(j) ? j : [];
    return arr.length ? arr : dummyYears();
  } catch { return dummyYears(); }
}

export async function fetchGisDistricts(): Promise<string[]> {
  if (!USE_REAL_API) return dummyDistricts();
  try {
    const r = await fetch(`${API_BASE_URL}/api/gis/districts`);
    if (!r.ok) return dummyDistricts();
    const j = await r.json();
    const arr = Array.isArray(j) ? j : [];
    return arr.length ? arr : dummyDistricts();
  } catch { return dummyDistricts(); }
}

export async function fetchGisSites(year: number, district?: string): Promise<GisSite[]> {
  if (!USE_REAL_API) return dummySites(year, district);
  try {
    const qs = new URLSearchParams({ year: String(year) });
    if (district && district !== "All Districts") qs.set("district", district);
    const r = await fetch(`${API_BASE_URL}/api/gis/sites?${qs.toString()}`);
    if (!r.ok) return dummySites(year, district);
    const j = await r.json();
    const arr = Array.isArray(j) ? j : [];
    return arr.length ? arr : dummySites(year, district);
  } catch { return dummySites(year, district); }
}

/* ---------- Admin ---------- */
export async function fetchGisSitesAdmin(): Promise<GisSite[]> {
  const r = await fetch(`${API_BASE_URL}/api/admin/gis/sites`, { headers: getAuthHeaders() });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const j = await r.json();
  return Array.isArray(j) ? j : (Array.isArray(j?.data) ? j.data : []);
}

export interface GisSitePayload {
  name: string;
  district: string;
  year: number;
  area_covered?: string;
  species_products?: string;
  description?: string;
}

export async function createGisSite(payload: GisSitePayload): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/gis/sites`, {
    method: "POST", headers: getAuthJsonHeaders(), body: JSON.stringify(payload),
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

export async function updateGisSite(id: string, payload: GisSitePayload): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/gis/sites/${id}`, {
    method: "PUT", headers: getAuthJsonHeaders(), body: JSON.stringify(payload),
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

export async function deleteGisSite(id: string): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/gis/sites/${id}`, {
    method: "DELETE", headers: getAuthHeaders(),
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

export async function uploadKml(siteId: string, file: File): Promise<void> {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch(`${API_BASE_URL}/api/admin/gis/sites/${siteId}/kml`, {
    method: "POST", headers: getAuthHeaders(), body: fd,
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

export async function deleteKml(kmlId: string): Promise<void> {
  const r = await fetch(`${API_BASE_URL}/api/admin/gis/kml/${kmlId}`, {
    method: "DELETE", headers: getAuthHeaders(),
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
}

/* ---------- Google Maps loader ---------- */
let mapsLoaderPromise: Promise<any> | null = null;

export function loadGoogleMaps(apiKey: string): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if ((window as any).google?.maps) return Promise.resolve((window as any).google);
  if (mapsLoaderPromise) return mapsLoaderPromise;
  mapsLoaderPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps]');
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).google || null));
      existing.addEventListener("error", () => resolve(null));
      return;
    }
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
    s.async = true;
    s.defer = true;
    s.dataset.googleMaps = "true";
    s.onload = () => resolve((window as any).google || null);
    s.onerror = () => { mapsLoaderPromise = null; resolve(null); };
    document.head.appendChild(s);
  });
  return mapsLoaderPromise;
}
