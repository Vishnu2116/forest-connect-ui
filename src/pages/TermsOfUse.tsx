import PageLayout, { PageHeader } from "@/components/layout/PageLayout";

export default function TermsOfUse() {
  return (
    <PageLayout>
      <PageHeader title="Terms of Use" subtitle="Terms and conditions governing the use of this website" breadcrumb={["Home", "Terms of Use"]} />
      <section className="py-10">
        <div className="gov-container max-w-4xl">
          <div className="bg-card border border-border rounded-md p-8 shadow-card space-y-4 text-sm leading-relaxed text-muted-foreground">
            <h3 className="text-lg font-semibold text-primary">Acceptance of Terms</h3>
            <p>By accessing and using the ELEMENT website, you accept and agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please refrain from using the website.</p>
            <h3 className="text-lg font-semibold text-primary">Content Usage</h3>
            <p>The content published on this website, including text, graphics, and data, is owned by the Government of Tripura and may be freely used for non-commercial, informational purposes with appropriate attribution.</p>
            <h3 className="text-lg font-semibold text-primary">Limitation of Liability</h3>
            <p>The Government of Tripura shall not be held responsible for any loss, damage, or inconvenience caused as a result of reliance on any information published on this website.</p>
            <h3 className="text-lg font-semibold text-primary">External Links</h3>
            <p>Links to external websites are provided for convenience. The Government of Tripura does not endorse or take responsibility for the content of linked websites.</p>
            <h3 className="text-lg font-semibold text-primary">Governing Law</h3>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Tripura.</p>
            <p className="font-semibold text-foreground">© 2026 ELEMENT Project, Government of Tripura.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
