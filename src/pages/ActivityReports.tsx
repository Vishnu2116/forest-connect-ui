import { Link } from "react-router-dom";
import PageLayout, { PageHeader } from "@/components/layout/PageLayout";
import { ArrowLeft } from "lucide-react";

export default function ActivityReports() {
  return (
    <PageLayout>
      <PageHeader
        title="Activity Reports"
        breadcrumb={["Home", "Activities & Outputs", "Reports"]}
      />

      <section className="py-10">
        <div className="gov-container max-w-6xl">
          <Link
            to="/activities"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Activities
          </Link>

          <div className="space-y-10">
            {/* Table 1 */}
            <div className="overflow-x-auto print:break-inside-avoid print:page-break-inside-avoid">
              <table className="w-full border-collapse text-sm md:text-[15px] text-black bg-white print:break-inside-avoid print:page-break-inside-avoid">
                <thead>
                  <tr>
                    <th
                      colSpan={4}
                      className="border border-black bg-[#006b5f] text-white font-bold text-center py-2 text-base"
                    >
                      Result Framework
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-black font-bold text-center px-3 py-2 w-[55%]">
                      Indicator Name
                    </th>
                    <th className="border border-black font-bold text-center px-3 py-2 w-[9%]"></th>
                    <th className="border border-black font-bold text-center px-3 py-2 w-[16%]">
                      Baseline <br />
                      November <br />
                      2023
                    </th>
                    <th className="border border-black font-bold text-center px-3 py-2 w-[20%]">
                      End Target <br />
                      January 2029
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-black font-bold px-3 py-2"
                    >
                      To improve landscape management and increase benefits for
                      targeted forest dependent communities in Tripura
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Land area under sustainable landscape management practices
                      (CRI, Hectare(Ha))
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      41,700.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      People with increased benefits from landscape-based value
                      chains (disaggregated by gender (Number)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      75,000.00 <br />
                      women 50%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table 2 */}
            <div className="overflow-x-auto print:break-inside-avoid print:page-break-inside-avoid">
              <table className="w-full border-collapse text-sm md:text-[15px] text-black bg-white print:break-inside-avoid print:page-break-inside-avoid">
                <thead>
                  <tr>
                    <th
                      colSpan={4}
                      className="border border-black bg-[#006b5f] text-white font-bold text-center py-2 text-base"
                    >
                      Result Framework
                    </th>
                  </tr>
                  <tr>
                    <th className="border border-black font-bold text-center px-3 py-2 w-[58%]">
                      Indicator Name
                    </th>
                    <th className="border border-black font-bold text-center px-3 py-2 w-[9%]"></th>
                    <th className="border border-black font-bold text-center px-3 py-2 w-[16%]">
                      Baseline <br />
                      November <br />
                      2023
                    </th>
                    <th className="border border-black font-bold text-center px-3 py-2 w-[17%]">
                      End Target <br />
                      January 2029
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-black font-bold px-3 py-2"
                    >
                      1. Strengthening Capacities for Integrated Landscape
                      Management
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Decision support system operational (Number)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      No
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      1
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Community groups reached with extension and knowledge
                      products (Number)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      500.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Conservation and value chain research/knowledge
                      (innovation/analytical) products developed and
                      disseminated (Number)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      10.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Women's representation in Executive Committees of JFMCs
                      and EDCs (Percentage)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      33.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Share of target beneficiaries with rating ‘Satisfactory’
                      or above on satisfaction with project interventions
                      (Percentage)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      80.00
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan={4}
                      className="border border-black font-bold px-3 py-2"
                    >
                      2. Restoring Landscapes for Improved Ecosystem Services
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Landscape Management Plans adopted (Number)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      500.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Land area under restoration -disaggregated by type
                      (Hectare(Ha))
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      41,750.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Degraded agricultural land (Hectare(Ha))
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      8700.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Degraded forest lands (Hectare(Ha))
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      33,000.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Degraded wetlands (Hectare(Ha))
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      50.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Areas brought under enhanced biodiversity conservation –
                      disaggregated by protected area/Community Conservation
                      Areas (Hectare(Ha))
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      3,821
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan={4}
                      className="border border-black font-bold px-3 py-2"
                    >
                      3. Enhancing Landscape based Value Chains for Economic
                      Transformation
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Community groups integrated into sustainable HVFP value
                      chains (Number)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      250.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Forest-based enterprises incubated (disaggregated by
                      women-led enterprises) (Number)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      100.00 <br />
                      (25%)
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Producers of HVFPs with improved market access (Number)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      12,500.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Enterprises in processing and marketing of HVFPs with
                      improved access to finance (disaggregated by gender)
                      (Number)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      ..
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Nature-based tourism policy documents prepared and
                      submitted for approval (Number)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      1.00
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-black px-3 py-2">
                      Beneficiaries of job focused interventions (number)
                      disaggregated by gender)
                    </td>
                    <td className="border border-black px-3 py-2"></td>
                    <td className="border border-black text-center px-3 py-2">
                      0.00
                    </td>
                    <td className="border border-black text-center px-3 py-2">
                      37,500 <br />
                      33% women
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
