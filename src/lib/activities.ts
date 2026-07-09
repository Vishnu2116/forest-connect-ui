import { API_BASE_URL, getAuthHeaders, getAuthJsonHeaders, handleApiResponse } from "@/config/api";

export interface ActivityProjectCard {
  id: string;
  title: string;
  slug?: string;
  thumbnail_image_path?: string | null;
}

export interface ActivityStat {
  label: string;
  value: string;
}

export interface ActivityImage {
  id: string;
  image_path: string;
  caption?: string | null;
}

export interface ActivityProjectDetailResponse {
  project: ActivityProjectCard;
  paragraph?: string | null;
  bullet_points?: string[] | null;
  stats?: ActivityStat[] | null;
  images?: ActivityImage[] | null;
}

export interface AdminActivityProjectRow {
  id: string;
  title: string;
  slug?: string;
  thumbnail_image_path?: string | null;
  component_id?: string | null;
  activity_project_id?: string | null;
  paragraph?: string | null;
  bullet_points?: string[] | null;
  stats?: ActivityStat[] | null;
  activity_is_active?: boolean;
  has_activity_content?: boolean;
}

export interface AdminActivityProjectDetail {
  project: ActivityProjectCard;
  paragraph?: string | null;
  bullet_points?: string[] | null;
  stats?: ActivityStat[] | null;
  is_active?: boolean;
  images?: ActivityImage[] | null;
}

// -------- Public --------
export async function fetchActivityProjects(): Promise<ActivityProjectCard[]> {
  try {
    const r = await fetch(`${API_BASE_URL}/api/activities/projects`);
    if (!r.ok) return [];
    const data = await r.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchActivityProject(id: string): Promise<ActivityProjectDetailResponse | null> {
  try {
    const r = await fetch(`${API_BASE_URL}/api/activities/projects/${id}`);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// -------- Admin --------
export async function adminFetchActivityProjects(): Promise<AdminActivityProjectRow[]> {
  const r = await fetch(`${API_BASE_URL}/api/admin/activity-projects`, { headers: getAuthHeaders() });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Failed to load");
  const data = await r.json();
  return Array.isArray(data) ? data : [];
}

export async function adminFetchActivityProject(projectId: string): Promise<AdminActivityProjectDetail | null> {
  const r = await fetch(`${API_BASE_URL}/api/admin/activity-projects/${projectId}`, { headers: getAuthHeaders() });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Failed to load");
  return await r.json();
}

export async function adminSaveActivityProject(
  projectId: string,
  body: { paragraph: string; bullet_points: string[]; stats: ActivityStat[]; is_active: boolean }
) {
  const r = await fetch(`${API_BASE_URL}/api/admin/activity-projects/${projectId}`, {
    method: "PUT",
    headers: getAuthJsonHeaders(),
    body: JSON.stringify(body),
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Save failed");
  return r.json().catch(() => ({}));
}

export async function adminUploadActivityImages(projectId: string, files: File[]) {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f, f.name));
  const r = await fetch(`${API_BASE_URL}/api/admin/activity-projects/${projectId}/images`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: fd,
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Upload failed");
  return r.json().catch(() => ({}));
}

export async function adminDeleteActivityImage(imageId: string) {
  const r = await fetch(`${API_BASE_URL}/api/admin/activity-projects/images/${imageId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Delete failed");
}
