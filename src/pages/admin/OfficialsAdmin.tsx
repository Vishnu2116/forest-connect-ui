import { useEffect, useRef, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Pencil, Trash2, Save, X, Upload, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, USE_REAL_API, getAuthHeaders, getAuthJsonHeaders } from "@/config/api";
import { resolvePhoto, type ApiOfficial } from "@/lib/officials";

interface Category {
  id: string;
  name: string;
  display_order: number;
  is_district_based?: boolean;
}

const DISTRICTS = [
  "West Tripura",
  "Sepahijala",
  "Khowai",
  "Gomati",
  "South Tripura",
  "Dhalai",
  "Unakoti",
  "North Tripura",
];

interface FormState {
  id: string | null;
  name: string;
  designation: string;
  organisation: string;
  division_office: string;
  phone: string;
  mobile: string;
  email: string;
  bio: string;
  category_id: string;
  district: string;
  show_in_whos_who: boolean;
  show_in_directory: boolean;
  display_order: number;
  photo_path: string | null;
  photoFile: File | null;
  photoPreview: string | null;
}

function emptyForm(): FormState {
  return {
    id: null,
    name: "",
    designation: "",
    organisation: "",
    division_office: "",
    phone: "",
    mobile: "",
    email: "",
    bio: "",
    category_id: "",
    district: "",
    show_in_whos_who: true,
    show_in_directory: true,
    display_order: 0,
    photo_path: null,
    photoFile: null,
    photoPreview: null,
  };
}

export default function OfficialsAdmin() {
  const [officials, setOfficials] = useState<ApiOfficial[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadAll = async () => {
    if (!USE_REAL_API) {
      toast.message("Real API disabled — using dummy data");
      return;
    }
    setLoading(true);
    try {
      const [oRes, cRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/officials`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/admin/official-categories`, { headers: getAuthHeaders() }),
      ]);
      if (oRes.ok) setOfficials(await oRes.json());
      if (cRes.ok) setCategories(await cRes.json());
    } catch {
      toast.error("Failed to load officials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCreate = () => setEditing(emptyForm());
  const startEdit = (o: ApiOfficial) =>
    setEditing({
      id: o.id,
      name: o.name || "",
      designation: o.designation || "",
      organisation: o.organisation || "",
      division_office: o.division_office || "",
      phone: o.phone || "",
      mobile: o.mobile || "",
      email: o.email || "",
      bio: o.bio || "",
      category_id: o.category_id || "",
      district: o.district || "",
      show_in_whos_who: o.show_in_whos_who ?? true,
      show_in_directory: o.show_in_directory ?? true,
      display_order: o.display_order ?? 0,
      photo_path: o.photo_path ?? null,
      photoFile: null,
      photoPreview: null,
    });

  const onPick = (file: File | null) => {
    if (!file || !editing) return;
    setEditing({ ...editing, photoFile: file, photoPreview: URL.createObjectURL(file) });
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!USE_REAL_API) {
      toast.success("Saved (preview only)");
      setEditing(null);
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", editing.name);
      fd.append("designation", editing.designation);
      fd.append("organisation", editing.organisation);
      fd.append("division_office", editing.division_office);
      fd.append("phone", editing.phone);
      fd.append("mobile", editing.mobile);
      fd.append("email", editing.email);
      fd.append("bio", editing.bio);
      if (editing.category_id) fd.append("category_id", editing.category_id);
      const selectedCat = categories.find((c) => c.id === editing.category_id);
      if (selectedCat?.is_district_based && editing.district) {
        fd.append("district", editing.district);
      }
      fd.append("show_in_whos_who", editing.show_in_whos_who ? "true" : "false");
      fd.append("show_in_directory", editing.show_in_directory ? "true" : "false");
      fd.append("display_order", String(editing.display_order || 0));
      if (editing.photoFile) fd.append("photo", editing.photoFile);

      const url = editing.id
        ? `${API_BASE_URL}/api/admin/officials/${editing.id}`
        : `${API_BASE_URL}/api/admin/officials`;
      const res = await fetch(url, {
        method: editing.id ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: fd,
      });
      if (!res.ok) throw new Error();
      toast.success(editing.id ? "Official updated" : "Official created");
      setEditing(null);
      await loadAll();
    } catch {
      toast.error("Failed to save official");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (o: ApiOfficial) => {
    if (!confirm(`Delete "${o.name}"?`)) return;
    if (!USE_REAL_API) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/officials/${o.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error();
      toast.success("Official deleted");
      await loadAll();
    } catch {
      toast.error("Failed to delete official");
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Officials Management"
        subtitle="Manage Who's Who and Official Directory entries."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCatModal(true)} className="gap-1.5">
              Manage Categories
            </Button>
            <Button onClick={startCreate} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Official
            </Button>
          </div>
        }
      />

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}

      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="py-2 px-3">Photo</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Designation</th>
              <th className="py-2 px-3">Category</th>
              <th className="py-2 px-3">Visibility</th>
              <th className="py-2 px-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {officials.map((o) => {
              const img = resolvePhoto(o.photo_path);
              const cat = categories.find((c) => c.id === o.category_id);
              return (
                <tr key={o.id} className="border-t border-border align-top">
                  <td className="py-2 px-3">
                    <div className="h-10 w-10 rounded-full bg-surface flex items-center justify-center overflow-hidden">
                      {img ? (
                        <img src={img} alt={o.name} className="h-full w-full object-cover" />
                      ) : (
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3 font-semibold text-foreground">{o.name}</td>
                  <td className="py-2 px-3 text-muted-foreground">{o.designation}</td>
                  <td className="py-2 px-3 text-muted-foreground">{cat?.name || o.category_name || "—"}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">
                    {o.show_in_whos_who && <div>Who's Who</div>}
                    {o.show_in_directory && <div>Directory</div>}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => startEdit(o)} className="gap-1">
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => remove(o)} className="gap-1 text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && officials.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted-foreground py-6">
                  No officials yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <OfficialEditor
          form={editing}
          setForm={setEditing}
          categories={categories}
          onCancel={() => setEditing(null)}
          onSave={save}
          saving={saving}
          fileInputRef={fileInputRef}
          onPick={onPick}
        />
      )}

      {showCatModal && (
        <CategoriesModal
          categories={categories}
          onClose={() => setShowCatModal(false)}
          onChanged={loadAll}
        />
      )}
    </>
  );
}

/* ------------------ Editor modal ------------------ */
interface EditorProps {
  form: FormState;
  setForm: (f: FormState | null) => void;
  categories: Category[];
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  onPick: (f: File | null) => void;
}

function OfficialEditor({ form, setForm, categories, onCancel, onSave, saving, fileInputRef, onPick }: EditorProps) {
  const photo = form.photoPreview ?? resolvePhoto(form.photo_path);
  const set = (field: keyof FormState, value: any) => setForm({ ...form, [field]: value });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto" onClick={onCancel}>
      <div className="bg-card rounded-xl shadow-elevated w-full max-w-2xl my-8 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">{form.id ? "Edit Official" : "New Official"}</h3>
          <button onClick={onCancel} className="p-1 rounded hover:bg-surface">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-[140px_1fr] gap-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square w-full bg-surface border border-dashed border-border rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40"
            >
              {photo ? (
                <img src={photo} alt={form.name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-center px-2">
                  <UserIcon className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Click to upload</p>
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 gap-1 text-xs" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-3 w-3" /> {photo ? "Replace" : "Upload"}
            </Button>
          </div>

          <div className="space-y-3">
            <Field label="Name *">
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Designation">
                <Input value={form.designation} onChange={(e) => set("designation", e.target.value)} />
              </Field>
              <Field label="Organisation">
                <Input value={form.organisation} onChange={(e) => set("organisation", e.target.value)} />
              </Field>
            </div>
            <Field label="Division / Office">
              <Input value={form.division_office} onChange={(e) => set("division_office", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phone">
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field label="Mobile">
                <Input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
              </Field>
            </div>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select
                  value={form.category_id}
                  onChange={(e) => set("category_id", e.target.value)}
                  className="w-full border border-input rounded h-10 px-2 text-sm bg-background"
                >
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Display order">
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => set("display_order", Number(e.target.value) || 0)}
                />
              </Field>
            </div>
            <Field label="Bio">
              <Textarea rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
            </Field>
            <div className="flex gap-4 text-sm">
            {/* <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.show_in_whos_who}
                onChange={(e) => set("show_in_whos_who", e.target.checked)}
              />
              Show in Who's Who
            </label> */}
            <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.show_in_directory}
                  onChange={(e) => set("show_in_directory", e.target.checked)}
                />
                Show in Directory
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave} disabled={saving} className="gap-1.5">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save
          </Button>
        </div>
      </div>
    </div>
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

/* ------------------ Categories modal ------------------ */
function CategoriesModal({
  categories,
  onClose,
  onChanged,
}: {
  categories: Category[];
  onClose: () => void;
  onChanged: () => Promise<void> | void;
}) {
  const [items, setItems] = useState<Category[]>(categories);
  const [newName, setNewName] = useState("");
  const [newOrder, setNewOrder] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => setItems(categories), [categories]);

  const refresh = async () => {
    if (!USE_REAL_API) return;
    try {
      const r = await fetch(`${API_BASE_URL}/api/admin/official-categories`, { headers: getAuthHeaders() });
      if (r.ok) setItems(await r.json());
    } catch {}
    await onChanged();
  };

  const create = async () => {
    if (!newName.trim()) return;
    if (!USE_REAL_API) { toast.success("Created (preview only)"); return; }
    setBusy(true);
    try {
      const r = await fetch(`${API_BASE_URL}/api/admin/official-categories`, {
        method: "POST",
        headers: getAuthJsonHeaders(),
        body: JSON.stringify({ name: newName.trim(), display_order: newOrder }),
      });
      if (!r.ok) throw new Error();
      setNewName("");
      setNewOrder(0);
      toast.success("Category created");
      await refresh();
    } catch {
      toast.error("Failed to create category");
    } finally {
      setBusy(false);
    }
  };

  const update = async (c: Category) => {
    if (!USE_REAL_API) return;
    try {
      const r = await fetch(`${API_BASE_URL}/api/admin/official-categories/${c.id}`, {
        method: "PUT",
        headers: getAuthJsonHeaders(),
        body: JSON.stringify({ name: c.name, display_order: c.display_order }),
      });
      if (!r.ok) throw new Error();
      toast.success("Category updated");
      await refresh();
    } catch {
      toast.error("Failed to update category");
    }
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    if (!USE_REAL_API) return;
    try {
      const r = await fetch(`${API_BASE_URL}/api/admin/official-categories/${c.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!r.ok) {
        let msg = "Failed to delete category";
        try {
          const body = await r.json();
          if (body?.message) msg = body.message;
        } catch {}
        toast.error(msg);
        return;
      }
      toast.success("Category deleted");
      await refresh();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-elevated w-full max-w-xl my-8 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-primary">Official Categories</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {items.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2 border border-border rounded p-2">
              <Input
                value={c.name}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], name: e.target.value };
                  setItems(next);
                }}
                className="flex-1"
              />
              <Input
                type="number"
                value={c.display_order}
                onChange={(e) => {
                  const next = [...items];
                  next[i] = { ...next[i], display_order: Number(e.target.value) || 0 };
                  setItems(next);
                }}
                className="w-20"
              />
              <Button size="sm" variant="outline" onClick={() => update(c)}>Save</Button>
              <Button size="sm" variant="outline" className="text-destructive" onClick={() => remove(c)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No categories yet.</p>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Add new category</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Category name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Order"
              value={newOrder}
              onChange={(e) => setNewOrder(Number(e.target.value) || 0)}
              className="w-24"
            />
            <Button onClick={create} disabled={busy} className="gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
