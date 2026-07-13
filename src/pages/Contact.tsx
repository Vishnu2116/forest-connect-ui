import { useEffect, useRef, useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
// import MapPreview from "@/components/common/MapPreview"; // Replaced with real Google Map below
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { fetchMapKey, loadGoogleMaps } from "@/lib/gis";

const ARANYA_BHAWAN = { lat: 23.8554146, lng: 91.2800762 };

export default function Contact() {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const [mapMsg, setMapMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const key = await fetchMapKey();
      if (cancelled) return;
      if (!key) { setMapMsg("Map key unavailable."); return; }
      if (!mapEl.current) return;
      const g = await loadGoogleMaps(key);
      if (cancelled || !g?.maps) { setMapMsg("Could not load Google Maps."); return; }
      const map = new g.maps.Map(mapEl.current, {
        center: ARANYA_BHAWAN,
        zoom: 16,
        mapTypeControl: true,
        streetViewControl: false,
      });
      const marker = new g.maps.Marker({
        position: ARANYA_BHAWAN,
        map,
        title: "Aranya Bhawan, Agartala",
      });
      const info = new g.maps.InfoWindow({
        content: '<div style="font-size:12px;font-weight:600;">Aranya Bhawan, Agartala</div>',
      });
      info.open({ map, anchor: marker });
      marker.addListener("click", () => info.open({ map, anchor: marker }));
    })();
    return () => { cancelled = true; };
  }, []);

  const cards = [
    {
      icon: MapPin,
      title: "Address",
      body: "Aranya Bhawan, Gurkhabasti\nAgartala, Tripura — 799006",
    },
    {
      icon: Phone,
      title: "Phone",
      body: "+91 381 2416403\nHelpline: 1800-345-3666",
    },
    {
      icon: Mail,
      title: "Email",
      body: "info-forest@tripura.gov.in\npio-forest@tripura.gov.in",
    },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Contact Us"
        subtitle="Reach out to the Tripura Forest Department"
        breadcrumb={["Home", "Contact Us"]}
      />
      <section className="py-10">
        <div className="gov-container space-y-8">
          {/* TOP ROW: Form (left) + Map (right) */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-md p-6 shadow-card">
              <h2 className="section-title mb-6">Send us a message</h2>
              <form
                className="grid md:grid-cols-2 gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                  placeholder="Your Name *"
                />
                <input
                  className="border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                  placeholder="Email *"
                  type="email"
                />
                <input
                  className="md:col-span-2 border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                  placeholder="Subject"
                />
                <textarea
                  rows={5}
                  className="md:col-span-2 border border-input rounded px-3 py-2 text-sm bg-background focus-ring"
                  placeholder="Your Message *"
                />
                <button className="md:col-span-2 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2.5 rounded font-semibold w-fit">
                  <Send className="h-4 w-4" /> Send Message
                </button>
              </form>
            </div>

            <div>
              <h2 className="section-title mb-4">Find us on the map</h2>
              {/* Old placeholder demo map — kept commented for reference.
              <MapPreview title="Aranya Bhawan, Agartala" />
              */}
              <div className="relative w-full h-[420px] rounded-md overflow-hidden border border-border bg-surface shadow-card">
                <div ref={mapEl} className="w-full h-full" />
                {mapMsg && (
                  <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur px-3 py-2 rounded shadow-card text-[11px] text-muted-foreground">
                    {mapMsg}
                  </div>
                )}
              </div>
              <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Office Hours: Mon–Fri, 10:00
                AM – 5:00 PM
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: 3 cards — icon left, text right */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c) => (
              <div
                key={c.title}
                className="bg-card border border-border rounded-md p-5 shadow-card flex items-start gap-4"
              >
                <div className="p-2.5 bg-primary/10 text-primary rounded shrink-0">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-primary">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
