import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL, USE_REAL_API } from "@/config/api";

export interface SiteSettings {
  website_title: string;
  office_address: string;
  contact_email: string;
  contact_phone: string;
  helpline_number: string;
}

const DEFAULTS: SiteSettings = {
  website_title: "ELEMENT — Enhancing Landscape and Ecosystem Management",
  office_address: "Aranya Bhawan, Agartala, Tripura — 799006",
  contact_email: "info@element.tripura.gov.in",
  contact_phone: "+91 381 2416403",
  helpline_number: "1800-345-3666",
};

interface Ctx {
  settings: SiteSettings;
  refresh: () => Promise<void>;
}

const SettingsContext = createContext<Ctx>({ settings: DEFAULTS, refresh: async () => {} });

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);

  const refresh = async () => {
    if (!USE_REAL_API) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && typeof data === "object") {
        setSettings({
          website_title: data.website_title || DEFAULTS.website_title,
          office_address: data.office_address || DEFAULTS.office_address,
          contact_email: data.contact_email || DEFAULTS.contact_email,
          contact_phone: data.contact_phone || DEFAULTS.contact_phone,
          helpline_number: data.helpline_number || DEFAULTS.helpline_number,
        });
      }
    } catch {
      // keep defaults
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, refresh }}>
      <TitleSync title={settings.website_title} />
      {children}
    </SettingsContext.Provider>
  );
}

function TitleSync({ title }: { title: string }) {
  const location = useLocation();
  useEffect(() => {
    document.title = title;
  }, [title, location.pathname]);
  return null;
}
