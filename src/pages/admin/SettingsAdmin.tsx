import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AdminPageHeader } from "./AdminLayout";
import { API_BASE_URL, USE_REAL_API, getAuthHeaders, getAuthJsonHeaders, handleApiResponse } from "@/config/api";
import { useSettings } from "@/contexts/SettingsContext";

interface SettingsForm {
  website_title: string;
  office_address: string;
  contact_email: string;
  contact_phone: string;
  helpline_number: string;
}

const empty: SettingsForm = {
  website_title: "",
  office_address: "",
  contact_email: "",
  contact_phone: "",
  helpline_number: "",
};

export default function SettingsAdmin() {
  const [form, setForm] = useState<SettingsForm>(empty);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { refresh } = useSettings();

  const update = (field: keyof SettingsForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const load = async () => {
    if (!USE_REAL_API) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, { headers: getAuthHeaders() });
      await handleApiResponse(res);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm({
        website_title: data.website_title ?? "",
        office_address: data.office_address ?? "",
        contact_email: data.contact_email ?? "",
        contact_phone: data.contact_phone ?? "",
        helpline_number: data.helpline_number ?? "",
      });
    } catch {
      toast.error("Unable to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!USE_REAL_API) {
      toast.success("Saved (preview only)");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: "PUT",
        headers: getAuthJsonHeaders(),
        body: JSON.stringify(form),
      });
      await handleApiResponse(res);
      if (!res.ok) throw new Error();
      toast.success("Settings saved");
      await refresh();
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader title="Settings" subtitle="Configure website-wide branding and contact details." />
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}
      <form onSubmit={save} className="bg-card border border-border rounded-md p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        <div className="md:col-span-2">
          <Label htmlFor="website_title">Website Title</Label>
          <Input id="website_title" value={form.website_title} onChange={update("website_title")} className="mt-1" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="office_address">Office Address</Label>
          <Textarea id="office_address" value={form.office_address} onChange={update("office_address")} rows={2} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input id="contact_email" type="email" value={form.contact_email} onChange={update("contact_email")} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input id="contact_phone" value={form.contact_phone} onChange={update("contact_phone")} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="helpline_number">Helpline Number</Label>
          <Input id="helpline_number" value={form.helpline_number} onChange={update("helpline_number")} className="mt-1" />
        </div>
        <div className="md:col-span-2 flex items-center justify-end border-t border-border pt-4">
          <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary-dark gap-1.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </Button>
        </div>
      </form>
    </>
  );
}
