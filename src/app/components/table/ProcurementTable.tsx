import { Columns3, Plus, Table2 } from "lucide-react";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { TableRow } from "./TableRow";
import { ProcurementRequest } from "./types";

export type ViewMode = "table" | "kanban";

interface ProcurementTableProps {
  requests: ProcurementRequest[];
  isAdmin: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onCreateNew: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onOpenDiscussion: (request: ProcurementRequest) => void;
}

export function ProcurementTable({
  requests,
  isAdmin,
  viewMode = "table",
  onViewModeChange,
  onCreateNew,
  onDelete,
  onStatusChange,
  onOpenDiscussion,
}: ProcurementTableProps) {
  const isKanbanView = isAdmin && viewMode === "kanban";

  return (
    <section className="px-6 pb-6">
      <Card className="bg-white rounded-lg border border-[#E5E7EB] shadow-sm gap-0">
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Procurement Requests</h2>
          <div className="flex items-center gap-3">
            {/* Table / Kanban toggle — admin only */}
            {isAdmin && onViewModeChange && (
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => onViewModeChange("table")}
                  className={`
                    flex h-9 items-center gap-1.5 px-3 rounded-md text-xs font-medium
                    transition-all duration-200
                    ${viewMode === "table"
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  Table
                </button>
                <button
                  onClick={() => onViewModeChange("kanban")}
                  className={`
                    flex h-9 items-center gap-1.5 px-3 rounded-md text-xs font-medium
                    transition-all duration-200
                    ${viewMode === "kanban"
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                    }
                  `}
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  Kanban
                </button>
              </div>
            )}
            <Button
              onClick={onCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              New Request
            </Button>
          </div>
        </div>

        {/* Hide table body when kanban is active */}
        {!isKanbanView && (
          <>
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
          </>
        )}
      </Card>
    </section>
  );
}
