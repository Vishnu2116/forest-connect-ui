import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { officials } from "@/data/content";
import { Phone, Mail, User } from "lucide-react";

export default function WhosWho() {
  return (
    <PageLayout>
      <PageHeader title="Who's Who" subtitle="Senior officials of the Assam Forest Department" breadcrumb={["Home", "Who's Who"]} />
      <section className="py-10">
        <div className="gov-container grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {officials.map(o => (
            <article key={o.name} className="bg-card border border-border rounded-md p-5 text-center hover:shadow-card transition">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground">
                <User className="h-10 w-10" />
              </div>
              <h3 className="mt-4 font-semibold text-sm text-primary">{o.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{o.designation}</p>
              <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-center gap-1.5"><Phone className="h-3 w-3" /> {o.phone}</div>
                <div className="flex items-center justify-center gap-1.5"><Mail className="h-3 w-3" /> contact@assamforest.gov.in</div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
