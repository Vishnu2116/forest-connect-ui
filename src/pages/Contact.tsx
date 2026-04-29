import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import MapPreview from "@/components/common/MapPreview";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function Contact() {
  return (
    <PageLayout>
      <PageHeader title="Contact Us" subtitle="Reach out to the Tripura Forest Department" breadcrumb={["Home", "Contact Us"]} />
      <section className="py-10">
        <div className="gov-container grid lg:grid-cols-3 gap-6">
          {[
            { icon: MapPin, title: "Address", body: "Aranya Bhawan, Gurkhabasti\nAgartala, Tripura — 799006" },
            { icon: Phone, title: "Phone", body: "+91 381 2416403\nHelpline: 1800-345-3666" },
            { icon: Mail, title: "Email", body: "info-forest@tripura.gov.in\npio-forest@tripura.gov.in" },
          ].map(c => (
            <div key={c.title} className="bg-card border border-border rounded-md p-6 shadow-card">
              <div className="p-2.5 bg-primary/10 text-primary rounded w-fit"><c.icon className="h-5 w-5" /></div>
              <h3 className="mt-3 font-semibold text-primary">{c.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="gov-container grid lg:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 className="section-title mb-4">Find us on the map</h2>
            <MapPreview title="Aranya Bhawan, Agartala" />
            <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Office Hours: Mon–Fri, 10:00 AM – 5:00 PM</div>
          </div>
          <div className="bg-card border border-border rounded-md p-6 shadow-card">
            <h2 className="section-title mb-6">Send us a message</h2>
            <form className="grid md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
              <input className="border border-input rounded px-3 py-2 text-sm bg-background focus-ring" placeholder="Your Name *" />
              <input className="border border-input rounded px-3 py-2 text-sm bg-background focus-ring" placeholder="Email *" type="email" />
              <input className="md:col-span-2 border border-input rounded px-3 py-2 text-sm bg-background focus-ring" placeholder="Subject" />
              <textarea rows={5} className="md:col-span-2 border border-input rounded px-3 py-2 text-sm bg-background focus-ring" placeholder="Your Message *" />
              <button className="md:col-span-2 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground px-5 py-2.5 rounded font-semibold w-fit">
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
