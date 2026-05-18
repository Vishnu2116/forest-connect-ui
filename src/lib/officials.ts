import { API_BASE_URL, USE_REAL_API, getAuthHeaders, getAuthJsonHeaders } from "@/config/api";
import { elementLeadership } from "@/data/content";

export interface ApiOfficial {
  id: string;
  name: string;
  designation: string;
  organisation?: string | null;
  division_office?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  photo_path?: string | null;
  bio?: string | null;
  category_name?: string | null;
  category_id?: string | null;
  show_in_whos_who?: boolean;
  show_in_directory?: boolean;
  display_order?: number;
}

export interface OfficialCategoryGroup {
  category_id: string;
  category_name: string;
  officials: ApiOfficial[];
}

export function resolvePhoto(photo_path?: string | null): string | null {
  if (!photo_path) return null;
  if (photo_path.startsWith("http")) return photo_path;
  if (photo_path.startsWith("/")) return `${API_BASE_URL ?? ""}${photo_path}`;
  return photo_path;
}

// Backwards-compat re-export so existing imports keep working.
export { getAuthHeaders as authHeaders } from "@/config/api";

/** Convert built-in dummy leadership into the grouped API shape, used as fallback. */
export function dummyGrouped(): OfficialCategoryGroup[] {
  return [
    {
      category_id: "dummy-element",
      category_name: "PROJECT ELEMENT Leadership",
      officials: elementLeadership.map((o, i) => ({
        id: `dummy-${i}`,
        name: o.name,
        designation: o.designation,
        organisation: o.department,
        division_office: o.office ?? null,
        phone: o.phone ?? null,
        mobile: o.mobile ?? null,
        email: o.email ?? (o.emails?.[0] ?? null),
        photo_path: null,
        bio: null,
      })),
    },
  ];
}

export async function fetchGrouped(
  path: "whos-who" | "directory",
  search?: string,
): Promise<OfficialCategoryGroup[]> {
  if (!USE_REAL_API) return dummyGrouped();
  try {
    const qs = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`${API_BASE_URL}/api/about/${path}${qs}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return search ? [] : dummyGrouped();
    }
    return data;
  } catch {
    return search ? [] : dummyGrouped();
  }
}
