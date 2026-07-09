import { useEffect, useRef, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2, Save, X, Upload, Image as ImageIcon, Trees } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, USE_REAL_API, getAuthHeaders } from "@/config/api";
import {
  fetchProjectsAdmin, fetchProjectAdmin, fetchComponentsAdmin,
  resolveImage, statusLabel,
  type ApiProjectCard, type ApiProjectDetail, type ApiProjectComponent,
} from "@/lib/projects";

interface FormState {
  id: string | null;
  title: string;
  component_id: string;
  description: string;
  bullet_points: string[];
  display_order: number;
  is_active: boolean;
  thumbnail_image_path: string | null;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
  slug?: string;
  /* Removed fields — commented out, do not delete
  subtitle: string;
  status: "ongoing" | "pilot_phase" | "completed";
  objective: string;
  beneficiaries: string;
  timeline_start: string;
  timeline_end: string;
  coverage: string;
  about: string;
  community_impact: string;
  livelihood_opportunities: string;
  landscape_development_benefits: string;
  key_activities: string[];
  expected_outcomes: string[];
  area_covered: string;
  households: string;
  districts: string;
  gallery: ApiGalleryImage[];
  */
}

function emptyForm(): FormState {
  return {
    id: null,
    title: "",
    component_id: "",
    description: "",
    bullet_points: [],
    display_order: 0,
    is_active: true,
    thumbnail_image_path: null,
    thumbnailFile: null,
    thumbnailPreview: null,
  };
}

export default function ProjectsAdmin() {
  const [items, setItems] = useState<ApiProjectCard[]>([]);
  const [components, setComponents] = useState<ApiProjectComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!USE_REAL_API) {
      toast.error("Admin requires the real API. Run the backend locally.");
      setItems([]);
      setComponents([]);
      return;
    }
    setLoading(true);
    try {
      const [p, c] = await Promise.all([fetchProjectsAdmin(), fetchComponentsAdmin()]);
      setItems(p);
      setComponents(c);
    } catch (e: any) {
      toast.error(`Failed to load projects: ${e?.message || "request failed"}`);
      setItems([]);
      setComponents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => setEditing(emptyForm());

  const openEdit = async (p: ApiProjectCard) => {
    try {
      const detail = await fetchProjectAdmin(p.slug);
      if (!detail) { toast.error("Failed to load project"); return; }
      setEditing(detailToForm(detail));
    } catch (e: any) {
      toast.error(`Failed to load project: ${e?.message || "request failed"}`);
    }
  };

  const remove = async (p: ApiProjectCard) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    if (!USE_REAL_API) return;
    try {
      const r = await fetch(`${API_BASE_URL}/api/admin/projects/${p.id}`, {
        method: "DELETE", headers: getAuthHeaders(),
      });
      if (!r.ok) throw new Error();
      toast.success("Project deleted");
      await load();
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim()) { toast.error("Title is required"); return; }
    if (!editing.component_id) { toast.error("Component is required"); return; }
    if (!USE_REAL_API) { toast.success("Saved (preview only)"); setEditing(null); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", editing.title);
      fd.append("component_id", editing.component_id);
      fd.append("description", editing.description);
      fd.append(
        "bullet_points",
        JSON.stringify((editing.bullet_points || []).map((s) => s.trim()).filter(Boolean))
      );
      fd.append("display_order", String(editing.display_order || 0));
      fd.append("is_active", editing.is_active ? "true" : "false");
      if (editing.thumbnailFile) fd.append("thumbnail", editing.thumbnailFile);
      /* Removed fields — do not send
      fd.append("subtitle", editing.subtitle);
      fd.append("status", editing.status);
      fd.append("objective", editing.objective);
      fd.append("beneficiaries", editing.beneficiaries);
      fd.append("timeline_start", editing.timeline_start);
      fd.append("timeline_end", editing.timeline_end);
      fd.append("coverage", editing.coverage);
      fd.append("about", editing.about);
      fd.append("community_impact", editing.community_impact);
      fd.append("livelihood_opportunities", editing.livelihood_opportunities);
      fd.append("landscape_development_benefits", editing.landscape_development_benefits);
      fd.append("key_activities", JSON.stringify(editing.key_activities.filter((s) => s.trim())));
      fd.append("expected_outcomes", JSON.stringify(editing.expected_outcomes.filter((s) => s.trim())));
      fd.append("area_covered", editing.area_covered);
      fd.append("households", editing.households);
      fd.append("districts", editing.districts);
      */

      const url = editing.id
        ? `${API_BASE_URL}/api/admin/projects/${editing.id}`
        : `${API_BASE_URL}/api/admin/projects`;
      const r = await fetch(url, {
        method: editing.id ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: fd,
      });
      if (!r.ok) throw new Error();
      toast.success(editing.id ? "Project updated" : "Project created");
      setEditing(null);
      await load();
    } catch {
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Projects"
        subtitle="Manage projects."
        action={
          <Button onClick={openCreate} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Project
          </Button>
        }
      />

      {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>}

      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="py-2 px-3">Thumb</th>
              <th className="py-2 px-3">Title</th>
              <th className="py-2 px-3">Component</th>
              <th className="py-2 px-3 w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const img = resolveImage(p.thumbnail_image_path);
              return (
                <tr key={p.id} className="border-t border-border align-top">
                  <td className="py-2 px-3">
                    <div className="h-10 w-14 rounded bg-surface overflow-hidden flex items-center justify-center">
                      {img ? <img src={img} alt={p.title} className="h-full w-full object-cover" /> : <Trees className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </td>
                  <td className="py-2 px-3 font-semibold">{p.title}</td>
                  <td className="py-2 px-3 text-muted-foreground">{p.component?.label || "—"}</td>
                  <td className="py-2 px-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => remove(p)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && items.length === 0 && (
              <tr><td colSpan={4} className="text-center text-muted-foreground py-6">No projects yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Editor
          form={editing}
          setForm={setEditing}
          components={components}
          onSave={save}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}
    </>
  );
}

function detailToForm(d: ApiProjectDetail): FormState {
  return {
    id: d.id,
    title: d.title || "",
    component_id: d.component?.id || "",
    description: (d as any).description || "",
    bullet_points: Array.isArray((d as any).bullet_points) ? (d as any).bullet_points : [],
    display_order: (d as any).display_order || 0,
    is_active: (d as any).is_active !== false,
    thumbnail_image_path: d.thumbnail_image_path || null,
    thumbnailFile: null,
    thumbnailPreview: null,
    slug: d.slug,
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">{label}</label>
      {children}
    </div>
  );
}

interface EditorProps {
  form: FormState;
  setForm: (f: FormState) => void;
  components: ApiProjectComponent[];
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

function Editor({ form, setForm, components, onSave, onCancel, saving }: EditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormState, v: any) => setForm({ ...form, [k]: v });

  const onPickThumb = (file: File | null) => {
    if (!file) return;
    setForm({ ...form, thumbnailFile: file, thumbnailPreview: URL.createObjectURL(file) });
  };

  const thumbSrc = form.thumbnailPreview ?? resolveImage(form.thumbnail_image_path);

  const updateBullet = (i: number, v: string) => {
    const next = [...form.bullet_points];
    next[i] = v;
    setForm({ ...form, bullet_points: next });
  };
  const addBullet = () => setForm({ ...form, bullet_points: [...form.bullet_points, ""] });
  const removeBullet = (i: number) => {
    const next = [...form.bullet_points];
    next.splice(i, 1);
    setForm({ ...form, bullet_points: next });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto" onClick={onCancel}>
      <div className="bg-card rounded-xl shadow-elevated w-full max-w-3xl my-8 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">{form.id ? "Edit Project" : "New Project"}</h3>
          <button onClick={onCancel} className="p-1 rounded hover:bg-surface"><X className="h-4 w-4" /></button>
        </div>

        <div className="grid md:grid-cols-[180px_1fr] gap-4">
          {/* Thumbnail */}
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickThumb(e.target.files?.[0] ?? null)} />
            <div
              onClick={() => fileRef.current?.click()}
              className="aspect-[4/3] w-full bg-surface border border-dashed border-border rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40"
            >
              {thumbSrc ? (
                <img src={thumbSrc} alt={form.title} className="h-full w-full object-cover" />
              ) : (
                <div className="text-center px-2">
                  <ImageIcon className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Click to upload thumbnail</p>
                </div>
              )}
            </div>
            <Button size="sm" variant="outline" className="w-full mt-2 gap-1 text-xs" onClick={() => fileRef.current?.click()}>
              <Upload className="h-3 w-3" /> {thumbSrc ? "Replace" : "Upload"}
            </Button>
          </div>

          {/* Main fields */}
          <div className="space-y-3">
            <Field label="Title *"><Input value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
            <Field label="Component *">
              <select
                value={form.component_id}
                onChange={(e) => set("component_id", e.target.value)}
                className="w-full border border-input rounded h-10 px-2 text-sm bg-background"
              >
                <option value="">— Select —</option>
                {components.map((c) => <option key={c.id} value={c.id}>{c.label || c.name}</option>)}
              </select>
            </Field>
            <Field label="Description">
              <Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Bullet Points</label>
              <Button type="button" size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={addBullet}>
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {form.bullet_points.map((v, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={v} onChange={(e) => updateBullet(i, e.target.value)} placeholder="Bullet point" />
                  <Button type="button" size="sm" variant="outline" className="text-destructive" onClick={() => removeBullet(i)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {form.bullet_points.length === 0 && (
                <p className="text-xs text-muted-foreground">No bullet points.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Display order">
              <Input type="number" value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value) || 0)} />
            </Field>
            <Field label="Active">
              <label className="flex items-center gap-2 h-10">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => set("is_active", e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-muted-foreground">Show on public site</span>
              </label>
            </Field>
          </div>

          {/* Removed fields (commented out — do not delete):
              subtitle, status, objective, beneficiaries, timeline start/end, coverage,
              about, community impact, livelihood opportunities, landscape development benefits,
              key activities, expected outcomes, area covered, households, districts,
              and the entire project gallery upload section. */}
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
