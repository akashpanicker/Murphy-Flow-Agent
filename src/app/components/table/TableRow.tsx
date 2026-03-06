import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import { ProcurementRequest } from "./types";

interface TableRowProps {
  request: ProcurementRequest;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
  onOpenDiscussion: (request: ProcurementRequest) => void;
}

export function TableRow({
  request,
  isAdmin,
  onDelete,
  onStatusChange,
  onOpenDiscussion,
}: TableRowProps) {
  return (
    <tr key={request.id} className="hover:bg-gray-50">
      <td
        className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        title={request.requesterId}
      >
        {request.requesterId}
      </td>
      <td
        className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        title={request.requestId}
      >
        {request.requestId}
      </td>
      <td
        className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        title={request.subRequestId}
      >
        {request.subRequestId}
      </td>
      <td
        className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        title={request.title}
      >
        {request.title}
      </td>
      <td
        className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        title={request.requestor}
      >
        {request.requestor}
      </td>
      <td
        className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        title={request.category}
      >
        {request.category}
      </td>
      <td className="px-4 py-3 overflow-hidden text-ellipsis whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            request.priority === "High"
              ? "bg-red-100 text-red-800"
              : request.priority === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {request.priority}
        </span>
      </td>
      <td
        className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        title={request.requestStartDate}
      >
        {request.requestStartDate}
      </td>
      <td
        className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        title={request.dueDate}
      >
        {request.dueDate}
      </td>
      <td
        className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        title={request.followUpDate}
      >
        {request.followUpDate}
      </td>
      <td
        className="px-4 py-3 text-sm text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
        title={request.triageDate}
      >
        {request.triageDate}
      </td>

      {!isAdmin && (
        <td className="px-4 py-3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
            {request.status}
          </span>
        </td>
      )}

      {isAdmin && (
        <td className="sticky right-[320px] z-10 bg-white px-4 py-3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          <select
            value={request.status}
            onChange={(e) => onStatusChange(request.id, e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Cost Review">Cost Review</option>
            <option value="Approval">Approval</option>
            <option value="Completed">Completed</option>
          </select>
        </td>
      )}

      {isAdmin && (
        <td className="sticky right-[160px] z-10 bg-white px-4 py-3 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
          <button
            onClick={() => onOpenDiscussion(request)}
            className="flex max-w-full items-center gap-2 text-gray-700 hover:text-blue-600 relative"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5" />
              {request.hasUnread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
              )}
            </div>
            <span className="text-xs text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
              {request.messageCount} {request.messageCount === 1 ? "message" : "messages"}
            </span>
          </button>
        </td>
      )}

      <td className="sticky right-[80px] z-10 bg-white px-4 py-3 text-center text-sm overflow-hidden text-ellipsis whitespace-nowrap">
        <button className="text-blue-600 hover:text-blue-800">
          <Pencil className="w-4 h-4" />
        </button>
      </td>
      <td className="sticky right-0 z-10 bg-white px-4 py-3 text-center text-sm overflow-hidden text-ellipsis whitespace-nowrap">
        <button
          onClick={() => onDelete(request.id)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
