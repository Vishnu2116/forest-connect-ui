import { useEffect, useState } from "react";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { FileText, Download, ExternalLink } from "lucide-react";
import { API_BASE_URL, USE_REAL_API } from "@/config/api";
import { getOriginalFilename } from "@/utils/fileDownload";

type OfficerType = "public_information_officer" | "first_appellate_officer";

interface Officer {
  id: string;
  officer_type: OfficerType;
  name: string;
  designation: string;
  address: string;
  phone: string;
  email: string;
  display_order: number;
}

interface RtiDocument {
  id: string;
  title: string;
  file_path: string;
  file_size: number;
  file_type: string;
  display_order: number;
}

const DUMMY_OFFICERS: Officer[] = [
  {
    id: "dummy-pio",
    officer_type: "public_information_officer",
    name: "Shri B. Chakma, IFS",
    designation: "CCF (Administration)",
    address: "Aranya Bhawan, Agartala",
    phone: "+91 381 2416480",
    email: "pio-forest@tripura.gov.in",
    display_order: 1,
  },
];

const DUMMY_DOCS: RtiDocument[] = [
  { id: "d1", title: "RTI Application Form", file_path: "", file_size: 0, file_type: "PDF", display_order: 1 },
  { id: "d2", title: "RTI First Appeal Form", file_path: "", file_size: 0, file_type: "PDF", display_order: 2 },
  { id: "d3", title: "Fee Structure", file_path: "", file_size: 0, file_type: "PDF", display_order: 3 },
  { id: "d4", title: "Annual RTI Report 2024-25", file_path: "", file_size: 0, file_type: "PDF", display_order: 4 },
];

function formatSize(kb: number): string {
  if (!kb) return "";
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export default function RTI() {
  const [officers, setOfficers] = useState<Officer[]>(DUMMY_OFFICERS);
  const [docs, setDocs] = useState<RtiDocument[]>(DUMMY_DOCS);

  useEffect(() => {
    if (!USE_REAL_API) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/rti`);
        if (!res.ok) return;
        const data = await res.json();
        const apiOfficers: Officer[] = Array.isArray(data?.officers) ? data.officers : [];
        const apiDocs: RtiDocument[] = Array.isArray(data?.documents) ? data.documents : [];
        if (apiOfficers.length) setOfficers(apiOfficers);
        if (apiDocs.length) setDocs(apiDocs);
      } catch {
        // keep dummy
      }
    })();
  }, []);

  const pio = officers
    .filter((o) => o.officer_type === "public_information_officer")
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))[0];

  const sortedDocs = [...docs].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  /* Sections 1–6 hidden per request — kept commented for reference.
  const sections = [
    { title: "1. Particulars of the Organization", body: "The Tripura Forest Department is headed by the Principal Chief Conservator of Forests & Head of Forest Force, with offices across all forest divisions of the State." },
    { title: "2. Powers and Duties of Officers", body: "Officers exercise statutory powers under the Indian Forest Act 1927, the Wild Life (Protection) Act 1972, and the Forest (Conservation) Act 1980." },
    { title: "3. Procedure for Decision Making", body: "Decisions are taken in accordance with the Office Procedure Manual and rules of business of the Government of Tripura." },
    { title: "4. Norms set for Discharge of Functions", body: "Service standards are published in the Citizen's Charter of the Department." },
    { title: "5. Rules, Regulations and Manuals", body: "All applicable rules, instructions and manuals are listed and available for download." },
    { title: "6. Directory of Officers", body: "Refer to the Official Directory under the About Us section." },
  ];
  */

  return (
    <PageLayout>
      <PageHeader
        title="Right to Information (RTI)"
        subtitle="Information disclosed under Section 4(1)(b) of the RTI Act, 2005"
        breadcrumb={["Home", "RTI"]}
      />
      <section className="py-10">
        <div className="gov-container">
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {pio && (
              <div className="bg-primary text-primary-foreground rounded-md p-5">
                <h2 className="font-semibold text-xl ">Public Information Officer</h2>
                <p className="text-md opacity-90 mt-2">
                  {pio.name}
                  {pio.designation && (<><br />{pio.designation}</>)}
                  {pio.address && (<><br />{pio.address}</>)}
                </p>
                <p className="text-md opacity-90 mt-2">
                  {pio.phone && <>📞 {pio.phone}</>}
                  {pio.phone && pio.email && <br />}
                  {pio.email && <>✉ {pio.email}</>}
                </p>
              </div>
            )}
            <div className="bg-card border border-border rounded-md p-5">
              <h3 className="font-semibold text-primary">RTI Documents</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {sortedDocs.map((d) => {
                  const href = d.file_path ? `${API_BASE_URL}${d.file_path}` : undefined;
                  const sizeLabel = formatSize(d.file_size);
                  return (
                    <li key={d.id} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>
                          {d.title}
                          {sizeLabel && (<span className="text-xs text-muted-foreground ml-2">({sizeLabel})</span>)}
                        </span>
                      </span>
                      {href ? (
                        <a href={href} download={getOriginalFilename(d.file_path)} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover" aria-label={`Download ${d.title}`}>
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <button className="text-accent hover:text-accent-hover" aria-label={`Download ${d.title}`}>
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-md p-8 shadow-card text-center max-w-3xl mx-auto mt-8">
            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
              File an RTI
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">RTI Online — Tripura</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-6">
              Submit and track your RTI applications through the official Tripura RTI Online portal.
            </p>
            <a
              href="https://rtionline.tripura.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded font-semibold focus-ring"
            >
              RTI Online - Tripura
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
