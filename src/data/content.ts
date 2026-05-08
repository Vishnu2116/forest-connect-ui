export const announcements = [
  { date: "28 Apr 2026", title: "Recruitment: District Coordinators for ELEMENT Programme — Apply Online", tag: "Recruitment" },
  { date: "22 Apr 2026", title: "Tender Notice for Livelihood Infrastructure in Dhalai Division", tag: "Tender" },
  { date: "15 Apr 2026", title: "Community Livelihood Fair organized across 8 districts of Tripura", tag: "Event" },
  { date: "10 Apr 2026", title: "Revised guidelines for Value Chain Development 2026-27 issued", tag: "Notification" },
  { date: "02 Apr 2026", title: "Annual ELEMENT Progress Report 2025-26 published", tag: "Report" },
];

export const events = [
  { date: "05 May 2026", title: "Workshop on Bamboo Value Chain Development", venue: "Agartala, Tripura Administrative Training Institute" },
  { date: "12 May 2026", title: "Stakeholder Consultation on Livelihood Enhancement", venue: "Conference Hall, Project Office, Agartala" },
  { date: "20 May 2026", title: "Community Plantation & Livelihood Drive", venue: "All Districts" },
  { date: "05 Jun 2026", title: "World Environment Day — ELEMENT Showcase", venue: "Statewide" },
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
  image?: string;
};

export const projects: Project[] = [
  {
    title: "Landscape Restoration and Productive Land Management",
    description: "Restoring degraded landscapes for productive use through community-led regeneration, soil conservation and livelihood-focused land management.",
    objective: "Restore landscape productivity and enhance rural livelihoods through sustainable land management.",
    activities: ["Community-led landscape restoration", "Soil & moisture conservation works", "Livelihood-oriented species plantation", "Catchment area treatment"],
    beneficiaries: "Rural communities across 8 districts; ~25,000 households",
    status: "Ongoing",
    coverage: "Dhalai, Gomati, Khowai, North Tripura",
    component: "Component 1 — Landscape Management",
  },
  {
    title: "Biodiversity Conservation & Ecosystem Services",
    description: "Strengthening ecosystem management and biodiversity conservation to support sustainable livelihoods and eco-tourism potential.",
    objective: "Conserve biodiversity while creating economic opportunities through ecosystem services.",
    activities: ["Habitat improvement in key landscapes", "Community-based eco-monitoring", "Eco-tourism development", "Species recovery programmes"],
    beneficiaries: "Local communities; eco-development committees; researchers",
    status: "Ongoing",
    coverage: "Sipahijala, Trishna, Gumti, Rowa Landscapes",
    component: "Component 2 — Biodiversity & Ecosystem Services",
  },
  {
    title: "Community Livelihood & Value Chain Development",
    description: "Promoting sustainable livelihoods through bamboo, agar and broom-grass value chain development for rural communities.",
    objective: "Enhance household income through sustainable value chains and market access.",
    activities: ["Community capacity building", "Value chain nurseries & cluster development", "Producer collectives & market linkages", "Skill training for women SHGs"],
    beneficiaries: "12,000+ SHG members, community groups, tribal cooperatives",
    status: "Ongoing",
    coverage: "All 8 districts of Tripura",
    component: "Component 3 — Livelihood Development",
  },
  {
    title: "Eco-Tourism & Enterprise Development",
    description: "Community-managed eco-tourism at scenic landscapes to generate alternative livelihoods and enterprise opportunities.",
    objective: "Create income-generating eco-tourism enterprises that benefit local communities.",
    activities: ["Eco-tourism site development at Jampui Hills & Dumboor Lake", "Homestay programme", "Nature interpretation centres", "Community guide training"],
    beneficiaries: "Local youth, homestay operators, tourism cooperatives",
    status: "Pilot Phase",
    coverage: "Jampui Hills, Dumboor, Sipahijala",
    component: "Component 3 — Livelihood Development",
  },
  {
    title: "Climate Resilience & Watershed Management",
    description: "Climate-resilient watershed treatment and landscape restoration to protect rural livelihoods and infrastructure.",
    objective: "Build climate resilience for rural communities through adaptive landscape management.",
    activities: ["Micro-watershed treatment", "Riparian buffer restoration", "Climate vulnerability assessments", "Drought-resilient livelihood models"],
    beneficiaries: "Communities in climate-vulnerable hill terrains",
    status: "Ongoing",
    coverage: "Dhalai, Unakoti, North Tripura",
    component: "Component 1 — Landscape Management",
  },
  {
    title: "Community Plantation & Green Enterprise Programme",
    description: "Large-scale community plantation integrating high-value species for income generation and green enterprise development.",
    objective: "Increase green cover while creating sustainable economic opportunities for communities.",
    activities: ["Block plantation of income-generating species", "Bamboo corridors for value chain", "Community nursery enterprises", "Seed bank development"],
    beneficiaries: "Community groups, SHGs, schools, local bodies",
    status: "Ongoing",
    coverage: "All Districts of Tripura",
    component: "Component 2 — Biodiversity & Ecosystem Services",
  },
];

export const reports = [
  { title: "ELEMENT Annual Progress Report 2024-25", date: "15 Mar 2026", size: "4.2 MB", type: "PDF" },
  { title: "Livelihood Impact Assessment Report 2025", date: "20 Feb 2026", size: "8.6 MB", type: "PDF" },
  { title: "Value Chain Development Status Report", date: "10 Feb 2026", size: "3.1 MB", type: "PDF" },
  { title: "Community Enterprise Performance Report 2025", date: "28 Jan 2026", size: "1.8 MB", type: "PDF" },
  { title: "Landscape Restoration Progress Q3 FY 2025-26", date: "12 Jan 2026", size: "2.4 MB", type: "PDF" },
  { title: "SHG & Community Group Performance Report", date: "05 Jan 2026", size: "5.7 MB", type: "PDF" },
  { title: "Eco-Tourism Development Assessment", date: "22 Dec 2025", size: "6.3 MB", type: "PDF" },
  { title: "District-wise Implementation Guidelines 2026", date: "10 Dec 2025", size: "1.2 MB", type: "PDF" },
];

export const publications = [
  { title: "Bamboo Value Chain — Enterprise Guide", date: "Mar 2026", size: "12.5 MB", type: "PDF" },
  { title: "Community Livelihood Best Practices Manual", date: "Feb 2026", size: "4.8 MB", type: "PDF" },
  { title: "High-Value Products of Tripura", date: "Jan 2026", size: "9.1 MB", type: "PDF" },
  { title: "Eco-Tourism Development Handbook", date: "Dec 2025", size: "18.4 MB", type: "PDF" },
  { title: "Landscape Management — Technical Guide", date: "Nov 2025", size: "3.2 MB", type: "PDF" },
  { title: "Community Enterprise Development — Case Studies", date: "Oct 2025", size: "2.7 MB", type: "PDF" },
];

export const procurements = [
  { title: "Supply of Equipment for Community Livelihood Centres", date: "25 Apr 2026", deadline: "15 May 2026", status: "Open" },
  { title: "Construction of Community Training Centres — Dhalai", date: "20 Apr 2026", deadline: "10 May 2026", status: "Open" },
  { title: "Procurement of Saplings for Community Plantation", date: "15 Apr 2026", deadline: "05 May 2026", status: "Open" },
  { title: "Hiring of Vehicles for Field Operations", date: "10 Apr 2026", deadline: "30 Apr 2026", status: "Closing Soon" },
  { title: "IT Infrastructure for Project Management Unit", date: "01 Apr 2026", deadline: "20 Apr 2026", status: "Closed" },
  { title: "Printing of IEC Materials FY 2026-27", date: "25 Mar 2026", deadline: "12 Apr 2026", status: "Closed" },
];

export type Official = {
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  image: string;
  additionalRoles?: string;
  office?: string;
  mobile?: string;
  emails?: string[];
  category?: string;
};

export const governmentLeaders: Official[] = [
  { name: "Shri Manik Saha", designation: "Hon'ble Chief Minister", department: "Government of Tripura", phone: "", email: "", image: "" },
  { name: "Shri Animesh Debbarma", designation: "Forest & Environment Minister", department: "Government of Tripura", phone: "", email: "", image: "" },
  { name: "Shri J.K. Sinha, IAS", designation: "Chief Secretary", department: "Government of Tripura", phone: "", email: "", image: "" },
];

export const elementLeadership: Official[] = [
  {
    name: "Shri Chaitanya Murti, IFS",
    designation: "CEO & Project Director, ELEMENT Project",
    department: "PCCF (Administration & Personal Relations, Protection), CWLW & MS, TBB",
    additionalRoles: "PCCF (Administration & Personal Relations, Protection), CWLW & MS, TBB, NO (FCA)",
    office: "Aranya Bhawan, Pt. Nehru Complex, Agartala, Tripura (West)",
    phone: "0381-2326874",
    mobile: "9717403877",
    email: "cwlw.tfd-tr@gov.in",
    emails: ["cwlw.tfd-tr@gov.in", "chiefwildlife@gmail.com", "sputbb@gmail.com", "apccft@gmail.com"],
    image: "",
    category: "ELEMENT Project Leadership",
  },
  {
    name: "Dr. Honnareddy N, IFS",
    designation: "Addl. CEO (ELEMENT Project)",
    department: "CCF(P&D) I/C, CF (Establishment & HRD)",
    additionalRoles: "CCF(P&D) I/C, CF (Establishment & HRD)",
    office: "Aranya Bhawan, Pt. Nehru Complex, Agartala, Tripura (West)",
    phone: "",
    mobile: "99971518296",
    email: "honnareddy.n@gov.in",
    image: "",
    category: "ELEMENT Project Leadership",
  },
  {
    name: "Shri Sanjib Das, IFS",
    designation: "Director (Project ELEMENT)",
    department: "CF (Territorial & Coordination)",
    additionalRoles: "CF (Territorial & Coordination)",
    office: "Aranya Bhawan, Pt. Nehru Complex, Agartala, Tripura (West)",
    phone: "",
    mobile: "7630049150",
    email: "ccfttripura@gmail.com",
    image: "",
    category: "ELEMENT Project Leadership",
  },
  {
    name: "Shri Krishna Gopal Roy, IFS",
    designation: "Director (Community Institution, Capacity Building, Knowledge Management)",
    department: "ELEMENT Project FHQ",
    office: "ELEMENT Project FHQ, Aranya Bhawan, Agartala, Tripura (West)",
    phone: "",
    mobile: "7005447409",
    email: "krishnagopalr78@gmail.com",
    image: "",
    category: "ELEMENT Project Leadership",
  },
  {
    name: "Shri Amalendu Debnath, IFS",
    designation: "Director (Value Chain Innovation & Eco Tourism)",
    department: "ELEMENT Project FHQ",
    office: "ELEMENT Project FHQ, Aranya Bhawan, Agartala, Tripura (West)",
    phone: "",
    mobile: "8415924070",
    email: "elementtripuraforest@gmail.com",
    image: "",
    category: "ELEMENT Project Leadership",
  },
  {
    name: "Shri Jaya Krishnan V, IFS",
    designation: "Director (Administration, Procurement & Finance)",
    department: "ELEMENT Project",
    phone: "",
    email: "",
    image: "",
    category: "ELEMENT Project Leadership",
  },
  {
    name: "Shri Naresh Jamatia, IFS",
    designation: "Director (SFM)",
    department: "DCF (Wildlife)",
    additionalRoles: "DCF (Wildlife)",
    office: "Aranya Bhawan, Agartala, Tripura (West)",
    phone: "",
    mobile: "8131843631",
    email: "dcfwildlife2025@gmail.com",
    image: "",
    category: "ELEMENT Project Leadership",
  },
];

export const officials: Official[] = [...governmentLeaders, ...elementLeadership];

export const knowledgeHubItems = [
  { category: "IEC Materials", title: "ELEMENT Programme — Awareness Brochure", date: "Apr 2026" },
  { category: "Newsletters", title: "ELEMENT Quarterly Newsletter Vol. 12", date: "Mar 2026" },
  { category: "Success Stories", title: "Livelihood Transformation in Dhalai", date: "Feb 2026" },
  { category: "Thematic Studies", title: "Climate Resilience of Rural Landscapes", date: "Feb 2026" },
  { category: "Documentation", title: "SOP for Community Enterprise Development", date: "Jan 2026" },
  { category: "Case Studies", title: "Community-led Value Chain in Gomati", date: "Jan 2026" },
  { category: "Notifications", title: "New District Implementation Guidelines", date: "Dec 2025" },
  { category: "Lessons Learned", title: "Insights from Phase-I Implementation", date: "Dec 2025" },
];

export const plantations = [
  { id: 1, name: "Sipahijala Block-A Community Plantation", district: "Sepahijala", year: 2024, species: "Sal, Teak", area: 145, lat: 38, lng: 30 },
  { id: 2, name: "Trishna Livelihood Plantation", district: "South Tripura", year: 2023, species: "Hollong, Mekai", area: 220, lat: 78, lng: 32 },
  { id: 3, name: "Jampui Hill Value Chain Plantation", district: "North Tripura", year: 2025, species: "Bamboo, Gmelina", area: 310, lat: 18, lng: 75 },
  { id: 4, name: "Gumti Riverine Restoration", district: "Gomati", year: 2024, species: "Khair, Sissoo", area: 180, lat: 60, lng: 50 },
  { id: 5, name: "Rowa Wetland Edge Plantation", district: "Unakoti", year: 2025, species: "Bamboo, Bonsum", area: 95, lat: 25, lng: 65 },
  { id: 6, name: "Khowai Community Enterprise Nursery", district: "Khowai", year: 2023, species: "Mehogoni, Teak", area: 130, lat: 42, lng: 48 },
  { id: 7, name: "Agartala Urban Green Corridor", district: "West Tripura", year: 2024, species: "Krishnachura, Neem", area: 60, lat: 30, lng: 22 },
  { id: 8, name: "Dhalai Hillslope Restoration", district: "Dhalai", year: 2025, species: "Sissoo, Khair", area: 120, lat: 50, lng: 70 },
];

export const districts = ["All Districts", "West Tripura", "Sepahijala", "Khowai", "Gomati", "South Tripura", "Dhalai", "Unakoti", "North Tripura"];
export const years = ["All Years", "2025", "2024", "2023"];
