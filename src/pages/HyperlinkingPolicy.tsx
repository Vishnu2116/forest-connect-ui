import PageLayout, { PageHeader } from "@/components/layout/PageLayout";

export default function HyperlinkingPolicy() {
  return (
    <PageLayout>
      <PageHeader title="Hyperlinking Policy" breadcrumb={["Home", "Hyperlinking Policy"]} />
      <section className="py-10">
        <div className="gov-container max-w-4xl space-y-5 text-sm text-foreground/85 leading-relaxed">
          <h2 className="text-lg font-bold text-primary">Links to External Websites / Portals</h2>
          <p>
            At many places on this portal, you will find links to other websites/portals. These links have been placed for your convenience. The ELEMENT Project, Government of Tripura is not responsible for the contents and reliability of the linked websites and does not necessarily endorse the views expressed in them. Mere presence of the link or its listing on this portal should not be assumed as endorsement of any kind. We cannot guarantee that these links will work all the time and have no control over the availability of linked pages.
          </p>
          <h2 className="text-lg font-bold text-primary">Links to ELEMENT Portal by Other Websites</h2>
          <p>
            We do not object to you linking directly to the information that is hosted on this portal and no prior permission is required for the same. However, we would like you to inform us about any links provided to this portal so that you can be informed of any changes or updations therein. Also, we do not permit our pages to be loaded into frames on your site. Pages of this portal must load into a newly opened browser window of the user.
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
