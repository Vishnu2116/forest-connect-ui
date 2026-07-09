import { Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { ArrowLeft } from "lucide-react";

export default function ActivityReports() {
  return (
    <PageLayout>
      <PageHeader
        title="Activity Reports"
        breadcrumb={["Home", "Activities & Outputs", "Reports"]}
      />

      <section className="py-10">
        <div className="gov-container max-w-4xl">
          <Link
            to="/activities"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Activities
          </Link>

          <div className="space-y-8 flex flex-col items-center">
            <img
              src="/table1.png"
              alt="Activity outputs — Table 1"
              className="w-full max-w-4xl h-auto rounded-md border border-border shadow-card"
            />
            <img
              src="/table2.png"
              alt="Activity outputs — Table 2"
              className="w-full max-w-4xl h-auto rounded-md border border-border shadow-card"
            />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
