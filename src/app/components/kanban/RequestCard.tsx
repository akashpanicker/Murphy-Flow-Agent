import { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { MoreVertical, Pencil, MessageCircle, Trash2 } from "lucide-react";
import { ProcurementRequest } from "../table/types";

interface RequestCardProps {
  request: ProcurementRequest;
  onDelete?: (id: string) => void;
  onOpenDiscussion?: (request: ProcurementRequest) => void;
}

export const DRAG_TYPE = "KANBAN_CARD";

export function RequestCard({ request, onDelete, onOpenDiscussion }: RequestCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: DRAG_TYPE,
    item: { id: request.id, currentStage: request.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const priorityStyles: Record<string, string> = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    Low: "bg-green-100 text-green-700 border-green-200",
  };

  const priorityDot: Record<string, string> = {
    High: "bg-red-500",
    Medium: "bg-amber-500",
    Low: "bg-green-500",
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    // Edit action — placeholder for now
  };

  const handleViewDiscussion = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onOpenDiscussion?.(request);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete?.(request.id);
  };

  return (
    <div
      ref={dragRef as unknown as React.Ref<HTMLDivElement>}
      className={`
        group relative bg-white rounded-lg border border-gray-200 p-4
        shadow-sm hover:shadow-md hover:border-blue-200
        transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-40 scale-95 rotate-1" : "opacity-100"}
      `}
    >
      {/* 3-dot menu button */}
      <div className="absolute top-2.5 right-2.5">
        <button
          onClick={handleMenuToggle}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <>
            {/* Invisible backdrop to close menu on outside click */}
            <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
            <div
              ref={menuRef}
              className="absolute right-0 top-full mt-1 z-40 w-44 bg-white rounded-lg border border-gray-200 shadow-lg py-1 animate-in fade-in slide-in-from-top-1 duration-150"
            >
              <button
                onClick={handleEdit}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-gray-400" />
                Edit
              </button>
              <button
                onClick={handleViewDiscussion}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                View Discussion
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Request ID */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[12px] font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {request.requestId}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-gray-900 mb-2 leading-snug line-clamp-2">
        {request.title}
      </h4>

      {/* Requestor */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-semibold text-gray-600">
          {request.requestor
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <span className="text-[12px] text-gray-500">{request.requestor}</span>
      </div>

      {/* Priority badge + Due date */}
      <div className="flex items-center justify-between">
        <span
          className={`
            inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] font-medium rounded-full border
            ${priorityStyles[request.priority] || "bg-gray-100 text-gray-600 border-gray-200"}
          `}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${priorityDot[request.priority] || "bg-gray-400"}`}
          />
          {request.priority}
        </span>

        {/* Due date */}
        <span className="text-[12px] text-gray-400">Due {request.dueDate}</span>
      </div>
    </div>
  );
}
