import PageLayout, { PageHeader } from "@/components/layout/PageLayout";

export default function PrivacyPolicy() {
  return (
    <PageLayout>
      <PageHeader title="Privacy Policy" subtitle="How we collect, use and protect your information" breadcrumb={["Home", "Privacy Policy"]} />
      <section className="py-10">
        <div className="gov-container max-w-4xl">
          <div className="bg-card border border-border rounded-md p-8 shadow-card space-y-4 text-sm leading-relaxed text-muted-foreground">
            <h3 className="text-lg font-semibold text-primary">Information Collection</h3>
            <p>The ELEMENT website does not automatically capture any specific personal information from you (such as name, phone number, or email address) that would allow us to identify you individually. If you choose to provide personal information through grievance forms or contact forms, this information will be used only for the stated purpose.</p>
            <h3 className="text-lg font-semibold text-primary">Use of Information</h3>
            <p>Personal information provided by users is used solely for responding to queries, processing grievances, and improving our services. We do not sell, trade, or share personal information with third parties.</p>
            <h3 className="text-lg font-semibold text-primary">Cookies and Analytics</h3>
            <p>This website may use cookies for session management and analytics to understand usage patterns. No personally identifiable information is collected through cookies.</p>
            <h3 className="text-lg font-semibold text-primary">Data Security</h3>
            <p>We employ appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
            <p className="font-semibold text-foreground">© 2026 ELEMENT Project, Government of Tripura.</p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
