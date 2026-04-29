import AboutLayout from "@/components/layout/AboutLayout";

export function Organization() {
  return (
    <AboutLayout title="Organization Structure" subtitle="Departmental hierarchy of the Assam Forest Department">
      <div className="bg-card border border-border rounded-md p-6 shadow-card">
        <ol className="space-y-4">
          {[
            ["Hon'ble Forest Minister", "Government of Assam"],
            ["Principal Secretary, Environment & Forests", "Administrative Head"],
            ["Principal Chief Conservator of Forests (PCCF) & HoFF", "Head of Forest Force"],
            ["Additional PCCFs (Wildlife / Working Plan / Research / Territorial / Social Forestry / Administration)", "Functional Heads"],
            ["Chief Conservators of Forests (CCFs) — Circles", "Field Heads"],
            ["Conservators of Forests (CFs) — Divisions", "Division Heads"],
            ["Divisional Forest Officers (DFOs)", "Operational Heads"],
            ["Range Officers, Foresters & Forest Guards", "Field Staff"],
          ].map(([t, s], i) => (
            <li key={i} className="flex gap-4">
              <div className="shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{i + 1}</div>
              <div>
                <div className="font-semibold text-foreground">{t}</div>
                <div className="text-sm text-muted-foreground">{s}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </AboutLayout>
  );
}

export function Memorandum() {
  return (
    <AboutLayout title="Memorandum of Association" subtitle="Founding governance and association framework">
      <div className="bg-card border border-border rounded-md p-6 shadow-card space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>The Memorandum of Association sets forth the constitution, objectives, and governance framework of the Assam Forest Department's associated societies and registered bodies operating under its umbrella.</p>
        <p>It outlines the powers of the General Body, the composition of the Governing Council, the financial controls, and the audit framework as mandated under the Societies Registration Act and applicable State rules.</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Name, registered office and area of operation</li>
          <li>Aims and objectives of the society</li>
          <li>Composition of the Governing Body</li>
          <li>Financial regulations and audit procedure</li>
          <li>Procedure for amendment and dissolution</li>
        </ul>
        <button className="bg-accent hover:bg-accent-hover text-accent-foreground px-4 py-2 rounded text-sm font-semibold">Download MoA (PDF, 1.2 MB)</button>
      </div>
    </AboutLayout>
  );
}

export function Directory() {
  return (
    <AboutLayout title="Official Directory" subtitle="Contact details of senior officials">
      <div className="overflow-x-auto rounded-md border border-border bg-card shadow-card">
        <table className="data-table">
          <thead><tr><th>Name</th><th>Designation</th><th>Office</th><th>Phone</th></tr></thead>
          <tbody>
            {[
              ["Shri M. K. Yadava, IFS", "PCCF & HoFF", "Aranya Bhavan", "+91 361 2566064"],
              ["Smt. Sonali Ghosh, IFS", "APCCF (Wildlife) & CWLW", "Aranya Bhavan", "+91 361 2566065"],
              ["Shri R. Borah, IFS", "APCCF (Working Plan)", "Aranya Bhavan", "+91 361 2566066"],
              ["Dr. P. Sivakumar, IFS", "APCCF (Research)", "RFRI Jorhat", "+91 376 2370058"],
              ["Shri A. Swargowari, IFS", "APCCF (Territorial)", "Aranya Bhavan", "+91 361 2566068"],
              ["Smt. R. Suchiang, IFS", "APCCF (Social Forestry)", "Aranya Bhavan", "+91 361 2566069"],
            ].map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </AboutLayout>
  );
}

export function Vision() {
  return (
    <AboutLayout title="Vision & Objective" subtitle="A greener, biodiverse and resilient Assam">
      <div className="bg-card border border-border rounded-md p-6 shadow-card space-y-4">
        <h3 className="text-xl font-semibold text-primary">Our Vision</h3>
        <p className="text-muted-foreground leading-relaxed">To conserve, protect and scientifically manage the forest, wildlife and biodiversity resources of Assam in a sustainable manner, ensuring ecological balance and the well-being of present and future generations.</p>
        <h3 className="text-xl font-semibold text-primary mt-4">Key Objectives</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
          <li>Increase the green cover and forest density of the State.</li>
          <li>Conserve flagship species and protected areas.</li>
          <li>Promote community participation in forest management.</li>
          <li>Mitigate climate change impacts through sustainable practices.</li>
          <li>Enhance livelihoods of forest-fringe communities.</li>
        </ul>
      </div>
    </AboutLayout>
  );
}

export function Mission() {
  return (
    <AboutLayout title="Mission & Objective" subtitle="Action-oriented commitments of the Department">
      <div className="bg-card border border-border rounded-md p-6 shadow-card space-y-4">
        <h3 className="text-xl font-semibold text-primary">Our Mission</h3>
        <p className="text-muted-foreground leading-relaxed">To deliver scientific, transparent and people-centric forest governance through capacity-building, technology adoption, and partnerships with communities, research institutions and other stakeholders.</p>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {[
            ["Conservation", "Protect 35,000+ sq km of recorded forest area."],
            ["Restoration", "Restore degraded forests through scientific afforestation."],
            ["Community", "Empower JFMCs and EDCs across the State."],
            ["Innovation", "Adopt GIS, drones and satellite-based monitoring."],
          ].map(([t, d]) => (
            <div key={t} className="border border-border rounded p-4">
              <div className="font-semibold text-primary">{t}</div>
              <div className="text-sm text-muted-foreground mt-1">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </AboutLayout>
  );
}
