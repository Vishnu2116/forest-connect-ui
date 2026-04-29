import CrudModule from "./CrudModule";

export const UsersAdmin = () => (
  <CrudModule
    title="User Management"
    subtitle="Manage admin and content users."
    fields={[
      { key: "name", label: "Full Name", required: true },
      { key: "email", label: "Email", required: true },
      { key: "role", label: "Role", type: "select", options: ["Super Admin","Admin","Content Manager","District Officer"] },
      { key: "district", label: "District", type: "select", options: ["—","West Tripura","Sepahijala","Khowai","Gomati","South Tripura","Dhalai","Unakoti","North Tripura"] },
      { key: "status", label: "Status", type: "select", options: ["Active","Inactive","Suspended"] },
    ]}
    columns={["name","email","role","district","status"]}
    initial={[
      { name: "Anjali Debbarma", email: "anjali@element.tripura.gov.in", role: "Super Admin", district: "—", status: "Active" },
      { name: "Rakesh Sharma", email: "rakesh@element.tripura.gov.in", role: "Admin", district: "West Tripura", status: "Active" },
      { name: "Priya Reang", email: "priya@element.tripura.gov.in", role: "Content Manager", district: "—", status: "Active" },
      { name: "S. Tripura", email: "s.tripura@element.tripura.gov.in", role: "District Officer", district: "Dhalai", status: "Inactive" },
    ]}
  />
);
