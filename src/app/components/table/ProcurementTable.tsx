import { Plus } from "lucide-react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { TableRow } from "./TableRow";
import { ProcurementRequest } from "./types";

interface ProcurementTableProps {
  requests: ProcurementRequest[];
  isAdmin: boolean;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onOpenDiscussion: (request: ProcurementRequest) => void;
}

export function ProcurementTable({
  requests,
  isAdmin,
  onCreateNew,
  onDelete,
  onStatusChange,
  onOpenDiscussion,
}: ProcurementTableProps) {
  return (
    <section className="px-6 pb-6">
      <Card className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm gap-0">
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Procurement Requests</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={onCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              New Request
            </Button>
          </div>
        </div>
        {requests.length === 0 ? (
          <div className="p-12 flex items-center justify-center">
            <p className="text-gray-400">No recent activity.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className={`w-full ${isAdmin ? "min-w-[1950px]" : "min-w-[1760px]"} table-fixed`}>
              <colgroup>
                <col className="w-[110px]" />
                <col className="w-[110px]" />
                <col className="w-[140px]" />
                <col className="w-[260px]" />
                <col className="w-[180px]" />
                <col className="w-[140px]" />
                <col className="w-[100px]" />
                <col className="w-[130px]" />
                <col className="w-[130px]" />
                <col className="w-[150px]" />
                <col className="w-[130px]" />
                {!isAdmin && <col className="w-[130px]" />}
                {isAdmin && <col className="w-[130px]" />}
                {isAdmin && <col className="w-[160px]" />}
                <col className="w-[80px]" />
                <col className="w-[80px]" />
              </colgroup>
              <thead className="bg-gray-50 border-b border-[#E5E7EB]">
                <tr className="[&>th]:border-r [&>th]:border-[#E5E7EB] [&>th:last-child]:border-r-0">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Requester ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Request ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Sub Request ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Requestor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Start Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Follow-up Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Triage Date
                  </th>
                  {!isAdmin && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Status
                    </th>
                  )}
                  {isAdmin && (
                    <th className="sticky right-[320px] z-20 bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Stage
                    </th>
                  )}
                  {isAdmin && (
                    <th className="sticky right-[160px] z-20 bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Discussion
                    </th>
                  )}
                  <th className="sticky right-[80px] z-20 bg-gray-50 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Edit
                  </th>
                  <th className="sticky right-0 z-20 bg-gray-50 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <TableRow
                    key={request.id}
                    request={request}
                    isAdmin={isAdmin}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    onOpenDiscussion={onOpenDiscussion}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
}
