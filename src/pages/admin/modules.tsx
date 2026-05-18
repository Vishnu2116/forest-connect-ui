import CrudModule from "./CrudModule";
import KnowledgeHubAdmin from "./KnowledgeHubAdmin";

const districts = ["West Tripura","Sepahijala","Khowai","Gomati","South Tripura","Dhalai","Unakoti","North Tripura"];
const status = ["Active","Inactive","Draft","Published"];

export const NotificationsAdmin = () => (
  <CrudModule
    title="Notifications"
    subtitle="Manage public notifications and announcements."
    fields={[
      { key: "title", label: "Title", required: true },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "status", label: "Status", type: "select", options: status },
      { key: "description", label: "Description", type: "textarea" },
    ]}
    columns={["title","date","status"]}
    initial={[
      { title: "Tender notice for plantation works in Khowai", date: "2026-04-28", status: "Published", description: "Floating tender for 200 ha plantation." },
      { title: "ELEMENT stakeholder workshop on 15 May", date: "2026-04-22", status: "Active", description: "Workshop at Aranya Bhawan." },
      { title: "Recruitment of district coordinators", date: "2026-04-15", status: "Draft", description: "Walk-in interview." },
    ]}
  />
);

export const EventsAdmin = () => (
  <CrudModule
    title="Events"
    subtitle="Manage upcoming and past events."
    fields={[
      { key: "title", label: "Event Title", required: true },
      { key: "eventDate", label: "Event Date", type: "date" },
      { key: "venue", label: "Venue" },
      { key: "description", label: "Description", type: "textarea" },
    ]}
    columns={["title","eventDate","venue"]}
    initial={[
      { title: "Stakeholder Workshop on HVFPs", eventDate: "2026-05-15", venue: "Aranya Bhawan, Agartala", description: "Multi-stakeholder consultation." },
      { title: "Community Plantation Drive", eventDate: "2026-06-05", venue: "Sepahijala", description: "World Environment Day plantation." },
    ]}
  />
);

export const TendersAdmin = () => (
  <CrudModule
    title="Tenders / Procurements"
    subtitle="Manage active and closed tenders."
    fields={[
      { key: "title", label: "Tender Title", required: true },
      { key: "tenderNo", label: "Tender Number" },
      { key: "date", label: "Issue Date", type: "date" },
      { key: "closingDate", label: "Closing Date", type: "date" },
      { key: "document", label: "Tender Document", type: "file" },
    ]}
    columns={["tenderNo","title","date","closingDate"]}
    initial={[
      { tenderNo: "ELE/2026/T-018", title: "Bamboo plantation works — Khowai", date: "2026-04-10", closingDate: "2026-05-05" },
      { tenderNo: "ELE/2026/T-017", title: "Procurement of GIS hardware", date: "2026-04-02", closingDate: "2026-04-30" },
    ]}
  />
);

export const WhosWhoAdmin = () => (
  <CrudModule
    title="Who's Who"
    subtitle="Manage department officials and contacts."
    fields={[
      { key: "name", label: "Name", required: true },
      { key: "designation", label: "Designation" },
      { key: "department", label: "Department" },
      { key: "contact", label: "Contact" },
      { key: "photo", label: "Photo", type: "file" },
    ]}
    columns={["name","designation","department","contact"]}
    initial={[
      { name: "Shri R. K. Samanta, IFS", designation: "PCCF & HoFF", department: "Tripura Forest Dept.", contact: "+91 381 2416403" },
      { name: "Smt. Anjali Debbarma", designation: "Project Director", department: "ELEMENT PMU", contact: "pd@element.tripura.gov.in" },
    ]}
  />
);

export const SuccessStoriesAdmin = () => (
  <KnowledgeHubAdmin title="Success Stories" subtitle="Manage published success stories." lockedCategoryName="Success Stories" fileCategory="knowledge_hub" />
);

export const NewslettersAdmin = () => (
  <KnowledgeHubAdmin title="Newsletters" subtitle="Periodic ELEMENT newsletters." lockedCategoryName="Newsletters" fileCategory="knowledge_hub" />
);

export const ThematicAdmin = () => (
  <KnowledgeHubAdmin title="Thematic Studies" subtitle="Studies on landscape & ecosystem themes." lockedCategoryName="Thematic Studies" fileCategory="knowledge_hub" />
);

export const ReportsAdmin = () => (
  <KnowledgeHubAdmin title="Reports" subtitle="Project progress and evaluation reports." lockedCategoryName="Reports" fileCategory="report" />
);

export const IECAdmin = () => (
  <KnowledgeHubAdmin title="IEC Materials" subtitle="Information, Education & Communication assets." lockedCategoryName="IEC Materials" fileCategory="knowledge_hub" />
);

export const ActivitiesAdmin = () => (
  <CrudModule
    title="Activities & Outputs"
    subtitle="Track on-ground activities by district and component."
    fields={[
      { key: "title", label: "Activity Title", required: true },
      { key: "component", label: "Component", type: "select", options: ["Landscape Restoration","HVFPs","Climate Resilience","Capacity Building","M&E"] },
      { key: "district", label: "District", type: "select", options: districts },
      { key: "status", label: "Status", type: "select", options: ["Planned","Ongoing","Completed"] },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image", label: "Activity Image", type: "image", imageDimensions: "800 × 500 px" },
    ]}
    columns={["title","component","district","status"]}
    initial={[
      { title: "Mixed plantation in Sepahijala", component: "Landscape Restoration", district: "Sepahijala", status: "Ongoing", description: "120 ha mixed-species plantation." },
      { title: "SHG training on bamboo crafts", component: "HVFPs", district: "Khowai", status: "Completed", description: "120 women trained." },
    ]}
  />
);

export const ProjectsAdmin = () => (
  <CrudModule
    title="Projects"
    subtitle="Manage public-facing project entries."
    fields={[
      { key: "title", label: "Project Title", required: true },
      { key: "objective", label: "Objective", type: "textarea" },
      { key: "activities", label: "Key Activities", type: "textarea" },
      { key: "beneficiaries", label: "Target Beneficiaries" },
      { key: "status", label: "Status", type: "select", options: ["Planned","Ongoing","Completed"] },
      { key: "location", label: "Location" },
      { key: "image", label: "Project Image", type: "image", imageDimensions: "800 × 500 px" },
    ]}
    columns={["title","beneficiaries","status","location"]}
    initial={[
      { title: "Landscape Restoration Project", objective: "Restore degraded forest landscapes.", activities: "Plantation, ANR, soil & moisture conservation.", beneficiaries: "Forest-fringe communities", status: "Ongoing", location: "All districts" },
      { title: "HVFP Value Chain Development", objective: "Develop high-value forest product chains.", activities: "SHG formation, training, market linkage.", beneficiaries: "SHGs, FPOs", status: "Ongoing", location: "Khowai, Dhalai, Gomati" },
    ]}
  />
);
