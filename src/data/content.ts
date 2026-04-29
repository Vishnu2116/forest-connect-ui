export const announcements = [
  { date: "28 Apr 2026", title: "Recruitment Notification: Forest Guard 2026 — Apply Online", tag: "Recruitment" },
  { date: "22 Apr 2026", title: "Tender Notice for Afforestation Works in Dhalai Division", tag: "Tender" },
  { date: "15 Apr 2026", title: "World Earth Day observed across all Forest Divisions of Tripura", tag: "Event" },
  { date: "10 Apr 2026", title: "Revised guidelines for Working Plan 2026-27 issued", tag: "Notification" },
  { date: "02 Apr 2026", title: "Annual Wildlife Census Report 2025-26 published", tag: "Report" },
];

export const events = [
  { date: "05 May 2026", title: "Workshop on Bamboo Plantation Management", venue: "Agartala, Tripura Administrative Training Institute" },
  { date: "12 May 2026", title: "Stakeholder Consultation on Forest Conservation Act", venue: "Conference Hall, Aranya Bhawan, Agartala" },
  { date: "20 May 2026", title: "Tree Plantation Drive — Van Mahotsav Preparatory", venue: "All Forest Divisions" },
  { date: "05 Jun 2026", title: "World Environment Day Celebrations", venue: "Statewide" },
];

export type Project = {
  title: string;
  description: string;
  objective: string;
  activities: string[];
  beneficiaries: string;
  status: string;
  coverage: string;
  component?: string;
};

export const projects: Project[] = [
  {
    title: "Landscape Restoration in Degraded Forest Areas",
    description: "Restoration of degraded forest landscapes through assisted natural regeneration, soil & moisture conservation, and species enrichment under the ELEMENT programme.",
    objective: "Restore ecological integrity of degraded forest landscapes and enhance carbon sequestration.",
    activities: ["Assisted natural regeneration", "Soil & moisture conservation works", "Native species enrichment plantation", "Catchment area treatment"],
    beneficiaries: "Forest fringe communities across 8 districts; ~25,000 households",
    status: "Ongoing",
    coverage: "Dhalai, Gomati, Khowai, North Tripura",
    component: "Component 1 — Landscape Management",
  },
  {
    title: "Forest Conservation & Biodiversity Strengthening",
    description: "Strengthening protected area management, wildlife habitat improvement and biodiversity conservation across sanctuaries of Tripura.",
    objective: "Conserve key biodiversity hotspots and improve management effectiveness of protected areas.",
    activities: ["Habitat improvement in Sipahijala & Trishna WLS", "Anti-poaching infrastructure", "Wildlife corridor mapping", "Species recovery programmes"],
    beneficiaries: "State biodiversity; eco-development committees; researchers",
    status: "Ongoing",
    coverage: "Sipahijala, Trishna, Gumti, Rowa Sanctuaries",
    component: "Component 2 — Biodiversity Conservation",
  },
  {
    title: "Community Livelihood & High Value Forest Products",
    description: "Promoting sustainable livelihoods through value-chain development of bamboo, agar, broom-grass and other High Value Forest Products (HVFPs).",
    objective: "Enhance income of forest-dependent communities through sustainable HVFP value chains.",
    activities: ["JFMC capacity building", "HVFP nurseries & cluster development", "Producer collectives & market linkages", "Skill training for women SHGs"],
    beneficiaries: "12,000+ SHG members, JFMCs, tribal cooperatives",
    status: "Ongoing",
    coverage: "All 8 districts of Tripura",
    component: "Component 3 — Livelihood Development",
  },
  {
    title: "Eco-Tourism Development Initiative",
    description: "Development of community-managed eco-tourism circuits at scenic forest landscapes to generate alternative livelihoods.",
    objective: "Develop responsible eco-tourism that benefits local communities and supports conservation.",
    activities: ["Eco-tourism site upgrades at Jampui Hills & Dumboor Lake", "Homestay programme", "Nature interpretation centres", "Community guide training"],
    beneficiaries: "Local youth, homestay operators, tourism cooperatives",
    status: "Pilot Phase",
    coverage: "Jampui Hills, Dumboor, Sipahijala",
    component: "Component 3 — Livelihood Development",
  },
  {
    title: "Climate Resilience & Watershed Management",
    description: "Climate-resilient watershed treatment, riparian restoration and adaptive management in vulnerable landscapes.",
    objective: "Build climate resilience of forest landscapes and dependent communities.",
    activities: ["Micro-watershed treatment", "Riparian buffer plantation", "Climate vulnerability assessments", "Drought-resilient species trials"],
    beneficiaries: "Communities in climate-vulnerable hill terrains",
    status: "Ongoing",
    coverage: "Dhalai, Unakoti, North Tripura",
    component: "Component 1 — Landscape Management",
  },
  {
    title: "Plantation & Biodiversity Conservation Programme",
    description: "Large-scale block, avenue and community plantation programme integrating biodiversity-rich species mix.",
    objective: "Increase green cover and conserve native flora through scientifically planned plantations.",
    activities: ["Block plantation of native species", "Bamboo corridors", "Avenue & roadside plantation", "Seed bank & nursery development"],
    beneficiaries: "Forest divisions, JFMCs, schools, urban local bodies",
    status: "Ongoing",
    coverage: "All Forest Divisions of Tripura",
    component: "Component 2 — Biodiversity Conservation",
  },
];

export const reports = [
  { title: "Annual Administrative Report 2024-25", date: "15 Mar 2026", size: "4.2 MB", type: "PDF" },
  { title: "State of Forest Report — Tripura Chapter 2025", date: "20 Feb 2026", size: "8.6 MB", type: "PDF" },
  { title: "Wildlife Census Report 2025", date: "10 Feb 2026", size: "3.1 MB", type: "PDF" },
  { title: "Forest Fire Incident Report 2025", date: "28 Jan 2026", size: "1.8 MB", type: "PDF" },
  { title: "CAMPA Utilization Report Q3 FY 2025-26", date: "12 Jan 2026", size: "2.4 MB", type: "PDF" },
  { title: "Plantation Audit Report 2024-25", date: "05 Jan 2026", size: "5.7 MB", type: "PDF" },
  { title: "Biodiversity Assessment — Sipahijala Landscape", date: "22 Dec 2025", size: "6.3 MB", type: "PDF" },
  { title: "Working Plan Revision Guidelines 2026", date: "10 Dec 2025", size: "1.2 MB", type: "PDF" },
];

export const publications = [
  { title: "Trees of Tripura — Field Guide (2nd Edition)", date: "Mar 2026", size: "12.5 MB", type: "PDF" },
  { title: "Bamboo Cultivation Manual", date: "Feb 2026", size: "4.8 MB", type: "PDF" },
  { title: "Medicinal Plants of North East India", date: "Jan 2026", size: "9.1 MB", type: "PDF" },
  { title: "Birds of Sipahijala — Photographic Atlas", date: "Dec 2025", size: "18.4 MB", type: "PDF" },
  { title: "Forest Working Plan Code (Revised)", date: "Nov 2025", size: "3.2 MB", type: "PDF" },
  { title: "Community Forest Management — Best Practices", date: "Oct 2025", size: "2.7 MB", type: "PDF" },
];

export const procurements = [
  { title: "Supply of GPS Devices for Forest Divisions", date: "25 Apr 2026", deadline: "15 May 2026", status: "Open" },
  { title: "Construction of Anti-Poaching Camps — Trishna WLS", date: "20 Apr 2026", deadline: "10 May 2026", status: "Open" },
  { title: "Procurement of Saplings for Monsoon Plantation", date: "15 Apr 2026", deadline: "05 May 2026", status: "Open" },
  { title: "Hiring of Vehicles for Field Operations", date: "10 Apr 2026", deadline: "30 Apr 2026", status: "Closing Soon" },
  { title: "IT Infrastructure Upgrade — Aranya Bhawan", date: "01 Apr 2026", deadline: "20 Apr 2026", status: "Closed" },
  { title: "Printing of IEC Materials FY 2026-27", date: "25 Mar 2026", deadline: "12 Apr 2026", status: "Closed" },
];

export const officials = [
  { name: "Shri D. K. Sharma, IFS", designation: "Principal Chief Conservator of Forests & HoFF", phone: "+91 381 2416403" },
  { name: "Smt. R. K. Samal, IFS", designation: "Additional PCCF (Wildlife) & Chief Wildlife Warden", phone: "+91 381 2416404" },
  { name: "Shri P. L. Agarwal, IFS", designation: "APCCF (Working Plan & Forest Conservation)", phone: "+91 381 2416405" },
  { name: "Dr. A. K. Gupta, IFS", designation: "APCCF (Research & Education)", phone: "+91 381 2416406" },
  { name: "Shri B. S. Mishra, IFS", designation: "APCCF (Territorial)", phone: "+91 381 2416407" },
  { name: "Smt. L. Darlong, IFS", designation: "APCCF (Social Forestry)", phone: "+91 381 2416408" },
  { name: "Shri J. Reang, IFS", designation: "APCCF (Administration)", phone: "+91 381 2416409" },
  { name: "Shri S. Debbarma, IFS", designation: "CCF (South Tripura Circle)", phone: "+91 3823 222033" },
];

export const knowledgeHubItems = [
  { category: "IEC Materials", title: "Save Our Forests — Awareness Brochure", date: "Apr 2026" },
  { category: "Newsletters", title: "Aranya Patrika — Quarterly Newsletter Vol. 12", date: "Mar 2026" },
  { category: "Success Stories", title: "Restoration of Degraded Forests in Dhalai", date: "Feb 2026" },
  { category: "Thematic Studies", title: "Climate Resilience of Riparian Forests", date: "Feb 2026" },
  { category: "Documentation", title: "SOP for Forest Fire Management", date: "Jan 2026" },
  { category: "Case Studies", title: "Community-led Conservation in Gomati", date: "Jan 2026" },
  { category: "Notifications", title: "Declaration of New Conservation Reserve", date: "Dec 2025" },
  { category: "Lessons Learned", title: "Insights from JICA Phase-I Implementation", date: "Dec 2025" },
];

export const plantations = [
  { id: 1, name: "Sipahijala Block-A Plantation", district: "Sepahijala", year: 2024, species: "Sal, Teak", area: 145, lat: 38, lng: 30 },
  { id: 2, name: "Trishna Buffer Plantation", district: "South Tripura", year: 2023, species: "Hollong, Mekai", area: 220, lat: 78, lng: 32 },
  { id: 3, name: "Jampui Hill Plantation", district: "North Tripura", year: 2025, species: "Bamboo, Gmelina", area: 310, lat: 18, lng: 75 },
  { id: 4, name: "Gumti Riverine Restoration", district: "Gomati", year: 2024, species: "Khair, Sissoo", area: 180, lat: 60, lng: 50 },
  { id: 5, name: "Rowa Wetland Edge", district: "Unakoti", year: 2025, species: "Bamboo, Bonsum", area: 95, lat: 25, lng: 65 },
  { id: 6, name: "Khowai Community Plantation", district: "Khowai", year: 2023, species: "Mehogoni, Teak", area: 130, lat: 42, lng: 48 },
  { id: 7, name: "Agartala Roadside Avenue", district: "West Tripura", year: 2024, species: "Krishnachura, Neem", area: 60, lat: 30, lng: 22 },
  { id: 8, name: "Dhalai Hillslope Plantation", district: "Dhalai", year: 2025, species: "Sissoo, Khair", area: 120, lat: 50, lng: 70 },
];

export const districts = ["All Districts", "West Tripura", "Sepahijala", "Khowai", "Gomati", "South Tripura", "Dhalai", "Unakoti", "North Tripura"];
export const years = ["All Years", "2025", "2024", "2023"];
