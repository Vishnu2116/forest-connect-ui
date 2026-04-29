import PageLayout, { PageHeader } from "@/components/layout/PageLayout";

export default function Disclaimer() {
  return (
    <PageLayout>
      <PageHeader title="Disclaimer" subtitle="Terms governing the use of this website" breadcrumb={["Home", "Disclaimer"]} />
      <section className="py-10">
        <div className="gov-container max-w-4xl">
          <div className="bg-card border border-border rounded-md p-8 shadow-card space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>The information provided on this website is for general information purposes only. While the Assam Forest Department endeavours to keep the information up-to-date and correct, no representations or warranties of any kind, express or implied, are made about the completeness, accuracy, reliability or suitability of the information.</p>
            <p>Any reliance you place on such information is strictly at your own risk. The Department will not be liable for any losses or damages arising from the use of this website.</p>
            <p>This website contains links to other external websites that are not under the control of the Department. We have no control over the nature, content and availability of those sites.</p>
            <p>Every effort is made to keep the website up and running smoothly. However, the Department takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.</p>
            <p className="font-semibold text-foreground">© 2026 Assam Forest Department, Government of Assam.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
