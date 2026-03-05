import { useState } from "react";
import { useNavigate } from "react-router";
import { DiscussionPanel } from "../components/DiscussionPanel";
import { StatsCards } from "../components/dashboard/StatsCards";
import { AppLayout } from "../components/layout/AppLayout";
import { ProcurementTable } from "../components/table/ProcurementTable";
import { ProcurementRequest } from "../components/table/types";

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState<ProcurementRequest | null>(null);
  
  const [requests, setRequests] = useState<ProcurementRequest[]>([
    {
      id: '1',
      requesterId: 'REQ-001',
      requestId: 'PR-1024',
      subRequestId: 'PR-1024-A',
      title: 'Dummy Request',
      requestor: 'John Smith',
      category: 'Category 1',
      priority: 'High',
      status: 'Stage 1',
      requestStartDate: '08/01/2026',
      dueDate: '08/14/2026',
      followUpDate: '08/10/2026',
      triageDate: '08/02/2026',
      messageCount: 3,
      hasUnread: true,
      messages: [
        {
          id: 'm1',
          userName: 'Maria',
          userRole: 'Cost Controller',
          avatar: 'MA',
          timestamp: '2 hours ago',
          content: 'Can you confirm the cost for the docking stations?',
          lineItemTag: 'Item #2 – 27 inch Monitor',
        },
        {
          id: 'm2',
          userName: 'Cres',
          userRole: 'Procurement Manager',
          avatar: 'CR',
          timestamp: '1 hour ago',
          content: '@Payton please review the priority level.',
          mentions: ['Payton'],
        },
        {
          id: 'm3',
          userName: 'Payton',
          userRole: 'Approver',
          avatar: 'PA',
          timestamp: '30 min ago',
          content: 'Priority looks good to me. Approving for Stage 2.',
        },
      ],
    },
  ]);

  const handleDelete = (id: string) => {
    setRequests(requests.filter(req => req.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const handleOpenDiscussion = (request: ProcurementRequest) => {
    setSelectedRequest(request);
    // Mark as read
    setRequests(requests.map(req => 
      req.id === request.id ? { ...req, hasUnread: false } : req
    ));
  };

  const handleCloseDiscussion = () => {
    setSelectedRequest(null);
  };

  const handleSendMessage = (message: string) => {
    if (!selectedRequest) return;
    
    const newMessage = {
      id: `m${Date.now()}`,
      userName: 'You',
      userRole: 'Dev Admin',
      avatar: 'DA',
      timestamp: 'Just now',
      content: message,
    };

    setRequests(requests.map(req => {
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
    }));
  };

  return (
    <>
      <AppLayout>
        <StatsCards />
        <ProcurementTable
          requests={requests}
          onCreateNew={() => navigate("/new-request")}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onOpenDiscussion={handleOpenDiscussion}
        />
      </AppLayout>

      {selectedRequest && (
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
