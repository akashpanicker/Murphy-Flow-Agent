import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanColumn } from "./KanbanColumn";
import { ProcurementRequest } from "../table/types";

export const KANBAN_STAGES = [
  "New",
  "Under Review",
  "Cost Review",
  "Approval",
  "Completed",
];

interface KanbanBoardProps {
  requests: ProcurementRequest[];
  onStatusChange: (id: string, newStatus: string) => void;
  onDelete?: (id: string) => void;
  onOpenDiscussion?: (request: ProcurementRequest) => void;
}

export function KanbanBoard({ requests, onStatusChange, onDelete, onOpenDiscussion }: KanbanBoardProps) {
  const requestsByStage = KANBAN_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = requests.filter((r) => r.status === stage);
      return acc;
    },
    {} as Record<string, ProcurementRequest[]>,
  );

  const handleDrop = (requestId: string, newStage: string) => {
    onStatusChange(requestId, newStage);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="px-6 pb-6">
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-2">
            {KANBAN_STAGES.map((stage) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                requests={requestsByStage[stage]}
                onDrop={handleDrop}
                onDelete={onDelete}
                onOpenDiscussion={onOpenDiscussion}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
