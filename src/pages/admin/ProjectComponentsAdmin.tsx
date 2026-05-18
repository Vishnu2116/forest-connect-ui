import { useEffect, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, USE_REAL_API } from "@/config/api";
import { authHeaders, fetchComponentsAdmin, type ApiProjectComponent } from "@/lib/projects";

interface FormState {
  id: string | null;
  component_number: number;
  label: string;
  name: string;
  description: string;
  icon_name: string;
  stat1_label: string; stat1_value: string;
  stat2_label: string; stat2_value: string;
  stat3_label: string; stat3_value: string;
  stat4_label: string; stat4_value: string;
  display_order: number;
}

function emptyForm(): FormState {
  return {
    id: null,
    component_number: 1,
    label: "",
    name: "",
    description: "",
    icon_name: "Trees",
    stat1_label: "", stat1_value: "",
    stat2_label: "", stat2_value: "",
    stat3_label: "", stat3_value: "",
    stat4_label: "", stat4_value: "",
    display_order: 0,
  };
}

export default function ProjectComponentsAdmin() {
  const [items, setItems] = useState<ApiProjectComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!USE_REAL_API) { setItems([]); return; }
    setLoading(true);
    try {
      setItems(await fetchComponentsAdmin());
    } catch (e: any) {
      toast.error(`Failed to load components: ${e?.message || "request failed"}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (c: ApiProjectComponent) =>
    setEditing({
      id: c.id,
      component_number: c.component_number ?? 1,
      label: c.label || "",
      name: c.name || "",
      description: c.description || "",
      icon_name: c.icon_name || "Trees",
      stat1_label: c.stat1_label || "", stat1_value: c.stat1_value || "",
      stat2_label: c.stat2_label || "", stat2_value: c.stat2_value || "",
      stat3_label: c.stat3_label || "", stat3_value: c.stat3_value || "",
      stat4_label: c.stat4_label || "", stat4_value: c.stat4_value || "",
      display_order: c.display_order ?? 0,
    });

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error("Name is required"); return; }
    if (!USE_REAL_API) { toast.success("Saved (preview only)"); setEditing(null); return; }
    setSaving(true);
    try {
      const body = { ...editing };
      delete (body as any).id;
      const url = editing.id
        ? `${API_BASE_URL}/api/admin/project-components/${editing.id}`
        : `${API_BASE_URL}/api/admin/project-components`;
      const r = await fetch(url, {
        method: editing.id ? "PUT" : "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error();
      toast.success(editing.id ? "Component updated" : "Component created");
      setEditing(null);
      await load();
    } catch {
      toast.error("Failed to save component");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: ApiProjectComponent) => {
    if (!confirm(`Delete "${c.name}"?`)) return;
    if (!USE_REAL_API) return;
    try {
      const r = await fetch(`${API_BASE_URL}/api/admin/project-components/${c.id}`, {
        method: "DELETE", headers: authHeaders(),
      });
      if (!r.ok) {
        let msg = "Failed to delete";
        try { const b = await r.json(); if (b?.message) msg = b.message; } catch {}
        toast.error(msg);
        return;
      }
      toast.success("Component deleted");
      await load();
    } catch {
      toast.error("Failed to delete component");
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Project Components"
        subtitle="Manage the four (or more) project components."
        action={
          <Button onClick={() => setEditing(emptyForm())} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Component
          </Button>
        }
      />

      {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>}

      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Label</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Order</th>
              <th className="py-2 px-3 w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="py-2 px-3">{c.component_number}</td>
                <td className="py-2 px-3 text-muted-foreground">{c.label}</td>
                <td className="py-2 px-3 font-semibold">{c.name}</td>
                <td className="py-2 px-3">{c.display_order ?? 0}</td>
                <td className="py-2 px-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => startEdit(c)}><Pencil className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => remove(c)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr><td colSpan={5} className="text-center text-muted-foreground py-6">No components yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Editor form={editing} setForm={setEditing} onSave={save} onCancel={() => setEditing(null)} saving={saving} />
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">{label}</label>
      {children}
    </div>
  );
}

function Editor({
  form, setForm, onSave, onCancel, saving,
}: {
  form: FormState; setForm: (f: FormState | null) => void;
  onSave: () => void; onCancel: () => void; saving: boolean;
}) {
  const set = (k: keyof FormState, v: any) => setForm({ ...form, [k]: v });
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto" onClick={onCancel}>
      <div className="bg-card rounded-xl shadow-elevated w-full max-w-2xl my-8 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">{form.id ? "Edit Component" : "New Component"}</h3>
          <button onClick={onCancel} className="p-1 rounded hover:bg-surface"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Number"><Input type="number" value={form.component_number} onChange={(e) => set("component_number", Number(e.target.value) || 1)} /></Field>
            <Field label="Display order"><Input type="number" value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value) || 0)} /></Field>
            <Field label="Icon name"><Input value={form.icon_name} onChange={(e) => set("icon_name", e.target.value)} placeholder="Trees / Leaf / Users…" /></Field>
          </div>
          <Field label="Label"><Input value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="PROJECT COMPONENT 1" /></Field>
          <Field label="Name *"><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Description"><Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field>

          <div className="border-t border-border pt-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Impact stats</h4>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="grid grid-cols-2 gap-3 mb-2">
                <Field label={`Stat ${n} label`}>
                  <Input value={(form as any)[`stat${n}_label`]} onChange={(e) => set(`stat${n}_label` as any, e.target.value)} />
                </Field>
                <Field label={`Stat ${n} value`}>
                  <Input value={(form as any)[`stat${n}_value`]} onChange={(e) => set(`stat${n}_value` as any, e.target.value)} />
                </Field>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave} disabled={saving} className="gap-1.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </Button>
        </div>
      </div>
    </div>
  );
}
