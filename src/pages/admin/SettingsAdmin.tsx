import { useState } from "react";
import { Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminPageHeader } from "./AdminLayout";

export default function SettingsAdmin() {
  const [s, setS] = useState({
    siteTitle: "ELEMENT — Enhancing Landscape and Ecosystem Management",
    address: "Aranya Bhawan, Agartala, Tripura — 799006",
    email: "info@element.tripura.gov.in",
    phone: "+91 381 2416403",
    helpline: "1800-345-3666",
    footerLinks: "About Us, Projects, Reports, Plantation Locations, RTI, Grievance",
  });
  const [saved, setSaved] = useState(false);

  return (
    <>
      <AdminPageHeader title="Settings" subtitle="Configure website-wide branding and contact details." />
      <form onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className="bg-card border border-border rounded-md p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        <div className="md:col-span-2">
          <Label>Website Title</Label>
          <Input value={s.siteTitle} onChange={(e) => setS({ ...s, siteTitle: e.target.value })} className="mt-1" />
        </div>
        <div className="md:col-span-2">
          <Label>Office Address</Label>
          <Textarea value={s.address} onChange={(e) => setS({ ...s, address: e.target.value })} rows={2} className="mt-1" />
        </div>
        <div>
          <Label>Contact Email</Label>
          <Input value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} className="mt-1" />
        </div>
        <div>
          <Label>Contact Phone</Label>
          <Input value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} className="mt-1" />
        </div>
        <div>
          <Label>Helpline Number</Label>
          <Input value={s.helpline} onChange={(e) => setS({ ...s, helpline: e.target.value })} className="mt-1" />
        </div>
        <div>
          <Label>Logo Upload</Label>
          <div className="mt-1 border border-dashed border-border rounded-md p-3 text-xs bg-surface flex items-center gap-2">
            <Upload className="h-4 w-4 text-primary" />
            <input type="file" accept="image/*" className="text-xs" />
          </div>
        </div>
        <div className="md:col-span-2">
          <Label>Footer Links (comma-separated)</Label>
          <Textarea value={s.footerLinks} onChange={(e) => setS({ ...s, footerLinks: e.target.value })} rows={2} className="mt-1" />
        </div>
        <div className="md:col-span-2 flex items-center justify-between border-t border-border pt-4">
          {saved ? <span className="text-sm text-success">✓ Settings saved (demo only)</span> : <span />}
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-dark"><Save className="h-4 w-4" /> Save Settings</Button>
        </div>
      </form>
    </>
  );
}
