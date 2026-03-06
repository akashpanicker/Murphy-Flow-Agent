import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { DiscussionPanel } from "../components/DiscussionPanel";
import { StatsCards } from "../components/dashboard/StatsCards";
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { AppLayout } from "../components/layout/AppLayout";
import { ProcurementTable, ViewMode } from "../components/table/ProcurementTable";
import { ProcurementRequest } from "../components/table/types";
import { getStoredUserRole, getUserRoleLabel } from "../lib/userRole";

const CURRENT_USER_NAME = "John Smith";

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getStoredUserRole();
  const isAdmin = role === "admin";
  const [selectedRequest, setSelectedRequest] = useState<ProcurementRequest | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const [requests, setRequests] = useState<ProcurementRequest[]>([
    {
      id: "1",
      requesterId: "REQ-001",
      requestId: "PR-1024",
      subRequestId: "PR-1024-A",
      title: "Dummy Request",
      requestor: "John Smith",
      category: "Category 1",
      priority: "High",
      status: "New",
      requestStartDate: "08/01/2026",
      dueDate: "08/14/2026",
      followUpDate: "08/10/2026",
      triageDate: "08/02/2026",
      messageCount: 3,
      hasUnread: true,
      messages: [
        {
          id: "m1",
          userName: "Maria",
          userRole: "Cost Controller",
          avatar: "MA",
          timestamp: "2 hours ago",
          content: "Can you confirm the cost for the docking stations?",
          lineItemTag: "Item #2 – 27 inch Monitor",
        },
        {
          id: "m2",
          userName: "Cres",
          userRole: "Procurement Manager",
          avatar: "CR",
          timestamp: "1 hour ago",
          content: "@Payton please review the priority level.",
          mentions: ["Payton"],
        },
        {
          id: "m3",
          userName: "Payton",
          userRole: "Approver",
          avatar: "PA",
          timestamp: "30 min ago",
          content: "Priority looks good to me. Approving for Stage 2.",
        },
      ],
    },
    {
      id: "2",
      requesterId: "REQ-002",
      requestId: "PR-1050",
      subRequestId: "PR-1050-A",
      title: "Office Printer Upgrade",
      requestor: "Alicia Brown",
      category: "IT Equipment",
      priority: "Medium",
      status: "Under Review",
      requestStartDate: "08/03/2026",
      dueDate: "08/18/2026",
      followUpDate: "08/11/2026",
      triageDate: "08/04/2026",
      messageCount: 1,
      hasUnread: false,
      messages: [
        {
          id: "m4",
          userName: "Alicia",
          userRole: "Requester",
          avatar: "AB",
          timestamp: "1 day ago",
          content: "Sharing vendor quote for review.",
        },
      ],
    },
  ]);

  const visibleRequests = useMemo(() => {
    if (isAdmin) {
      return requests;
    }

    return requests.filter((req) => req.requestor === CURRENT_USER_NAME);
  }, [isAdmin, requests]);

  const handleDelete = (id: string) => {
    setRequests(requests.filter((req) => req.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, status: newStatus } : req)));
  };

  const handleOpenDiscussion = (request: ProcurementRequest) => {
    if (!isAdmin) {
      return;
    }

    setSelectedRequest(request);
    setRequests(requests.map((req) => (req.id === request.id ? { ...req, hasUnread: false } : req)));
  };

  const handleCloseDiscussion = () => {
    setSelectedRequest(null);
  };

  const handleSendMessage = (message: string) => {
    if (!selectedRequest || !isAdmin) {
      return;
    }

    const newMessage = {
      id: `m${Date.now()}`,
      userName: "You",
      userRole: getUserRoleLabel(role),
      avatar: "DA",
      timestamp: "Just now",
      content: message,
    };

    setRequests(
      requests.map((req) => {
        if (req.id === selectedRequest.id) {
          const updatedMessages = [...req.messages, newMessage];
          const updatedRequest = {
            ...req,
            messages: updatedMessages,
            messageCount: updatedMessages.length,
          };
          setSelectedRequest(updatedRequest);
          return updatedRequest;
        }
        return req;
      }),
    );
  };

  return (
    <>
      <AppLayout>
        {isAdmin ? (<StatsCards />) : (<section className="px-6 pt-6"><h1 className="mb-6 text-2xl font-semibold text-gray-900">Welcome back,</h1></section>)}
        <ProcurementTable
          requests={visibleRequests}
          isAdmin={isAdmin}
          viewMode={viewMode}
          onViewModeChange={isAdmin ? setViewMode : undefined}
          onCreateNew={() =>
            navigate("/new-request", { state: { fromPath: location.pathname } })
          }
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onOpenDiscussion={handleOpenDiscussion}
        />

        {/* Kanban Board — rendered outside the table card, admin only */}
        {isAdmin && viewMode === "kanban" && (
          <KanbanBoard
            requests={visibleRequests}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onOpenDiscussion={handleOpenDiscussion}
          />
        )}
      </AppLayout>

      {isAdmin && selectedRequest && (
        <DiscussionPanel
          requestId={selectedRequest.requestId}
          requestTitle={selectedRequest.title}
          status={selectedRequest.status}
          messages={selectedRequest.messages}
          onClose={handleCloseDiscussion}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
}


