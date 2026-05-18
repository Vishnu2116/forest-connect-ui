import { useEffect, useRef, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Upload, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, USE_REAL_API, getAuthHeaders, getAuthJsonHeaders } from "@/config/api";

interface Slot {
  slot_number: number;
  id: string | null;
  name: string;
  designation: string;
  organisation: string;
  photo_path: string | null;
  photoFile?: File;
  photoPreview?: string;
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("element_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function emptySlots(): Slot[] {
  return [1, 2, 3, 4].map((n) => ({
    slot_number: n,
    id: null,
    name: "",
    designation: "",
    organisation: "",
    photo_path: null,
  }));
}

function resolvePhoto(s: Slot): string | null {
  if (s.photoPreview) return s.photoPreview;
  if (!s.photo_path) return null;
  if (s.photo_path.startsWith("http")) return s.photo_path;
  if (s.photo_path.startsWith("/")) return `${API_BASE_URL ?? ""}${s.photo_path}`;
  return null;
}

export default function HomeLeadershipAdmin() {
  const [slots, setSlots] = useState<Slot[]>(emptySlots());
  const [loading, setLoading] = useState(false);
  const [savingSlot, setSavingSlot] = useState<number | null>(null);
  const fileInputs = useRef<Record<number, HTMLInputElement | null>>({});

  const load = async () => {
    if (!USE_REAL_API) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/home/leadership`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const base = emptySlots();
      if (Array.isArray(data)) {
        data.forEach((s: any) => {
          const idx = base.findIndex((b) => b.slot_number === Number(s.slot_number));
          if (idx >= 0) {
            base[idx] = {
              slot_number: Number(s.slot_number),
              id: s.id ?? null,
              name: s.name ?? "",
              designation: s.designation ?? "",
              organisation: s.organisation ?? "",
              photo_path: s.photo_path ?? null,
            };
          }
        });
      }
      setSlots(base);
    } catch {
      toast.error("Unable to load leadership slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (idx: number, field: keyof Slot, value: any) => {
    const next = [...slots];
    (next[idx] as any)[field] = value;
    setSlots(next);
  };

  const onPicked = (idx: number, file: File | null) => {
    if (!file) return;
    const next = [...slots];
    next[idx] = {
      ...next[idx],
      photoFile: file,
      photoPreview: URL.createObjectURL(file),
    };
    setSlots(next);
  };

  const saveSlot = async (idx: number) => {
    const s = slots[idx];
    if (!s.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!USE_REAL_API) {
      toast.success(`Slot ${s.slot_number} saved (preview only)`);
      return;
    }
    setSavingSlot(s.slot_number);
    try {
      const fd = new FormData();
      fd.append("name", s.name);
      fd.append("designation", s.designation);
      fd.append("organisation", s.organisation);
      if (s.photoFile) fd.append("photo", s.photoFile);
      const res = await fetch(
        `${API_BASE_URL}/api/admin/home-leadership/${s.slot_number}`,
        { method: "PUT", headers: authHeaders(), body: fd }
      );
      if (!res.ok) throw new Error();
      toast.success(`Slot ${s.slot_number} updated`);
      await load();
    } catch {
      toast.error(`Failed to update slot ${s.slot_number}`);
    } finally {
      setSavingSlot(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Home Leadership Management"
        subtitle="Manage the 4 leadership slots shown on the homepage."
      />

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading slots…
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {slots.map((slot, idx) => {
          const photo = resolvePhoto(slot);
          return (
            <div
              key={slot.slot_number}
              className="bg-card border border-border rounded-md p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Slot {slot.slot_number}
                </span>
                <Button
                  size="sm"
                  onClick={() => saveSlot(idx)}
                  disabled={savingSlot === slot.slot_number}
                  className="gap-1.5"
                >
                  {savingSlot === slot.slot_number ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save
                </Button>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4">
                <div>
                  <input
                    ref={(el) => (fileInputs.current[slot.slot_number] = el)}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPicked(idx, e.target.files?.[0] ?? null)}
                  />
                  <div
                    onClick={() => fileInputs.current[slot.slot_number]?.click()}
                    className="aspect-[4/3] w-full bg-surface border border-dashed border-border rounded-md flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/40 transition"
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={slot.name || `Slot ${slot.slot_number}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center px-2">
                        <UserIcon className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                        <p className="text-[10px] text-muted-foreground">
                          Click to upload
                        </p>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 gap-1 text-xs"
                    onClick={() => fileInputs.current[slot.slot_number]?.click()}
                  >
                    <Upload className="h-3 w-3" />
                    {photo ? "Replace" : "Upload"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                      Name *
                    </label>
                    <input
                      value={slot.name}
                      onChange={(e) => update(idx, "name", e.target.value)}
                      className="w-full border border-input rounded px-2 py-1.5 text-sm bg-card focus-ring mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                      Designation
                    </label>
                    <input
                      value={slot.designation}
                      onChange={(e) => update(idx, "designation", e.target.value)}
                      className="w-full border border-input rounded px-2 py-1.5 text-sm bg-card focus-ring mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                      Organisation
                    </label>
                    <input
                      value={slot.organisation}
                      onChange={(e) => update(idx, "organisation", e.target.value)}
                      className="w-full border border-input rounded px-2 py-1.5 text-sm bg-card focus-ring mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
