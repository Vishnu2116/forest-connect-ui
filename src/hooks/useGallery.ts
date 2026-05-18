import { useEffect, useState } from "react";
import { fetchPublicWithFallback } from "@/lib/api";

export type GalleryItem = {
  id: string;
  album_id?: string | null;
  album_title?: string | null;
  album_slug?: string | null;
  event_id?: string | null;
  event_title?: string | null;
  event_slug?: string | null;
  media_id: string;
  title?: string | null;
  caption?: string | null;
  alt_text?: string | null;
  media_type: "image" | "video";
  taken_at?: string | null;
  location?: string | null;
  district?: string | null;
  is_featured?: boolean;
  display_order?: number;
  file_url?: string;
  original_name?: string;
  mime_type?: string;
  file_size?: number;
};

export type GalleryAlbum = {
  id: string;
  event_id?: string | null;
  event_title?: string | null;
  event_slug?: string | null;
  title: string;
  slug?: string;
  short_description?: string | null;
  description?: string | null;
  album_date?: string | null;
  location?: string | null;
  district?: string | null;
  cover_image_id?: string | null;
  cover_image_url?: string | null;
  cover_original_name?: string | null;
  is_featured?: boolean;
  status?: "draft" | "published" | "archived";
  display_order?: number;
  items_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type GalleryListPayload<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  offset: number;
};

export function usePublicGalleryItems(
  fallback: GalleryItem[] = []
): { data: GalleryListPayload<GalleryItem>; loading: boolean } {
  const [data, setData] = useState<GalleryListPayload<GalleryItem>>({
    items: fallback, total: fallback.length, page: 1, limit: 20, offset: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const result = await fetchPublicWithFallback<GalleryListPayload<GalleryItem>>(
        `/api/public/gallery`,
        { items: fallback, total: fallback.length, page: 1, limit: 20, offset: 0 }
      );
      if (!cancelled) { setData(result); setLoading(false); }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
}

export function formatGalleryDate(iso?: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  } catch { return ""; }
}
