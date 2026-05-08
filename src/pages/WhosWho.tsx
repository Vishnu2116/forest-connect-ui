import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { officials } from "@/data/content";
import { Phone, Mail, User } from "lucide-react";

export default function WhosWho() {
  return (
    <PageLayout>
      <PageHeader title="Who's Who" subtitle="Senior officials of the ELEMENT Programme" breadcrumb={["Home", "Who's Who"]} />
      <section className="py-10">
        <div className="gov-container grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {officials.map(o => (
            <article key={o.name} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-card transition group">
              <div className="mx-auto h-28 w-28 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground overflow-hidden group-hover:scale-105 transition-transform">
                {o.image ? (
                  <img src={o.image} alt={o.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12" />
                )}
              </div>
              <h3 className="mt-4 font-semibold text-base text-primary">{o.name}</h3>
              <p className="text-sm text-foreground font-semibold mt-1">{o.designation}</p>
              <p className="text-xs text-muted-foreground mt-0.5 min-h-[20px]">{o.department}</p>
              <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-center gap-1.5"><Phone className="h-3 w-3" /> {o.phone}</div>
                <div className="flex items-center justify-center gap-1.5"><Mail className="h-3 w-3" /> {o.email}</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
