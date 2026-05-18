import { useEffect, useState } from "react";
import { fetchPublicWithFallback } from "@/lib/api";

export type ProcurementDocument = {
  id: number;
  document_title?: string;
  document_type?: string;
  language?: string;
  is_downloadable?: boolean;
  display_order?: number;
  file_id?: number;
  file_url?: string;
  original_name?: string;
  mime_type?: string;
  file_size?: number;
};

export type ProcurementItem = {
  id: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  title: string;
  slug?: string;
  reference_number?: string | null;
  short_description?: string | null;
  description?: string | null;
  published_date?: string | null;
  deadline_date?: string | null;
  deadline_time?: string | null;
  procurement_status?: "open" | "closing_soon" | "closed" | "cancelled" | "awarded";
  year?: number | null;
  show_in_whats_new?: boolean;
  is_featured?: boolean;
  display_order?: number;
  documents?: ProcurementDocument[];
};

export type ProcurementListPayload = {
  items: ProcurementItem[];
  total: number;
  page: number;
  limit: number;
  offset: number;
};

export const PROCUREMENT_STATUS_LABEL: Record<string, string> = {
  open: "Open",
  closing_soon: "Closing Soon",
  closed: "Closed",
  cancelled: "Cancelled",
  awarded: "Awarded",
};

export function usePublicProcurements(
  categorySlug: "rfps" | "tenders" | "corrigendum" | "award-notices",
  fallback: ProcurementItem[] = []
): { data: ProcurementListPayload; loading: boolean } {
  const [data, setData] = useState<ProcurementListPayload>({
    items: fallback, total: fallback.length, page: 1, limit: 20, offset: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const result = await fetchPublicWithFallback<ProcurementListPayload>(
        `/api/public/procurements?category=${categorySlug}`,
        { items: fallback, total: fallback.length, page: 1, limit: 20, offset: 0 }
      );
      if (!cancelled) { setData(result); setLoading(false); }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);

  return { data, loading };
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  } catch { return ""; }
}
