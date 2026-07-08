import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { Facebook, Twitter, Youtube, ArrowRight, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { USE_REAL_API } from "@/config/api";
import { fetchGallery, fetchGalleryDistricts, fetchGalleryByDistrict, fetchEvents, fetchEvent, fetchSocial, fileUrl, formatEventDate, youtubeEmbed } from "@/lib/media";
import Lightbox, { LightboxImage } from "@/components/common/Lightbox";

const dummyVideos = [
  { id: "1", title: "PROJECT ELEMENT Overview" },
  { id: "2", title: "Community Plantation Drive" },
  { id: "3", title: "Bamboo Value Chain Stories" },
  { id: "4", title: "Eco-Tourism in Jampui Hills" },
  { id: "5", title: "Watershed Management Field Visit" },
  { id: "6", title: "Livelihood Transformation Voices" },
];

export function SocialMedia() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetchSocial().then(setData).catch(() => setData(null)); }, []);

  const fb = data?.embeds?.facebook_embed_code;
  const tw = data?.embeds?.twitter_embed_code;
  const safeFb = fb
    ? DOMPurify.sanitize(fb, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: [
          "allow", "allowfullscreen", "frameborder", "scrolling",
          "style", "width", "height", "src", "class", "href", "target",
        ],
      })
    : "";
  const safeTw = tw
    ? DOMPurify.sanitize(tw, {
        ADD_TAGS: ["blockquote", "a"],
        ADD_ATTR: [
          "class", "href", "data-lang", "data-theme",
          "target", "rel",
        ],
      })
    : "";

  useEffect(() => {
    if (safeTw) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [safeTw]);
  const videos = data?.videos?.length ? data.videos : null;

  return (
    <PageLayout>
      <PageHeader
        title="Social Media"
        subtitle="Stay connected with the PROJECT ELEMENT on social media."
        breadcrumb={["Home", "Media", "Social Media"]}
      />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card flex flex-col">
              <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
                <Facebook className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">ELEMENT — Facebook</span>
              </div>
              {fb ? (
                <div
                  className="p-3 w-full flex justify-center overflow-x-hidden [&_iframe]:max-w-full [&_iframe]:w-full [&_blockquote]:max-w-full [&_*]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: safeFb }}
                />
              ) : (
                <div className="aspect-[4/5] bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                  Facebook iframe embed (ELEMENT)
                </div>
              )}
            </div>
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card flex flex-col">
              <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
                <Twitter className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">ELEMENT — Twitter / X</span>
              </div>
              {tw ? (
                <div
                  className="p-3 w-full flex justify-center overflow-x-hidden [&_iframe]:max-w-full [&_iframe]:w-full [&_blockquote]:max-w-full [&_*]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: safeTw }}
                />
              ) : (
                <div className="aspect-[4/5] bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                  Twitter / X iframe embed (ELEMENT)
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 bg-surface border-t border-border">
        <div className="gov-container">
          <h2 className="section-title flex items-center gap-2 mb-6">
            <Youtube className="h-6 w-6 text-accent" /> YouTube Videos
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(videos || dummyVideos).map((v: any) => (
              <div key={v.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-card transition">
                {videos && v.youtube_url ? (
                  <div className="aspect-video">
                    <iframe
                      src={youtubeEmbed(v.youtube_url)}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted/60 flex items-center justify-center text-muted-foreground text-sm">
                    YouTube embed placeholder
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-foreground leading-snug mb-0">{v.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 mb-0">PROJECT ELEMENT · Tripura</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

/* ---- Dummy events fallback ---- */
export const mediaEvents = [
  {
    slug: "world-bank-mission-visit-agartala",
    date: "10 May 2026",
    title: "World Bank Mission Visit — Agartala",
    venue: "Agartala, Tripura",
    description: "A high-level World Bank mission visited Agartala to review the progress of the PROJECT ELEMENT.",
    images: [
      { aspect: "aspect-[4/3]", label: "Mission opening session" },
      { aspect: "aspect-square", label: "Field briefing" },
      { aspect: "aspect-[3/4]", label: "Community meeting" },
      { aspect: "aspect-[16/9]", label: "Group photograph" },
    ],
  },
  {
    slug: "element-stakeholder-workshop-dhalai",
    date: "02 May 2026",
    title: "ELEMENT Stakeholder Workshop — Dhalai",
    venue: "Dhalai District, Tripura",
    description: "A district-level workshop convened community institutions and partner agencies.",
    images: [
      { aspect: "aspect-[3/4]", label: "Workshop inauguration" },
      { aspect: "aspect-[16/9]", label: "Group discussion" },
      { aspect: "aspect-square", label: "Stakeholder presentation" },
    ],
  },
];

const districtToSlug = (d: string) => d.toLowerCase().replace(/\s+/g, "-");
const slugToDistrict = (s: string) =>
  s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export function Gallery() {
  const [districts, setDistricts] = useState<{ district: string; image_count: number }[] | null>(null);
  useEffect(() => {
    fetchGalleryDistricts()
      .then((d) => setDistricts(Array.isArray(d) ? d : []))
      .catch(() => setDistricts([]));
  }, []);

  return (
    <PageLayout>
      <PageHeader
        title="Gallery"
        subtitle="Photographs from PROJECT ELEMENT field activities, events and community engagements."
        breadcrumb={["Home", "Media", "Gallery"]}
      />
      <section className="py-10">
        <div className="gov-container">
          {districts === null ? (
            <div className="text-center text-muted-foreground py-16 text-sm">Loading…</div>
          ) : districts.length === 0 ? (
            <div className="text-center text-muted-foreground py-16 text-sm">No gallery images available yet</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {districts.map((d) => (
                <Link
                  key={d.district}
                  to={`/media/gallery/${districtToSlug(d.district)}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-card hover:border-primary/40 transition p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-bold text-primary group-hover:text-accent transition mb-1">{d.district}</h3>
                    <p className="text-sm text-muted-foreground">{d.image_count} {d.image_count === 1 ? "photo" : "photos"}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                    View gallery <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

export function GalleryDistrict() {
  const { district: slug } = useParams();
  const districtName = slug ? slugToDistrict(slug) : "";
  const [items, setItems] = useState<any[] | null>(null);

  useEffect(() => {
    if (!districtName) return;
    fetchGalleryByDistrict(districtName)
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]));
  }, [districtName]);

  const lightboxImages: LightboxImage[] = useMemo(
    () =>
      (items || [])
        .filter((img) => img.image_path)
        .map((img) => ({ src: fileUrl(img.image_path), caption: img.caption || "" })),
    [items]
  );
  const [lbIndex, setLbIndex] = useState(-1);

  const openLightbox = (img: any) => {
    const idx = lightboxImages.findIndex((li) => li.src === fileUrl(img.image_path));
    if (idx >= 0) setLbIndex(idx);
  };

  return (
    <PageLayout>
      <PageHeader
        title={`${districtName} — Gallery`}
        breadcrumb={["Home", "Media", "Gallery", districtName]}
      />
      <section className="py-10">
        <div className="gov-container">
          <Link to="/media/gallery" className="text-sm text-primary inline-flex items-center gap-1 hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Gallery
          </Link>
          {items === null ? (
            <div className="text-center text-muted-foreground py-16 text-sm">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-center text-muted-foreground py-16 text-sm">No images for this district yet</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {items.map((img: any) => (
                <figure key={img.id} className="rounded-lg overflow-hidden border border-border bg-card">
                  <button
                    type="button"
                    onClick={() => openLightbox(img)}
                    disabled={!img.image_path}
                    className="block w-full aspect-square bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center text-[11px] text-muted-foreground text-center px-2 cursor-zoom-in disabled:cursor-default"
                  >
                    {img.image_path ? (
                      <img src={fileUrl(img.image_path)} alt={img.caption || ""} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <span>{img.caption}</span>
                    )}
                  </button>
                  {img.caption && (
                    <figcaption className="px-2 py-1.5 text-[11px] text-muted-foreground truncate">{img.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
      {lbIndex >= 0 && (
        <Lightbox
          images={lightboxImages}
          index={lbIndex}
          onClose={() => setLbIndex(-1)}
          onIndexChange={setLbIndex}
        />
      )}
    </PageLayout>
  );
}


export function MediaEvents() {
  const [items, setItems] = useState<any[] | null>(null);
  useEffect(() => { fetchEvents().then(setItems).catch(() => setItems([])); }, []);

  const display: any[] = USE_REAL_API && items && items.length
    ? items
    : mediaEvents.map((e) => ({ id: e.slug, slug: e.slug, title: e.title, event_date: e.date, description: e.description, cover_image_path: null }));

  return (
    <PageLayout>
      <PageHeader
        title="Events"
        subtitle="Upcoming and past events of the PROJECT ELEMENT."
        breadcrumb={["Home", "Media", "Events"]}
      />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {display.map((ev) => (
              <Link
                key={ev.id || ev.slug}
                to={`/media/events/${ev.slug}`}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-card hover:border-primary/40 transition flex flex-col"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/15 to-primary-light/15 flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
                  {ev.cover_image_path ? (
                    <img src={fileUrl(ev.cover_image_path)} alt={ev.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    "Event cover"
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[11px] text-accent font-semibold uppercase tracking-wide mb-2">
                    <Calendar className="h-3 w-3" /> {ev.event_date?.includes("-") ? formatEventDate(ev.event_date) : ev.event_date}
                  </div>
                  <h3 className="text-base font-bold text-foreground leading-snug mb-2 group-hover:text-primary">{ev.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{ev.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                    View details <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export function MediaEventDetail() {
  const { slug } = useParams();
  const [ev, setEv] = useState<any | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    if (!slug) return;
    fetchEvent(slug).then((d) => { setEv(d); setLoaded(true); }).catch(() => setLoaded(true));
  }, [slug]);

  const dummy = mediaEvents.find((e) => e.slug === slug);
  const display: any = ev || (dummy ? {
    title: dummy.title, event_date: dummy.date, description: dummy.description,
    venue: dummy.venue,
    images: dummy.images.map((i, idx) => ({ id: idx, caption: i.label, image_path: null })),
  } : null);

  if (loaded && !display) {
    return (
      <PageLayout>
        <PageHeader title="Event not found" breadcrumb={["Home", "Media", "Events"]} />
        <section className="py-10">
          <div className="gov-container">
            <Link to="/media/events" className="text-sm text-primary inline-flex items-center gap-1 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to all events
            </Link>
          </div>
        </section>
      </PageLayout>
    );
  }

  if (!display) return <PageLayout><div className="py-20 text-center text-sm text-muted-foreground">Loading…</div></PageLayout>;

  const eventLightboxImages: LightboxImage[] = (display.images || [])
    .filter((img: any) => img.image_path)
    .map((img: any) => ({ src: fileUrl(img.image_path), caption: img.caption || "" }));

  const openEventLightbox = (img: any) => {
    if (!img.image_path) return;
    const src = fileUrl(img.image_path);
    const idx = eventLightboxImages.findIndex((li) => li.src === src);
    if (idx >= 0) setLightboxIndex(idx);
  };

  return (
    <PageLayout>
      <PageHeader
        title={display.title}
        subtitle={`${display.event_date?.includes("-") ? formatEventDate(display.event_date) : display.event_date}${display.venue ? ` · ${display.venue}` : ""}`}
        breadcrumb={["Home", "Media", "Events", display.title]}
      />
      <section className="py-10">
        <div className="gov-container">
          <Link to="/media/events" className="text-sm text-primary inline-flex items-center gap-1 hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to all events
          </Link>

          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3 text-xs text-accent font-semibold uppercase tracking-wide mb-3">
              <Calendar className="h-3.5 w-3.5" />
              {display.event_date?.includes("-") ? formatEventDate(display.event_date) : display.event_date}
              {display.venue && (<><span className="text-muted-foreground/60">·</span><MapPin className="h-3.5 w-3.5" /> {display.venue}</>)}
            </div>
            {/* Duplicate title & description removed — already shown in PageHeader.
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">{display.title}</h1>
            {display.description && (
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{display.description}</p>
            )}
            */}

            {display.images?.length > 0 && (
              <>
                <h2 className="text-base font-bold text-primary mt-2 mb-4">Event Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {display.images.map((img: any) => (
                    <figure key={img.id} className="rounded-lg overflow-hidden border border-border bg-card">
                      <button
                        type="button"
                        onClick={() => openEventLightbox(img)}
                        disabled={!img.image_path}
                        className="block w-full aspect-square bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center text-[11px] text-muted-foreground text-center px-2 cursor-zoom-in disabled:cursor-default"
                      >
                        {img.image_path ? (
                          <img src={fileUrl(img.image_path)} alt={img.caption || ""} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <span>{img.caption}</span>
                        )}
                      </button>
                      {img.caption && (
                        <figcaption className="px-2 py-1.5 text-[11px] text-muted-foreground truncate">{img.caption}</figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {lightboxIndex >= 0 && (
        <Lightbox
          images={eventLightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </PageLayout>
  );
}
