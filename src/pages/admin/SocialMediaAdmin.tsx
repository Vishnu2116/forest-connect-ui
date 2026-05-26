import { useEffect, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { adminDeleteVideo, adminSaveEmbeds, adminSaveVideo, fetchSocial } from "@/lib/media";

interface VideoForm { id?: string; title: string; youtube_url: string; display_order: number; }
const emptyVideo: VideoForm = { title: "", youtube_url: "", display_order: 1 };

export default function SocialMediaAdmin() {
  const [fb, setFb] = useState("");
  const [tw, setTw] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingEmbeds, setSavingEmbeds] = useState(false);
  const [editing, setEditing] = useState<VideoForm | null>(null);
  const [savingVideo, setSavingVideo] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const d = await fetchSocial();
      setFb(d?.embeds?.facebook_embed_code || "");
      setTw(d?.embeds?.twitter_embed_code || "");
      setVideos(d?.videos || []);
    } catch { toast.error("Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const saveEmbeds = async () => {
    setSavingEmbeds(true);
    try { await adminSaveEmbeds({ facebook_embed_code: fb, twitter_embed_code: tw }); toast.success("Embeds saved"); }
    catch { toast.error("Save failed"); }
    finally { setSavingEmbeds(false); }
  };

  const saveVideo = async () => {
    if (!editing) return;
    if (!editing.title.trim() || !editing.youtube_url.trim()) { toast.error("Title and URL required"); return; }
    setSavingVideo(true);
    try {
      await adminSaveVideo({ id: editing.id, title: editing.title.trim(), youtube_url: editing.youtube_url.trim(), display_order: Number(editing.display_order) || 1 });
      toast.success("Saved"); setEditing(null); await load();
    } catch { toast.error("Save failed"); }
    finally { setSavingVideo(false); }
  };

  const delVideo = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try { await adminDeleteVideo(id); toast.success("Deleted"); await load(); }
    catch { toast.error("Delete failed"); }
  };

  return (
    <>
      <AdminPageHeader title="Social Media Management" subtitle="Manage Facebook/Twitter embeds and YouTube videos." />

      {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>}

      <div className="bg-card border border-border rounded-md p-4 space-y-3 mb-6">
        <h3 className="font-semibold text-primary">Embed codes</h3>
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">Facebook embed code</label>
          <Textarea value={fb} onChange={(e) => setFb(e.target.value)} rows={5} placeholder="<iframe …></iframe>" className="mt-1 font-mono text-xs" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">Twitter / X embed code</label>
          <Textarea value={tw} onChange={(e) => setTw(e.target.value)} rows={5} placeholder="<blockquote …></blockquote>" className="mt-1 font-mono text-xs" />
        </div>
        <Button onClick={saveEmbeds} disabled={savingEmbeds} className="gap-1.5">
          {savingEmbeds ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save embeds
        </Button>
      </div>

      <div className="bg-card border border-border rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-primary">YouTube videos</h3>
          <Button size="sm" onClick={() => setEditing({ ...emptyVideo })} className="gap-1.5"><Plus className="h-4 w-4" /> Add video</Button>
        </div>

        {editing && (
          <div className="border border-border rounded p-3 mb-3 space-y-2 bg-surface">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{editing.id ? "Edit video" : "New video"}</span>
              <button onClick={() => setEditing(null)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid md:grid-cols-3 gap-2">
              <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="Title" className="md:col-span-2 border border-input rounded px-2 py-1.5 text-sm bg-card" />
              <input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })}
                placeholder="Order" className="border border-input rounded px-2 py-1.5 text-sm bg-card" />
            </div>
            <input value={editing.youtube_url} onChange={(e) => setEditing({ ...editing, youtube_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=…" className="w-full border border-input rounded px-2 py-1.5 text-sm bg-card" />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveVideo} disabled={savingVideo} className="gap-1.5">
                {savingVideo && <Loader2 className="h-4 w-4 animate-spin" />} Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </div>
        )}

        {videos.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">No videos yet.</div>
        ) : (
          <div className="space-y-2">
            {videos.map((v) => (
              <div key={v.id} className="flex items-center gap-3 border border-border rounded px-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{v.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{v.youtube_url}</div>
                </div>
                <span className="text-xs text-muted-foreground">#{v.display_order}</span>
                <Button size="sm" variant="outline" onClick={() => setEditing({ id: v.id, title: v.title, youtube_url: v.youtube_url, display_order: v.display_order })}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => delVideo(v.id)} className="text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
