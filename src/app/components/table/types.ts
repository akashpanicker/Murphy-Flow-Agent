export interface Message {
  id: string;
  userName: string;
  userRole: string;
  avatar: string;
  timestamp: string;
  content: string;
  mentions?: string[];
  lineItemTag?: string;
}

export interface ProcurementRequest {
  id: string;
  requesterId: string;
  requestId: string;
  subRequestId: string;
  title: string;
  requestor: string;
  category: string;
  priority: string;
  status: string;
  requestStartDate: string;
  dueDate: string;
  followUpDate: string;
  triageDate: string;
  messageCount: number;
  hasUnread: boolean;
  messages: Message[];
}
