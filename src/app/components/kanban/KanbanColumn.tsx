import { useDrop } from "react-dnd";
import { DRAG_TYPE } from "./RequestCard";
import { RequestCard } from "./RequestCard";
import { ProcurementRequest } from "../table/types";

interface KanbanColumnProps {
  stage: string;
  requests: ProcurementRequest[];
  onDrop: (requestId: string, newStage: string) => void;
  onDelete?: (id: string) => void;
  onOpenDiscussion?: (request: ProcurementRequest) => void;
}

const columnStyle = {
  header: "text-gray-700",
  bg: "bg-gray-100/60",
  border: "border-gray-200",
  dot: "bg-gray-400",
};

export function KanbanColumn({ stage, requests, onDrop, onDelete, onOpenDiscussion }: KanbanColumnProps) {
  const colors = columnStyle;

  const [{ isOver, canDrop }, dropRef] = useDrop<
    { id: string; currentStage: string },
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: DRAG_TYPE,
    drop: (item) => {
      onDrop(item.id, stage);
    },
    canDrop: (item) => {
      return item.currentStage !== stage;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      className={`
        flex flex-col rounded-xl border min-w-[280px] w-[280px]
        transition-all duration-200
        ${colors.bg} ${colors.border}
        ${isOver && canDrop ? "ring-2 ring-blue-400 ring-offset-2 border-blue-300 scale-[1.01]" : ""}
        ${canDrop && !isOver ? "border-dashed" : ""}
      `}
    >
      {/* Column header */}
      <div className="px-4 py-3 border-b border-inherit flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
          <h3 className={`text-[13px] font-semibold ${colors.header}`}>{stage}</h3>
        </div>
        <span className="text-[12px] font-medium text-gray-400 bg-white/80 rounded-full px-2 py-0.5 border border-gray-200">
          {requests.length}
        </span>
      </div>

      {/* Cards area */}
      <div className="p-3 flex flex-col gap-3 min-h-[120px] overflow-y-auto max-h-[calc(100vh-320px)]">
        {requests.length === 0 ? (
          <div
            className={`
              flex items-center justify-center py-8 rounded-lg border-2 border-dashed
              ${isOver && canDrop ? "border-blue-300 bg-blue-50/80" : "border-gray-200 bg-white/40"}
              transition-colors duration-200
            `}
          >
            <p className="text-[12px] text-gray-400 italic">
              {isOver && canDrop ? "Drop here" : "No requests"}
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <RequestCard key={request.id} request={request} onDelete={onDelete} onOpenDiscussion={onOpenDiscussion} />
          ))
        )}

        {/* Drop indicator when hovering over non-empty column */}
        {requests.length > 0 && isOver && canDrop && (
          <div className="flex items-center justify-center py-3 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/80 transition-colors duration-200">
            <p className="text-[12px] text-blue-400 font-medium">Drop here</p>
          </div>
        )}
      </div>
    </div>
  );
}
