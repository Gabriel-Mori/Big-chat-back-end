export interface SendMessageRequest {
  conversationId: string;
  recipientId?: string;
  content: string;
  priority: "normal" | "urgent";
}

export interface SendMessageResponse {
  id: string;
  status: "queued";
  timestamp: string;
  estimatedDelivery: string;
  cost: number;
  currentBalance?: number;
}

export interface MessageResponse {
  id: string;
  conversationId: string;
  content: string;
  sentBy: {
    id: string;
    type: "client" | "user";
  };
  timestamp: string;
  priority: "normal" | "urgent";
  status: "queued" | "processing" | "sent" | "delivered" | "read" | "failed";
  cost: number;
}
