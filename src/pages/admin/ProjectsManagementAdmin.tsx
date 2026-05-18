import { useEffect, useRef, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2, Save, X, Upload, Image as ImageIcon, Trees } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, USE_REAL_API } from "@/config/api";
import {
  authHeaders, fetchProjects, fetchProject, fetchComponents,
  resolveImage, statusLabel,
  type ApiProjectCard, type ApiProjectDetail, type ApiProjectComponent, type ApiGalleryImage,
} from "@/lib/projects";

interface FormState {
  id: string | null;
  title: string;
  component_id: string;
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
  display_order: number;
  thumbnail_image_path: string | null;
  thumbnailFile: File | null;
  thumbnailPreview: string | null;
  gallery: ApiGalleryImage[];
  slug?: string;
}

function emptyForm(): FormState {
  return {
    id: null,
    title: "",
    component_id: "",
    subtitle: "",
    status: "ongoing",
    objective: "",
    beneficiaries: "",
    timeline_start: "",
    timeline_end: "",
    coverage: "",
    about: "",
    community_impact: "",
    livelihood_opportunities: "",
    landscape_development_benefits: "",
    key_activities: [],
    expected_outcomes: [],
    area_covered: "",
    households: "",
    districts: "",
    display_order: 0,
    thumbnail_image_path: null,
    thumbnailFile: null,
    thumbnailPreview: null,
    gallery: [],
  };
}

export default function ProjectsAdmin() {
  const [items, setItems] = useState<ApiProjectCard[]>([]);
  const [components, setComponents] = useState<ApiProjectComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([fetchProjects(), fetchComponents()]);
      setItems(p);
      setComponents(c);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => setEditing(emptyForm());

  const openEdit = async (p: ApiProjectCard) => {
    // Fetch full detail by slug to populate editor
    const detail = await fetchProject(p.slug);
    if (!detail) { toast.error("Failed to load project"); return; }
    setEditing(detailToForm(detail));
  };

  const remove = async (p: ApiProjectCard) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    if (!USE_REAL_API) return;
    try {
      const r = await fetch(`${API_BASE_URL}/api/admin/projects/${p.id}`, {
        method: "DELETE", headers: authHeaders(),
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
      fd.append("display_order", String(editing.display_order || 0));
      if (editing.thumbnailFile) fd.append("thumbnail", editing.thumbnailFile);

      const url = editing.id
        ? `${API_BASE_URL}/api/admin/projects/${editing.id}`
        : `${API_BASE_URL}/api/admin/projects`;
      const r = await fetch(url, {
        method: editing.id ? "PUT" : "POST",
        headers: authHeaders(),
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
        subtitle="Manage projects, content sections, and gallery images."
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
              <th className="py-2 px-3">Status</th>
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
                  <td className="py-2 px-3 text-muted-foreground">{statusLabel(p.status)}</td>
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
              <tr><td colSpan={5} className="text-center text-muted-foreground py-6">No projects yet.</td></tr>
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
          onGalleryChanged={async () => {
            if (!editing.id) return;
            const detail = await fetchProject(editing.slug || "");
            if (detail) setEditing({ ...editing, gallery: detail.gallery || [] });
          }}
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
    subtitle: d.subtitle || "",
    status: (d.status as any) || "ongoing",
    objective: d.objective || "",
    beneficiaries: d.beneficiaries || "",
    timeline_start: d.timeline_start || "",
    timeline_end: d.timeline_end || "",
    coverage: d.coverage || "",
    about: d.about || "",
    community_impact: d.community_impact || "",
    livelihood_opportunities: d.livelihood_opportunities || "",
    landscape_development_benefits: d.landscape_development_benefits || "",
    key_activities: d.key_activities || [],
    expected_outcomes: d.expected_outcomes || [],
    area_covered: d.area_covered || "",
    households: d.households || "",
    districts: d.districts || "",
    display_order: 0,
    thumbnail_image_path: d.thumbnail_image_path || null,
    thumbnailFile: null,
    thumbnailPreview: null,
    gallery: d.gallery || [],
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
  onGalleryChanged: () => Promise<void> | void;
}

function Editor({ form, setForm, components, onSave, onCancel, saving, onGalleryChanged }: EditorProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const set = (k: keyof FormState, v: any) => setForm({ ...form, [k]: v });

  const onPickThumb = (file: File | null) => {
    if (!file) return;
    setForm({ ...form, thumbnailFile: file, thumbnailPreview: URL.createObjectURL(file) });
  };

  const thumbSrc = form.thumbnailPreview ?? resolveImage(form.thumbnail_image_path);

  // List item helpers
  const updateListItem = (k: "key_activities" | "expected_outcomes", i: number, v: string) => {
    const next = [...form[k]];
    next[i] = v;
    setForm({ ...form, [k]: next });
  };
  const addListItem = (k: "key_activities" | "expected_outcomes") =>
    setForm({ ...form, [k]: [...form[k], ""] });
  const removeListItem = (k: "key_activities" | "expected_outcomes", i: number) => {
    const next = [...form[k]];
    next.splice(i, 1);
    setForm({ ...form, [k]: next });
  };

  // Gallery
  const uploadGallery = async (files: FileList | null) => {
    if (!files || !files.length) return;
    if (!form.id) { toast.error("Save the project first before adding gallery images"); return; }
    if (!USE_REAL_API) { toast.success("Uploaded (preview only)"); return; }
    setUploadingGallery(true);
    try {
      const fd = new FormData();
      Array.from(files).slice(0, 10).forEach((f) => fd.append("images", f));
      const r = await fetch(`${API_BASE_URL}/api/admin/projects/${form.id}/gallery`, {
        method: "POST", headers: authHeaders(), body: fd,
      });
      if (!r.ok) throw new Error();
      toast.success("Images uploaded");
      await onGalleryChanged();
    } catch {
      toast.error("Failed to upload images");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImg = async (img: ApiGalleryImage) => {
    if (!confirm("Delete this image?")) return;
    if (!USE_REAL_API) return;
    try {
      const r = await fetch(`${API_BASE_URL}/api/admin/projects/gallery/${img.id}`, {
        method: "DELETE", headers: authHeaders(),
      });
      if (!r.ok) throw new Error();
      toast.success("Image deleted");
      await onGalleryChanged();
    } catch {
      toast.error("Failed to delete image");
    }
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
            <Field label="Subtitle"><Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3">
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
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as any)}
                  className="w-full border border-input rounded h-10 px-2 text-sm bg-background"
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="pilot_phase">Pilot Phase</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <Field label="Objective"><Textarea rows={2} value={form.objective} onChange={(e) => set("objective", e.target.value)} /></Field>
          <Field label="Beneficiaries"><Input value={form.beneficiaries} onChange={(e) => set("beneficiaries", e.target.value)} /></Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Timeline start"><Input value={form.timeline_start} onChange={(e) => set("timeline_start", e.target.value)} placeholder="2024" /></Field>
            <Field label="Timeline end"><Input value={form.timeline_end} onChange={(e) => set("timeline_end", e.target.value)} placeholder="Ongoing" /></Field>
          </div>
          <Field label="Coverage"><Input value={form.coverage} onChange={(e) => set("coverage", e.target.value)} /></Field>

          <Field label="About"><Textarea rows={4} value={form.about} onChange={(e) => set("about", e.target.value)} /></Field>

          <DynamicList label="Key activities" items={form.key_activities}
            onChange={(i, v) => updateListItem("key_activities", i, v)}
            onAdd={() => addListItem("key_activities")}
            onRemove={(i) => removeListItem("key_activities", i)} />

          <DynamicList label="Expected outcomes" items={form.expected_outcomes}
            onChange={(i, v) => updateListItem("expected_outcomes", i, v)}
            onAdd={() => addListItem("expected_outcomes")}
            onRemove={(i) => removeListItem("expected_outcomes", i)} />

          <Field label="Community impact"><Textarea rows={3} value={form.community_impact} onChange={(e) => set("community_impact", e.target.value)} /></Field>
          <Field label="Livelihood opportunities"><Textarea rows={3} value={form.livelihood_opportunities} onChange={(e) => set("livelihood_opportunities", e.target.value)} /></Field>
          <Field label="Landscape development benefits"><Textarea rows={3} value={form.landscape_development_benefits} onChange={(e) => set("landscape_development_benefits", e.target.value)} /></Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Area covered"><Input value={form.area_covered} onChange={(e) => set("area_covered", e.target.value)} /></Field>
            <Field label="Households"><Input value={form.households} onChange={(e) => set("households", e.target.value)} /></Field>
            <Field label="Districts"><Input value={form.districts} onChange={(e) => set("districts", e.target.value)} /></Field>
          </div>
          <Field label="Display order"><Input type="number" value={form.display_order} onChange={(e) => set("display_order", Number(e.target.value) || 0)} /></Field>

          {/* Gallery */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Gallery</h4>
              <div>
                <input
                  ref={galleryInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { uploadGallery(e.target.files); if (galleryInputRef.current) galleryInputRef.current.value = ""; }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  disabled={uploadingGallery || !form.id}
                  onClick={() => galleryInputRef.current?.click()}
                >
                  {uploadingGallery ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                  Upload images
                </Button>
              </div>
            </div>
            {!form.id && (
              <p className="text-xs text-muted-foreground mb-2">Save the project first to manage gallery images.</p>
            )}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {form.gallery.map((g) => {
                const src = resolveImage(g.image_path);
                return (
                  <div key={g.id} className="relative aspect-square rounded overflow-hidden border border-border group">
                    {src && <img src={src} alt={g.caption || ""} className="h-full w-full object-cover" />}
                    <button
                      onClick={() => removeGalleryImg(g)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
              {form.gallery.length === 0 && (
                <p className="text-xs text-muted-foreground col-span-4">No images yet.</p>
              )}
            </div>
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

function DynamicList({
  label, items, onChange, onAdd, onRemove,
}: {
  label: string;
  items: string[];
  onChange: (i: number, v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[11px] font-semibold text-muted-foreground uppercase">{label}</label>
        <Button type="button" size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={onAdd}>
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((v, i) => (
          <div key={i} className="flex gap-2">
            <Input value={v} onChange={(e) => onChange(i, e.target.value)} />
            <Button type="button" size="sm" variant="outline" className="text-destructive" onClick={() => onRemove(i)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-muted-foreground">No items.</p>
        )}
      </div>
    </div>
  );
}
