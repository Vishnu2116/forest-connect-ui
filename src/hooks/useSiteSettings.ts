import { useEffect, useState } from "react";
import { fetchPublicWithFallback } from "@/lib/api";

export type SiteSettings = {
  site_title: string;
  site_full_name: string;
  site_subtitle: string;
  default_language: string;
  last_updated_date: string;
  contact_email: string;
  contact_phone: string;
  footer_copyright: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
};

// Dummy fallback — mirrors what the static UI used before backend integration.
export const SITE_SETTINGS_FALLBACK: SiteSettings = {
  site_title: "ELEMENT",
  site_full_name: "Enhancing Landscape and Ecosystem Management",
  site_subtitle: "A joint initiative of Government of Tripura and The World Bank",
  default_language: "en",
  last_updated_date: "2026-04-28",
  contact_email: "info@element.tripura.gov.in",
  contact_phone: "+91 381 2416403",
  footer_copyright:
    "© 2026 ELEMENT – Government of Tripura & The World Bank. All rights reserved.",
  facebook_url: "#",
  twitter_url: "#",
  youtube_url: "#",
};

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(SITE_SETTINGS_FALLBACK);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchPublicWithFallback<SiteSettings>(
        "/api/public/site-settings",
        SITE_SETTINGS_FALLBACK
      );
      if (!cancelled) setSettings(data);
    })();
    return () => { cancelled = true; };
  }, []);
  return settings;
}
