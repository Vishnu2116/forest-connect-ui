import { useEffect, useState } from "react";
import { fetchPublicWithFallback } from "@/lib/api";

export type KHItem = {
  id: string;
  title: string;
  slug?: string;
  short_description?: string;
  description?: string;
  language?: string;
  publish_date?: string | null;
  year?: number | null;
  file_url?: string | null;
  file_original_name?: string | null;
  file_size?: string | null;
  file_format?: string | null;
  thumbnail_url?: string | null;
  external_url?: string | null;
  is_downloadable?: boolean;
  category_name?: string;
  category_slug?: string;
  display_style?: "table" | "card";
};

export type KHCategoryPayload = {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    display_style: "table" | "card";
  } | null;
  items: KHItem[];
  total: number;
};

/**
 * Map the KnowledgeHub UI category label (used by routes today, e.g. "Reports",
 * "IEC Materials") to the backend category slug.
 */
export const KH_CATEGORY_SLUG: Record<string, string> = {
  Publications: "publications",
  Reports: "reports",
  "IEC Materials": "iec-materials",
  Newsletters: "newsletters",
  "Success Stories": "success-stories",
  "Thematic Studies": "thematic-studies",
  Documentation: "documentation",
  "Case Studies": "case-studies",
  Notifications: "notifications",
  "Lessons Learned": "lessons-learned",
};

export function useKnowledgeHubItems(
  categoryName: string,
  fallback: KHItem[] = []
): { data: KHCategoryPayload; loading: boolean } {
  const slug = KH_CATEGORY_SLUG[categoryName] || categoryName.toLowerCase();
  const [data, setData] = useState<KHCategoryPayload>({
    category: null,
    items: fallback,
    total: fallback.length,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const result = await fetchPublicWithFallback<KHCategoryPayload>(
        `/api/public/knowledge-hub/${slug}`,
        { category: null, items: fallback, total: fallback.length }
      );
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return { data, loading };
}
