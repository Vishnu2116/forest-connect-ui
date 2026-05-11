import PageLayout, { PageHeader } from "@/components/layout/PageLayout";

export default function CopyrightPolicy() {
  return (
    <PageLayout>
      <PageHeader title="Copyright Policy" breadcrumb={["Home", "Copyright Policy"]} />
      <section className="py-10">
        <div className="gov-container max-w-4xl space-y-5 text-sm text-foreground/85 leading-relaxed">
          <p>
            Material featured on this portal may be reproduced free of charge after taking proper permission by sending a mail to us. However, the material has to be reproduced accurately and not to be used in a derogatory manner or in a misleading context. Wherever the material is being published or issued to others, the source must be prominently acknowledged.
          </p>
          <p>
            However, the permission to reproduce this material shall not extend to any material which is identified as being copyright of a third party. Authorization to reproduce such material must be obtained from the departments/copyright holders concerned.
          </p>
          <p>
            All content © {new Date().getFullYear()} ELEMENT Project, Government of Tripura. All rights reserved.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
