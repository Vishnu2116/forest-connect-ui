import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Upload, Loader2, X, Image as ImageIcon, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchAdmin, AdminApiError, API_BASE_URL, adminAuth } from "@/lib/api";
import { AdminPageHeader } from "./AdminLayout";

type UploadedFile = {
  id: string | number;
  file_url: string;
  original_name?: string;
  mime_type?: string;
  file_size?: number | string;
};

type Album = {
  id: string;
  title: string;
  slug?: string;
  short_description?: string | null;
  description?: string | null;
  album_date?: string | null;
  location?: string | null;
  district?: string | null;
  cover_image_id?: string | number | null;
  cover_image_url?: string | null;
  is_featured?: boolean;
  status?: "draft" | "published" | "archived";
  display_order?: number;
  items_count?: number;
};

type Item = {
  id: string;
  album_id?: string | null;
  album_title?: string | null;
  media_id: string | number;
  title?: string | null;
  caption?: string | null;
  alt_text?: string | null;
  media_type: "image" | "video";
  taken_at?: string | null;
  location?: string | null;
  district?: string | null;
  is_featured?: boolean;
  status?: "draft" | "published" | "archived";
  display_order?: number;
  file_url?: string;
  mime_type?: string;
};

type AlbumForm = {
  title: string;
  short_description: string;
  description: string;
  album_date: string;
  location: string;
  district: string;
  cover: UploadedFile | null;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
  display_order: string;
};

type ItemForm = {
  album_id: string;
  title: string;
  caption: string;
  alt_text: string;
  media_type: "image" | "video";
  taken_at: string;
  location: string;
  district: string;
  media: UploadedFile | null;
  is_featured: boolean;
  status: "draft" | "published" | "archived";
  display_order: string;
};

const emptyAlbumForm = (): AlbumForm => ({
  title: "", short_description: "", description: "", album_date: "",
  location: "", district: "", cover: null, is_featured: false,
  status: "published", display_order: "0",
});

const emptyItemForm = (): ItemForm => ({
  album_id: "", title: "", caption: "", alt_text: "",
  media_type: "image", taken_at: "", location: "", district: "",
  media: null, is_featured: false, status: "published", display_order: "0",
});

async function uploadGalleryFile(file: File, alt_text?: string, caption?: string): Promise<UploadedFile> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("category", "gallery");
  if (alt_text) fd.append("alt_text", alt_text);
  if (caption) fd.append("caption", caption);
  return await fetchAdmin<UploadedFile>("/api/admin/uploads", { method: "POST", body: fd });
}

export default function GalleryAdmin() {
  const [tab, setTab] = useState<"albums" | "items">("albums");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [albumOpen, setAlbumOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumForm, setAlbumForm] = useState<AlbumForm>(emptyAlbumForm());
  const [albumSaving, setAlbumSaving] = useState(false);

  const [itemOpen, setItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemForm, setItemForm] = useState<ItemForm>(emptyItemForm());
  const [itemSaving, setItemSaving] = useState(false);

  const albumOptions = useMemo(() => albums, [albums]);

  async function loadAll() {
    setLoading(true); setError(null);
    try {
      const [a, i] = await Promise.all([
        fetchAdmin<{ items: Album[] }>("/api/admin/gallery/albums?limit=100"),
        fetchAdmin<{ items: Item[] }>("/api/admin/gallery/items?limit=100"),
      ]);
      setAlbums(a.items || []); setItems(i.items || []);
    } catch (e) {
      setError(e instanceof AdminApiError ? e.message : "Failed to load gallery");
    } finally { setLoading(false); }
  }

  useEffect(() => { loadAll(); }, []);

  // ---------- Album handlers ----------
  function openNewAlbum() {
    setEditingAlbum(null); setAlbumForm(emptyAlbumForm()); setAlbumOpen(true);
  }
  function openEditAlbum(a: Album) {
    setEditingAlbum(a);
    setAlbumForm({
      title: a.title || "",
      short_description: a.short_description || "",
      description: a.description || "",
      album_date: a.album_date ? a.album_date.slice(0, 10) : "",
      location: a.location || "",
      district: a.district || "",
      cover: a.cover_image_id && a.cover_image_url
        ? { id: a.cover_image_id, file_url: a.cover_image_url }
        : null,
      is_featured: !!a.is_featured,
      status: (a.status as any) || "published",
      display_order: String(a.display_order ?? 0),
    });
    setAlbumOpen(true);
  }

  async function onAlbumCoverChange(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Cover must be an image."); return; }
    try {
      const up = await uploadGalleryFile(file, albumForm.title || "Album cover");
      setAlbumForm((f) => ({ ...f, cover: up }));
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : "Upload failed");
    }
  }

  async function saveAlbum() {
    if (!albumForm.title.trim()) { alert("Title is required"); return; }
    setAlbumSaving(true);
    try {
      const payload: any = {
        title: albumForm.title.trim(),
        short_description: albumForm.short_description || undefined,
        description: albumForm.description || undefined,
        album_date: albumForm.album_date || undefined,
        location: albumForm.location || undefined,
        district: albumForm.district || undefined,
        cover_image_id: albumForm.cover ? Number(albumForm.cover.id) : undefined,
        is_featured: albumForm.is_featured,
        status: albumForm.status,
        display_order: Number(albumForm.display_order) || 0,
      };
      if (editingAlbum) {
        await fetchAdmin(`/api/admin/gallery/albums/${editingAlbum.id}`, {
          method: "PUT", body: JSON.stringify(payload),
        });
      } else {
        await fetchAdmin(`/api/admin/gallery/albums`, {
          method: "POST", body: JSON.stringify(payload),
        });
      }
      setAlbumOpen(false); await loadAll();
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : "Save failed");
    } finally { setAlbumSaving(false); }
  }

  async function deleteAlbum(a: Album) {
    if (!confirm(`Delete album "${a.title}"? This soft-deletes.`)) return;
    try {
      await fetchAdmin(`/api/admin/gallery/albums/${a.id}`, { method: "DELETE" });
      await loadAll();
    } catch (e) { alert(e instanceof AdminApiError ? e.message : "Delete failed"); }
  }

  // ---------- Item handlers ----------
  function openNewItem() {
    setEditingItem(null); setItemForm(emptyItemForm()); setItemOpen(true);
  }
  function openEditItem(it: Item) {
    setEditingItem(it);
    setItemForm({
      album_id: it.album_id ? String(it.album_id) : "",
      title: it.title || "",
      caption: it.caption || "",
      alt_text: it.alt_text || "",
      media_type: (it.media_type as any) || "image",
      taken_at: it.taken_at ? it.taken_at.slice(0, 10) : "",
      location: it.location || "",
      district: it.district || "",
      media: it.media_id && it.file_url
        ? { id: it.media_id, file_url: it.file_url, mime_type: it.mime_type }
        : null,
      is_featured: !!it.is_featured,
      status: (it.status as any) || "published",
      display_order: String(it.display_order ?? 0),
    });
    setItemOpen(true);
  }

  async function onItemMediaChange(file: File | null) {
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isImage && !isVideo) { alert("Only images or videos allowed."); return; }
    try {
      const up = await uploadGalleryFile(file, itemForm.alt_text || itemForm.title || "Gallery media", itemForm.caption);
      setItemForm((f) => ({ ...f, media: up, media_type: isVideo ? "video" : "image" }));
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : "Upload failed");
    }
  }

  async function saveItem() {
    if (!itemForm.media) { alert("Please upload an image or video."); return; }
    setItemSaving(true);
    try {
      const payload: any = {
        album_id: itemForm.album_id ? Number(itemForm.album_id) : undefined,
        media_id: Number(itemForm.media.id),
        title: itemForm.title || undefined,
        caption: itemForm.caption || undefined,
        alt_text: itemForm.alt_text || undefined,
        media_type: itemForm.media_type,
        taken_at: itemForm.taken_at || undefined,
        location: itemForm.location || undefined,
        district: itemForm.district || undefined,
        is_featured: itemForm.is_featured,
        status: itemForm.status,
        display_order: Number(itemForm.display_order) || 0,
      };
      if (editingItem) {
        await fetchAdmin(`/api/admin/gallery/items/${editingItem.id}`, {
          method: "PUT", body: JSON.stringify(payload),
        });
      } else {
        await fetchAdmin(`/api/admin/gallery/items`, {
          method: "POST", body: JSON.stringify(payload),
        });
      }
      setItemOpen(false); await loadAll();
    } catch (e) {
      alert(e instanceof AdminApiError ? e.message : "Save failed");
    } finally { setItemSaving(false); }
  }

  async function deleteItem(it: Item) {
    if (!confirm(`Delete "${it.title || it.caption || it.id}"?`)) return;
    try {
      await fetchAdmin(`/api/admin/gallery/items/${it.id}`, { method: "DELETE" });
      await loadAll();
    } catch (e) { alert(e instanceof AdminApiError ? e.message : "Delete failed"); }
  }

  // ---------- Render ----------
  return (
    <div>
      <AdminPageHeader
        title="Gallery Management"
        subtitle="Manage gallery albums and individual photos/videos."
        action={
          tab === "albums" ? (
            <Button onClick={openNewAlbum}><Plus className="h-4 w-4 mr-1" /> New Album</Button>
          ) : (
            <Button onClick={openNewItem}><Plus className="h-4 w-4 mr-1" /> New Gallery Item</Button>
          )
        }
      />

      <div className="flex gap-2 border-b border-border mb-4">
        <button
          onClick={() => setTab("albums")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === "albums" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
        >Albums ({albums.length})</button>
        <button
          onClick={() => setTab("items")}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === "items" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
        >Items ({items.length})</button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded p-3 mb-4">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : tab === "albums" ? (
        <div className="overflow-x-auto rounded-md border border-border bg-card shadow-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cover</th><th>Title</th><th>District</th><th>Date</th>
                <th>Items</th><th>Featured</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {albums.length === 0 && (
                <tr><td colSpan={8} className="text-center text-muted-foreground py-6">No albums yet.</td></tr>
              )}
              {albums.map((a) => (
                <tr key={a.id}>
                  <td>
                    {a.cover_image_url ? (
                      <img src={a.cover_image_url} alt="" className="h-12 w-16 object-cover rounded" />
                    ) : (
                      <div className="h-12 w-16 bg-muted rounded flex items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
                    )}
                  </td>
                  <td className="font-medium">{a.title}</td>
                  <td>{a.district || "—"}</td>
                  <td>{a.album_date ? a.album_date.slice(0, 10) : "—"}</td>
                  <td>{a.items_count ?? 0}</td>
                  <td>{a.is_featured ? "Yes" : "No"}</td>
                  <td><span className="text-xs uppercase">{a.status}</span></td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditAlbum(a)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteAlbum(a)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border bg-card shadow-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Preview</th><th>Title</th><th>Album</th><th>Type</th>
                <th>District</th><th>Taken</th><th>Featured</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={9} className="text-center text-muted-foreground py-6">No gallery items yet.</td></tr>
              )}
              {items.map((it) => (
                <tr key={it.id}>
                  <td>
                    {it.media_type === "video" ? (
                      <div className="h-12 w-16 bg-muted rounded flex items-center justify-center"><Film className="h-4 w-4 text-muted-foreground" /></div>
                    ) : it.file_url ? (
                      <img src={it.file_url} alt="" className="h-12 w-16 object-cover rounded" />
                    ) : (
                      <div className="h-12 w-16 bg-muted rounded" />
                    )}
                  </td>
                  <td className="font-medium">{it.title || it.caption || "—"}</td>
                  <td>{it.album_title || "—"}</td>
                  <td className="capitalize">{it.media_type}</td>
                  <td>{it.district || "—"}</td>
                  <td>{it.taken_at ? it.taken_at.slice(0, 10) : "—"}</td>
                  <td>{it.is_featured ? "Yes" : "No"}</td>
                  <td><span className="text-xs uppercase">{it.status}</span></td>
                  <td className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditItem(it)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteItem(it)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Album modal */}
      {albumOpen && (
        <Modal title={editingAlbum ? "Edit Album" : "New Album"} onClose={() => setAlbumOpen(false)}>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Title *" className="sm:col-span-2">
              <Input value={albumForm.title} onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })} />
            </Field>
            <Field label="Short Description" className="sm:col-span-2">
              <Input value={albumForm.short_description} onChange={(e) => setAlbumForm({ ...albumForm, short_description: e.target.value })} />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea rows={3} value={albumForm.description} onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })} />
            </Field>
            <Field label="Album Date">
              <Input type="date" value={albumForm.album_date} onChange={(e) => setAlbumForm({ ...albumForm, album_date: e.target.value })} />
            </Field>
            <Field label="District">
              <Input value={albumForm.district} onChange={(e) => setAlbumForm({ ...albumForm, district: e.target.value })} />
            </Field>
            <Field label="Location" className="sm:col-span-2">
              <Input value={albumForm.location} onChange={(e) => setAlbumForm({ ...albumForm, location: e.target.value })} />
            </Field>
            <Field label="Display Order">
              <Input type="number" value={albumForm.display_order} onChange={(e) => setAlbumForm({ ...albumForm, display_order: e.target.value })} />
            </Field>
            <Field label="Status">
              <select className="w-full border border-input rounded-md h-10 px-3 bg-background" value={albumForm.status} onChange={(e) => setAlbumForm({ ...albumForm, status: e.target.value as any })}>
                <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={albumForm.is_featured} onChange={(e) => setAlbumForm({ ...albumForm, is_featured: e.target.checked })} />
              Featured
            </label>
            <Field label="Cover Image" className="sm:col-span-2">
              <input type="file" accept="image/*" onChange={(e) => onAlbumCoverChange(e.target.files?.[0] || null)} />
              {albumForm.cover && (
                <img src={albumForm.cover.file_url} alt="" className="mt-2 h-20 rounded object-cover" />
              )}
            </Field>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setAlbumOpen(false)}>Cancel</Button>
            <Button onClick={saveAlbum} disabled={albumSaving}>
              {albumSaving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />} Save
            </Button>
          </div>
        </Modal>
      )}

      {/* Item modal */}
      {itemOpen && (
        <Modal title={editingItem ? "Edit Gallery Item" : "New Gallery Item"} onClose={() => setItemOpen(false)}>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Album" className="sm:col-span-2">
              <select className="w-full border border-input rounded-md h-10 px-3 bg-background" value={itemForm.album_id} onChange={(e) => setItemForm({ ...itemForm, album_id: e.target.value })}>
                <option value="">— None (general gallery) —</option>
                {albumOptions.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </Field>
            <Field label="Title">
              <Input value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} />
            </Field>
            <Field label="Media Type">
              <select className="w-full border border-input rounded-md h-10 px-3 bg-background" value={itemForm.media_type} onChange={(e) => setItemForm({ ...itemForm, media_type: e.target.value as any })}>
                <option value="image">Image</option><option value="video">Video</option>
              </select>
            </Field>
            <Field label="Caption" className="sm:col-span-2">
              <Textarea rows={2} value={itemForm.caption} onChange={(e) => setItemForm({ ...itemForm, caption: e.target.value })} />
            </Field>
            <Field label="Alt Text" className="sm:col-span-2">
              <Input value={itemForm.alt_text} onChange={(e) => setItemForm({ ...itemForm, alt_text: e.target.value })} />
            </Field>
            <Field label="Taken At">
              <Input type="date" value={itemForm.taken_at} onChange={(e) => setItemForm({ ...itemForm, taken_at: e.target.value })} />
            </Field>
            <Field label="District">
              <Input value={itemForm.district} onChange={(e) => setItemForm({ ...itemForm, district: e.target.value })} />
            </Field>
            <Field label="Location" className="sm:col-span-2">
              <Input value={itemForm.location} onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })} />
            </Field>
            <Field label="Display Order">
              <Input type="number" value={itemForm.display_order} onChange={(e) => setItemForm({ ...itemForm, display_order: e.target.value })} />
            </Field>
            <Field label="Status">
              <select className="w-full border border-input rounded-md h-10 px-3 bg-background" value={itemForm.status} onChange={(e) => setItemForm({ ...itemForm, status: e.target.value as any })}>
                <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={itemForm.is_featured} onChange={(e) => setItemForm({ ...itemForm, is_featured: e.target.checked })} />
              Featured
            </label>
            <Field label="Image / Video *" className="sm:col-span-2">
              <input type="file" accept="image/*,video/*" onChange={(e) => onItemMediaChange(e.target.files?.[0] || null)} />
              {itemForm.media && (
                itemForm.media_type === "video"
                  ? <video src={itemForm.media.file_url} className="mt-2 h-24 rounded" controls />
                  : <img src={itemForm.media.file_url} alt="" className="mt-2 h-24 rounded object-cover" />
              )}
            </Field>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setItemOpen(false)}>Cancel</Button>
            <Button onClick={saveItem} disabled={itemSaving}>
              {itemSaving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />} Save
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <Label className="mb-1 block text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-primary">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
