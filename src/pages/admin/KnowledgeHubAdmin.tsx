import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Upload, X, Loader2, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchAdmin, AdminApiError } from "@/lib/api";
import { AdminPageHeader } from "./AdminLayout";

type Category = {
  id: string;
  name: string;
  slug: string;
  display_style: "table" | "card";
};

type KHItem = {
  id: string;
  category_id: string;
  category_name?: string;
  title: string;
  slug?: string;
  short_description?: string | null;
  description?: string | null;
  language?: string | null;
  publish_date?: string | null;
  expiry_date?: string | null;
  year?: number | null;
  file_id?: string | null;
  thumbnail_id?: string | null;
  file_format?: string | null;
  external_url?: string | null;
  is_downloadable?: boolean;
  is_featured?: boolean;
  show_in_whats_new?: boolean;
  status?: "draft" | "published" | "archived";
  display_order?: number;
  file_url?: string | null;
  file_original_name?: string | null;
  thumbnail_url?: string | null;
};

type FormState = {
  category_id: string;
  title: string;
  short_description: string;
  description: string;
  language: "en" | "bn" | "kok";
  publish_date: string;
  year: string;
  file_format: string;
  external_url: string;
  is_downloadable: boolean;
  is_featured: boolean;
  show_in_whats_new: boolean;
  status: "draft" | "published" | "archived";
  display_order: string;
  file_id: string | null;
  thumbnail_id: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  file_name: string | null;
};

const emptyForm = (categoryId = ""): FormState => ({
  category_id: categoryId,
  title: "",
  short_description: "",
  description: "",
  language: "en",
  publish_date: new Date().toISOString().slice(0, 10),
  year: String(new Date().getFullYear()),
  file_format: "",
  external_url: "",
  is_downloadable: true,
  is_featured: false,
  show_in_whats_new: false,
  status: "published",
  display_order: "1",
  file_id: null,
  thumbnail_id: null,
  file_url: null,
  thumbnail_url: null,
  file_name: null,
});

/**
 * Admin Knowledge Hub manager. When `lockedCategoryName` is provided the UI
 * filters & locks the form to that category (used by per-category admin pages
 * like Reports/Publications/IEC etc).
 */
export default function KnowledgeHubAdmin({
  title,
  subtitle,
  lockedCategoryName,
  fileCategory = "knowledge_hub",
}: {
  title: string;
  subtitle?: string;
  lockedCategoryName?: string;
  fileCategory?: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<KHItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const lockedCategory = useMemo(
    () => categories.find((c) => c.name === lockedCategoryName) || null,
    [categories, lockedCategoryName]
  );

  // Load categories + items
  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await fetchAdmin<Category[]>("/api/admin/knowledge-hub/categories");
      setCategories(cats || []);
      const params = new URLSearchParams();
      const locked = (cats || []).find((c) => c.name === lockedCategoryName);
      if (locked) params.set("category_id", locked.id);
      if (search) params.set("search", search);
      params.set("limit", "100");
      const res = await fetchAdmin<{ items: KHItem[] }>(
        `/api/admin/knowledge-hub/items?${params.toString()}`
      );
      setItems(res.items || []);
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockedCategoryName]);

  const startCreate = () => {
    setForm(emptyForm(lockedCategory?.id || categories[0]?.id || ""));
    setEditingId("new");
  };

  const startEdit = async (id: string) => {
    setEditingId(id);
    try {
      const item = await fetchAdmin<KHItem>(`/api/admin/knowledge-hub/items/${id}`);
      setForm({
        category_id: String(item.category_id),
        title: item.title || "",
        short_description: item.short_description || "",
        description: item.description || "",
        language: (item.language as any) || "en",
        publish_date: item.publish_date ? item.publish_date.slice(0, 10) : "",
        year: item.year ? String(item.year) : "",
        file_format: item.file_format || "",
        external_url: item.external_url || "",
        is_downloadable: item.is_downloadable ?? true,
        is_featured: item.is_featured ?? false,
        show_in_whats_new: item.show_in_whats_new ?? false,
        status: (item.status as any) || "published",
        display_order: String(item.display_order ?? 1),
        file_id: item.file_id ? String(item.file_id) : null,
        thumbnail_id: item.thumbnail_id ? String(item.thumbnail_id) : null,
        file_url: item.file_url || null,
        thumbnail_url: item.thumbnail_url || null,
        file_name: item.file_original_name || null,
      });
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : "Failed to load item");
      setEditingId(null);
    }
  };

  const resolveKhUploadCategory = () => {
    if (lockedCategoryName === "Reports") return "report";
    if (lockedCategoryName === "Publications") return "publication";
    return "knowledge_hub";
  };

  const onUploadFile = async (file: File, kind: "file" | "thumbnail") => {
    if (kind === "file") {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        alert("Only PDF files are allowed for Knowledge Hub documents.");
        return;
      }
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append(
        "category",
        kind === "thumbnail" ? "thumbnail" : resolveKhUploadCategory()
      );
      const data = await fetchAdmin<any>("/api/admin/uploads", { method: "POST", body: fd });
      if (kind === "file") {
        setForm((f) => ({
          ...f,
          file_id: String(data.id),
          file_url: data.file_url,
          file_name: data.original_name,
          file_format: "PDF",
        }));
      } else {
        setForm((f) => ({ ...f, thumbnail_id: String(data.id), thumbnail_url: data.file_url }));
      }
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.title.trim() || !form.category_id) {
      alert("Title and category are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        category_id: Number(form.category_id),
        title: form.title.trim(),
        short_description: form.short_description || null,
        description: form.description || null,
        language: form.language,
        publish_date: form.publish_date || null,
        year: form.year ? Number(form.year) : null,
        file_id: form.file_id ? Number(form.file_id) : null,
        thumbnail_id: form.thumbnail_id ? Number(form.thumbnail_id) : null,
        file_format: form.file_format || null,
        external_url: form.external_url || null,
        is_downloadable: form.is_downloadable,
        is_featured: form.is_featured,
        show_in_whats_new: form.show_in_whats_new,
        status: form.status,
        display_order: Number(form.display_order) || 1,
      };
      if (editingId === "new") {
        await fetchAdmin("/api/admin/knowledge-hub/items", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else if (editingId) {
        await fetchAdmin(`/api/admin/knowledge-hub/items/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }
      setEditingId(null);
      await reload();
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    try {
      await fetchAdmin(`/api/admin/knowledge-hub/items/${id}`, { method: "DELETE" });
      await reload();
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : "Delete failed");
    }
  };

  return (
    <>
      <AdminPageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Button onClick={startCreate} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        }
      />

      {error && (
        <div className="mb-4 text-sm bg-destructive/10 text-destructive border border-destructive/30 rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-md">
        <div className="p-3 border-b border-border flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && reload()}
              placeholder="Search title…"
              className="pl-8 h-9"
            />
          </div>
          <Button variant="outline" size="sm" onClick={reload}>Search</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Title</th>
                {!lockedCategoryName && <th className="px-3 py-2">Category</th>}
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">File</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-3 py-6 text-center text-muted-foreground"><Loader2 className="inline h-4 w-4 animate-spin" /> Loading…</td></tr>
              )}
              {!loading && items.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">No items yet.</td></tr>
              )}
              {items.map((it, idx) => (
                <tr key={it.id} className="border-t border-border">
                  <td className="px-3 py-2">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium">{it.title}</td>
                  {!lockedCategoryName && <td className="px-3 py-2">{it.category_name}</td>}
                  <td className="px-3 py-2">{it.publish_date ? new Date(it.publish_date).toLocaleDateString() : "—"}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      it.status === "published" ? "bg-success/10 text-success" :
                      it.status === "draft" ? "bg-accent/10 text-accent" :
                      "bg-muted text-muted-foreground"
                    }`}>{it.status}</span>
                  </td>
                  <td className="px-3 py-2">
                    {it.file_url ? (
                      <a href={it.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                        {it.file_format || "FILE"} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button className="p-1.5 text-primary hover:bg-primary/10 rounded" onClick={() => startEdit(it.id)} aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded" onClick={() => remove(it.id)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !saving && setEditingId(null)}>
          <div className="bg-card rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card">
              <h3 className="font-semibold text-primary">{editingId === "new" ? "Create" : "Edit"} {lockedCategoryName || "Item"}</h3>
              <button onClick={() => setEditingId(null)} disabled={saving} aria-label="Close" className="p-1 hover:bg-muted rounded"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {!lockedCategoryName && (
                <div className="md:col-span-2">
                  <Label>Category *</Label>
                  <select className="mt-1 w-full border border-input rounded px-3 py-2 text-sm bg-card" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div className="md:col-span-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Short Description</Label>
                <Textarea rows={2} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Publish Date</Label>
                <Input type="date" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Year</Label>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Language</Label>
                <select className="mt-1 w-full border border-input rounded px-3 py-2 text-sm bg-card" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value as any })}>
                  <option value="en">English</option>
                  <option value="bn">Bengali</option>
                  <option value="kok">Kokborok</option>
                </select>
              </div>
              <div>
                <Label>Status</Label>
                <select className="mt-1 w-full border border-input rounded px-3 py-2 text-sm bg-card" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <Label>File Format</Label>
                <Input value={form.file_format} onChange={(e) => setForm({ ...form, file_format: e.target.value })} placeholder="PDF, DOCX…" className="mt-1" />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>External URL (used if no file uploaded)</Label>
                <Input value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} className="mt-1" placeholder="https://…" />
              </div>

              <div className="md:col-span-2 border border-dashed border-border rounded p-3 bg-surface">
                <Label className="flex items-center gap-2"><Upload className="h-4 w-4" /> Document File</Label>
                <input type="file" className="mt-2 text-xs" onChange={(e) => e.target.files?.[0] && onUploadFile(e.target.files[0], "file")} disabled={uploading} />
                {form.file_url && (
                  <p className="text-xs mt-2 text-muted-foreground">
                    Current: <a href={form.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{form.file_name || "View file"}</a>
                  </p>
                )}
              </div>

              <div className="md:col-span-2 border border-dashed border-border rounded p-3 bg-surface">
                <Label className="flex items-center gap-2"><Upload className="h-4 w-4" /> Thumbnail (optional)</Label>
                <input type="file" accept="image/*" className="mt-2 text-xs" onChange={(e) => e.target.files?.[0] && onUploadFile(e.target.files[0], "thumbnail")} disabled={uploading} />
                {form.thumbnail_url && (
                  <img src={form.thumbnail_url} alt="thumbnail" className="mt-2 h-16 rounded border border-border object-cover" />
                )}
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_downloadable} onChange={(e) => setForm({ ...form, is_downloadable: e.target.checked })} /> Downloadable</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.show_in_whats_new} onChange={(e) => setForm({ ...form, show_in_whats_new: e.target.checked })} /> Show in What's New</label>
              </div>
            </div>

            <div className="p-4 border-t border-border flex justify-end gap-2 sticky bottom-0 bg-card">
              <Button variant="outline" onClick={() => setEditingId(null)} disabled={saving}>Cancel</Button>
              <Button onClick={save} disabled={saving || uploading} className="bg-primary text-primary-foreground hover:bg-primary-dark">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
