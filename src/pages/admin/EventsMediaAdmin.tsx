import { useEffect, useRef, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2, Upload, X, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  adminAddEventImages, adminDeleteEvent, adminDeleteEventImage, adminSaveEvent,
  adminToggleEventImageGallery, fetchEvent, fetchEvents, fileUrl, formatEventDate,
} from "@/lib/media";
import { batchUpload } from "@/lib/batchUpload";

interface EventForm { id?: string; title: string; event_date: string; description: string; cover: File | null; }

const emptyForm: EventForm = { title: "", event_date: "", description: "", cover: null };

export default function EventsMediaAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<EventForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [managingId, setManagingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try { setEvents(await fetchEvents()); }
    catch { toast.error("Failed to load events"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const startNew = () => setEditing({ ...emptyForm });
  const startEdit = (e: any) => setEditing({
    id: e.id, title: e.title || "", event_date: (e.event_date || "").slice(0, 10),
    description: e.description || "", cover: null,
  });

  const save = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.event_date) { toast.error("Title and date are required"); return; }
    setSaving(true);
    try {
      await adminSaveEvent({
        id: editing.id, title: editing.title.trim(), event_date: editing.event_date,
        description: editing.description, cover: editing.cover,
      });
      toast.success("Saved");
      setEditing(null);
      await load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try { await adminDeleteEvent(id); toast.success("Deleted"); await load(); }
    catch { toast.error("Delete failed"); }
  };

  if (managingId) {
    return <EventImagesManager id={managingId} onBack={() => { setManagingId(null); load(); }} />;
  }

  return (
    <>
      <AdminPageHeader
        title="Events"
        subtitle="Manage events and their image galleries."
        action={<Button onClick={startNew} className="gap-1.5"><Plus className="h-4 w-4" /> New event</Button>}
      />

      {editing && (
        <div className="bg-card border border-border rounded-md p-4 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-primary">{editing.id ? "Edit event" : "New event"}</h3>
            <button onClick={() => setEditing(null)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Title *</label>
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full border border-input rounded px-2 py-1.5 text-sm bg-card mt-1" />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">Event date *</label>
              <input type="date" value={editing.event_date} onChange={(e) => setEditing({ ...editing, event_date: e.target.value })}
                className="w-full border border-input rounded px-2 py-1.5 text-sm bg-card mt-1" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Description</label>
            <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="mt-1" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Cover image</label>
            <input type="file" accept="image/*"
              onChange={(e) => setEditing({ ...editing, cover: e.target.files?.[0] || null })}
              className="block text-sm mt-1" />
          </div>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving} className="gap-1.5">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : events.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 text-sm">No events yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div key={ev.id} className="bg-card border border-border rounded-md overflow-hidden">
              <div className="aspect-video bg-muted/40">
                {ev.cover_image_path
                  ? <img src={fileUrl(ev.cover_image_path)} alt={ev.title} className="w-full h-full object-cover" loading="lazy" />
                  : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No cover</div>}
              </div>
              <div className="p-3 space-y-2">
                <div className="text-[11px] text-accent font-semibold uppercase">{formatEventDate(ev.event_date)}</div>
                <h3 className="text-sm font-bold text-foreground line-clamp-2">{ev.title}</h3>
                <div className="flex gap-1.5 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setManagingId(ev.id)} className="text-xs gap-1"><Upload className="h-3 w-3" /> Images</Button>
                  <Button size="sm" variant="outline" onClick={() => startEdit(ev)} className="text-xs gap-1"><Pencil className="h-3 w-3" /></Button>
                  <Button size="sm" variant="outline" onClick={() => del(ev.id)} className="text-xs gap-1 text-destructive"><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function EventImagesManager({ id, onBack }: { id: string; onBack: () => void }) {
  const [ev, setEv] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ uploaded: number; total: number } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    // Find slug from id via events list, but API uses slug for fetchEvent.
    // We don't have slug here; use admin events list to map.
    try {
      const list = await fetchEvents();
      const found = list.find((x: any) => x.id === id);
      if (found?.slug) {
        const detail = await fetchEvent(found.slug);
        setEv(detail);
      } else setEv(null);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [id]);

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadProgress({ uploaded: 0, total: files.length });
    const result = await batchUpload(
      files,
      10,
      (batch) => adminAddEventImages(id, batch),
      ({ uploaded, total, batchIndex, totalBatches }) => {
        setUploadProgress({ uploaded, total });
        if (uploaded < total) {
          toast.message(`Uploading batch ${batchIndex} of ${totalBatches}…`, {
            description: `${uploaded} of ${total} images uploaded`,
            id: "event-batch-upload",
          });
        }
      }
    );
    if (result.errors.length) {
      result.errors.forEach((er) =>
        toast.error(`Batch ${er.batchIndex} failed`, { description: String((er.error as any)?.message || er.error) })
      );
    }
    if (result.uploaded > 0) {
      toast.success(`${result.uploaded} image${result.uploaded === 1 ? "" : "s"} uploaded successfully`);
    }
    await load();
    setUploadProgress(null);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const del = async (imgId: string) => {
    if (!confirm("Delete this image?")) return;
    try { await adminDeleteEventImage(imgId); toast.success("Deleted"); await load(); }
    catch { toast.error("Delete failed"); }
  };

  const toggle = async (imgId: string) => {
    try { await adminToggleEventImageGallery(imgId); await load(); }
    catch { toast.error("Toggle failed"); }
  };

  const toggleSelection = (imgId: string) => {
    const next = new Set(selectedIds);
    if (next.has(imgId)) next.delete(imgId);
    else next.add(imgId);
    setSelectedIds(next);
  };

  const images = ev?.images || [];
  const allSelected = images.length > 0 && selectedIds.size === images.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < images.length;

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(images.map((img: any) => img.id)));
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} image${selectedIds.size === 1 ? "" : "s"}?`)) return;
    setBulkDeleting(true);
    setBulkProgress({ current: 0, total: selectedIds.size });
    const ids = Array.from(selectedIds);
    let deleted = 0;
    let failed = 0;
    for (let i = 0; i < ids.length; i++) {
      try {
        await adminDeleteEventImage(ids[i]);
        deleted++;
      } catch {
        failed++;
      }
      setBulkProgress({ current: i + 1, total: ids.length });
    }
    setBulkDeleting(false);
    setBulkProgress(null);
    setSelectedIds(new Set());
    await load();
    if (failed > 0) {
      toast.error(`${failed} image${failed === 1 ? "" : "s"} failed to delete`, { description: `${deleted} deleted successfully` });
    } else {
      toast.success(`${deleted} image${deleted === 1 ? "" : "s"} deleted successfully`);
    }
  };

  return (
    <>
      <AdminPageHeader
        title={ev?.title || "Event Images"}
        subtitle="Manage images attached to this event."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back</Button>
            <Button onClick={() => inputRef.current?.click()} disabled={uploading} className="gap-1.5">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
            </Button>
          </div>
        }
      />
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onSelect} />
      {uploadProgress && (
        <div className="mb-4 rounded-md border border-border bg-card p-3">
          <div className="text-xs text-muted-foreground mb-2">
            Uploading {Math.min(uploadProgress.uploaded + 1, uploadProgress.total)} of {uploadProgress.total} images…
          </div>
          <Progress value={(uploadProgress.uploaded / uploadProgress.total) * 100} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : !images.length ? (
        <div className="text-center text-muted-foreground py-16 text-sm">No images yet.</div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all-event-images"
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={toggleSelectAll}
                disabled={bulkDeleting}
              />
              <label htmlFor="select-all-event-images" className="text-sm text-muted-foreground cursor-pointer select-none">
                Select all
              </label>
            </div>
            {selectedIds.size > 0 && (
              <Button variant="destructive" size="sm" onClick={bulkDelete} disabled={bulkDeleting} className="gap-1.5">
                {bulkDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                <Trash2 className="h-4 w-4" />
                Delete selected ({selectedIds.size})
              </Button>
            )}
          </div>

          {bulkProgress && (
            <div className="mb-4 rounded-md border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground mb-2">
                Deleting {bulkProgress.current} of {bulkProgress.total} images…
              </div>
              <Progress value={(bulkProgress.current / bulkProgress.total) * 100} />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img: any) => (
              <div key={img.id} className="border border-border rounded-md overflow-hidden bg-card">
                <div className="relative group">
                  <div className="absolute top-1.5 left-1.5 z-10 opacity-0 group-hover:opacity-100 transition">
                    <Checkbox
                      checked={selectedIds.has(img.id)}
                      onCheckedChange={() => toggleSelection(img.id)}
                      disabled={bulkDeleting}
                      aria-label="Select image"
                    />
                  </div>
                  <img src={fileUrl(img.image_path)} alt={img.caption || ""} className="w-full aspect-square object-cover" loading="lazy" />
                  <button onClick={() => del(img.id)}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition" aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between px-2 py-2 text-xs">
                  <span className="text-muted-foreground">Show in gallery</span>
                  <Switch checked={!!img.show_in_gallery} onCheckedChange={() => toggle(img.id)} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
