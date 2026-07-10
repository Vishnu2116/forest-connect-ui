import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { ExternalLink } from "lucide-react";

export default function Grievance() {
  return (
    <PageLayout>
      <PageHeader
        title="Grievance Redressal"
        subtitle="Submit your grievance through the official Tripura grievance portal"
        breadcrumb={["Home", "Grievance"]}
      />

      <section className="py-10">
        <div className="gov-container">
          <div className="bg-card border border-border rounded-md p-8 shadow-card text-center max-w-3xl mx-auto">
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
              Grievance Portal
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              CPGRAMS-Home
            </h2>

            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-6">
              Please use the official Tripura grievance portal to submit and
              track your grievance.
            </p>

            <a
              href="https://grievance.tripura.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded font-semibold focus-ring"
            >
              CPGRAMS-Home
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
