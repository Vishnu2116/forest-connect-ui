import { useEffect, useState } from "react";
import { AdminPageHeader } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL, USE_REAL_API } from "@/config/api";

interface SocialForm {
  facebook_handle: string;
  facebook_post_text: string;
  twitter_handle: string;
  twitter_post_text: string;
  youtube_video_url: string;
  youtube_video_title: string;
}

const emptyForm: SocialForm = {
  facebook_handle: "",
  facebook_post_text: "",
  twitter_handle: "",
  twitter_post_text: "",
  youtube_video_url: "",
  youtube_video_title: "",
};

function authHeaders(extra: HeadersInit = {}): HeadersInit {
  const token = localStorage.getItem("element_admin_token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export default function HomeSocialMediaAdmin() {
  const [form, setForm] = useState<SocialForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!USE_REAL_API) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/home/social-media`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data && typeof data === "object") {
        setForm({
          facebook_handle: data.facebook_handle ?? "",
          facebook_post_text: data.facebook_post_text ?? "",
          twitter_handle: data.twitter_handle ?? "",
          twitter_post_text: data.twitter_post_text ?? "",
          youtube_video_url: data.youtube_video_url ?? "",
          youtube_video_title: data.youtube_video_title ?? "",
        });
      }
    } catch {
      toast.error("Unable to load social media settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (field: keyof SocialForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const save = async () => {
    if (!USE_REAL_API) {
      toast.success("Saved (preview only)");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/admin/home-social-media`,
        {
          method: "PUT",
          headers: authHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error();
      toast.success("Social media updated");
      await load();
    } catch {
      toast.error("Failed to update social media");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({
    label,
    field,
    placeholder,
    textarea,
  }: {
    label: string;
    field: keyof SocialForm;
    placeholder?: string;
    textarea?: boolean;
  }) => (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase">
        {label}
      </label>
      {textarea ? (
        <Textarea
          value={form[field]}
          onChange={(e) => update(field, e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="mt-1"
        />
      ) : (
        <input
          value={form[field]}
          onChange={(e) => update(field, e.target.value)}
          placeholder={placeholder}
          className="w-full border border-input rounded px-2 py-1.5 text-sm bg-card focus-ring mt-1"
        />
      )}
    </div>
  );

  return (
    <>
      <AdminPageHeader
        title="Home Social Media Management"
        subtitle="Configure Facebook, Twitter/X, and YouTube content shown on the home page."
        action={
          <Button onClick={save} disabled={saving} className="gap-1.5">
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save changes
          </Button>
        }
      />

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-md p-4 space-y-3">
          <h3 className="font-semibold text-primary">Facebook</h3>
          <Field
            label="Handle"
            field="facebook_handle"
            placeholder="@ElementTripura"
          />
          <Field
            label="Post text"
            field="facebook_post_text"
            placeholder="Latest Facebook update…"
            textarea
          />
        </div>

        <div className="bg-card border border-border rounded-md p-4 space-y-3">
          <h3 className="font-semibold text-primary">Twitter / X</h3>
          <Field
            label="Handle"
            field="twitter_handle"
            placeholder="@ElementTripura"
          />
          <Field
            label="Post text"
            field="twitter_post_text"
            placeholder="Latest Tweet…"
            textarea
          />
        </div>

        <div className="bg-card border border-border rounded-md p-4 space-y-3 md:col-span-2">
          <h3 className="font-semibold text-primary">YouTube</h3>
          <Field
            label="Video URL"
            field="youtube_video_url"
            placeholder="https://www.youtube.com/watch?v=…"
          />
          <Field
            label="Video title"
            field="youtube_video_title"
            placeholder="Video title shown under the embed"
          />
          <p className="text-xs text-muted-foreground">
            Leave any field empty to fall back to the default content on the
            home page.
          </p>
        </div>
      </div>
    </>
  );
}
