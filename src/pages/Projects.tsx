import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { projects } from "@/data/content";
import { Trees, Pencil, Plus } from "lucide-react";

export default function Projects() {
  return (
    <PageLayout>
      <PageHeader title="Projects" subtitle="Major initiatives undertaken by the Tripura Forest Department" breadcrumb={["Home", "Projects"]} />
      <section className="py-10">
        <div className="gov-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">All Projects</h2>
            <button className="hidden md:inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 rounded text-sm font-semibold">
              <Plus className="h-4 w-4" /> Add Project
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((p) => (
              <article key={p.title} className="bg-card border border-border rounded-md p-6 hover:shadow-card transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-primary/10 text-primary"><Trees className="h-5 w-5" /></div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-success/10 text-success">{p.status}</span>
                      <h3 className="text-base font-semibold text-primary mt-1">{p.title}</h3>
                    </div>
                  </div>
                  <button aria-label="Edit" className="p-1.5 text-muted-foreground hover:text-primary"><Pencil className="h-4 w-4" /></button>
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{p.description}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-surface rounded p-2"><dt className="text-muted-foreground">Coverage</dt><dd className="font-semibold text-foreground">{p.coverage}</dd></div>
                  <div className="bg-surface rounded p-2"><dt className="text-muted-foreground">Status</dt><dd className="font-semibold text-foreground">{p.status}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
