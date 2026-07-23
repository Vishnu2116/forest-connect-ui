import { API_BASE_URL, USE_REAL_API, getAuthHeaders, getAuthJsonHeaders, handleApiResponse } from "@/config/api";

export const fileUrl = (p?: string | null) =>
  !p ? "" : (p.startsWith("http") ? p : `${API_BASE_URL}${p}`);

export const formatEventDate = (d?: string | null) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
};

export const youtubeEmbed = (url: string) => {
  if (!url) return "";
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      if (/^[\w-]{11}$/.test(id)) return `https://www.youtube.com/embed/${id}`;
    } else if (host === "youtube.com") {
      const embedMatch = u.pathname.match(/^\/embed\/([\w-]{11})$/);
      if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;
      const v = u.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return `https://www.youtube.com/embed/${v}`;
    }
  } catch {}
  return "";
};

// -------- Public --------
export async function fetchGallery() {
  if (!USE_REAL_API) return [];
  const r = await fetch(`${API_BASE_URL}/api/media/gallery`);
  if (!r.ok) return [];
  return r.json();
}
export async function fetchGalleryDistricts() {
  if (!USE_REAL_API) return [];
  const r = await fetch(`${API_BASE_URL}/api/media/gallery/districts`);
  if (!r.ok) return [];
  return r.json();
}
export async function fetchGalleryByDistrict(district: string) {
  if (!USE_REAL_API) return [];
  const r = await fetch(`${API_BASE_URL}/api/media/gallery/${encodeURIComponent(district)}`);
  if (!r.ok) return [];
  return r.json();
}

export async function fetchEvents() {
  if (!USE_REAL_API) return [];
  const r = await fetch(`${API_BASE_URL}/api/media/events`);
  if (!r.ok) return [];
  return r.json();
}
export async function fetchEvent(slug: string) {
  if (!USE_REAL_API) return null;
  const r = await fetch(`${API_BASE_URL}/api/media/events/${slug}`);
  if (!r.ok) return null;
  return r.json();
}
export async function fetchSocial() {
  if (!USE_REAL_API) return null;
  const r = await fetch(`${API_BASE_URL}/api/media/social`);
  if (!r.ok) return null;
  return r.json();
}

// -------- Admin --------
export async function adminUploadGallery(files: File[], district?: string) {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f, f.name));
  if (district) fd.append("district", district);
  const r = await fetch(`${API_BASE_URL}/api/admin/gallery`, { method: "POST", headers: getAuthHeaders(), body: fd });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Upload failed");
  return r.json().catch(() => ({}));
}

export async function adminDeleteGallery(id: string) {
  const r = await fetch(`${API_BASE_URL}/api/admin/gallery/${id}`, { method: "DELETE", headers: getAuthHeaders() });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Delete failed");
}

export async function adminSaveEvent(data: { id?: string; title: string; event_date: string; description?: string; cover?: File | null }) {
  const fd = new FormData();
  fd.append("title", data.title);
  fd.append("event_date", data.event_date);
  if (data.description !== undefined) fd.append("description", data.description);
  if (data.cover) fd.append("cover", data.cover, data.cover.name);
  const url = data.id ? `${API_BASE_URL}/api/admin/events/${data.id}` : `${API_BASE_URL}/api/admin/events`;
  const r = await fetch(url, { method: data.id ? "PUT" : "POST", headers: getAuthHeaders(), body: fd });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Save failed");
  return r.json().catch(() => ({}));
}
export async function adminDeleteEvent(id: string) {
  const r = await fetch(`${API_BASE_URL}/api/admin/events/${id}`, { method: "DELETE", headers: getAuthHeaders() });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Delete failed");
}
export async function adminAddEventImages(id: string, files: File[]) {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f, f.name));
  const r = await fetch(`${API_BASE_URL}/api/admin/events/${id}/images`, { method: "POST", headers: getAuthHeaders(), body: fd });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Upload failed");
}
export async function adminDeleteEventImage(id: string) {
  const r = await fetch(`${API_BASE_URL}/api/admin/events/images/${id}`, { method: "DELETE", headers: getAuthHeaders() });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Delete failed");
}
export async function adminToggleEventImageGallery(id: string) {
  const r = await fetch(`${API_BASE_URL}/api/admin/events/images/${id}/toggle-gallery`, { method: "PUT", headers: getAuthHeaders() });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Toggle failed");
}

export async function adminSaveEmbeds(body: { facebook_embed_code: string; twitter_embed_code: string }) {
  const r = await fetch(`${API_BASE_URL}/api/admin/social-media/embeds`, {
    method: "PUT", headers: getAuthJsonHeaders(), body: JSON.stringify(body),
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Save failed");
}
export async function adminSaveVideo(data: { id?: string; title: string; youtube_url: string; display_order: number }) {
  const url = data.id
    ? `${API_BASE_URL}/api/admin/social-media/videos/${data.id}`
    : `${API_BASE_URL}/api/admin/social-media/videos`;
  const r = await fetch(url, {
    method: data.id ? "PUT" : "POST",
    headers: getAuthJsonHeaders(),
    body: JSON.stringify({ title: data.title, youtube_url: data.youtube_url, display_order: data.display_order }),
  });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Save failed");
}
export async function adminDeleteVideo(id: string) {
  const r = await fetch(`${API_BASE_URL}/api/admin/social-media/videos/${id}`, { method: "DELETE", headers: getAuthHeaders() });
  await handleApiResponse(r);
  if (!r.ok) throw new Error("Delete failed");
}
