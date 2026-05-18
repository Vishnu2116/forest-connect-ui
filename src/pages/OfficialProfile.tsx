import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Mail, MapPin, Phone, Smartphone, User, ArrowLeft } from "lucide-react";
import { API_BASE_URL, USE_REAL_API } from "@/config/api";
import { resolvePhoto, type ApiOfficial } from "@/lib/officials";

export default function OfficialProfile() {
  const { id } = useParams();
  const [official, setOfficial] = useState<ApiOfficial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      if (!USE_REAL_API) {
        if (alive) {
          setError("Profile unavailable in preview mode.");
          setLoading(false);
        }
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/api/about/officials/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (alive) setOfficial(data);
      } catch {
        if (alive) setError("Unable to load official profile.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const photo = official ? resolvePhoto(official.photo_path) : null;

  return (
    <PageLayout>
      <PageHeader
        title={official?.name || "Official Profile"}
        subtitle={official?.designation || ""}
        breadcrumb={["Home", "About", "Officials", official?.name || ""]}
      />
      <section className="py-10">
        <div className="gov-container max-w-3xl">
          <Link
            to="/about/whos-who"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Who's Who
          </Link>

          {loading && (
            <p className="text-sm text-muted-foreground">Loading profile…</p>
          )}

          {!loading && error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {official && (
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-card">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="h-32 w-32 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground overflow-hidden shrink-0">
                  {photo ? (
                    <img src={photo} alt={official.name} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-14 w-14" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-primary">{official.name}</h2>
                  <p className="text-base font-semibold text-foreground mt-1">{official.designation}</p>
                  {official.organisation && (
                    <p className="text-sm text-muted-foreground mt-0.5">{official.organisation}</p>
                  )}
                  {official.category_name && (
                    <span className="inline-block mt-2 text-[11px] font-semibold uppercase tracking-wide bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                      {official.category_name}
                    </span>
                  )}

                  <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
                    {official.division_office && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{official.division_office}</span>
                      </div>
                    )}
                    {official.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" /> {official.phone}
                      </div>
                    )}
                    {official.mobile && (
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-primary" /> {official.mobile}
                      </div>
                    )}
                    {official.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <a href={`mailto:${official.email}`} className="text-primary hover:underline">
                          {official.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {official.bio && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">Biography</h3>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{official.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
