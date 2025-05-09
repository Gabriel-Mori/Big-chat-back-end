// src/services/messageService.ts
import {Message, Conversation} from "../models";
import {
  SendMessageRequest,
  SendMessageResponse,
  MessageResponse,
} from "../types/message";
import conversationService from "./conversationService";
import financialService from "./financialService";
import messageQueue from "../queue/messageQueue";
import {v4 as uuidv4} from "uuid";

class MessageService {
  async sendMessage(
    userId: string,
    messageData: SendMessageRequest
  ): Promise<SendMessageResponse | null> {
    try {
      let conversation;

      // Get or create conversation
      if (messageData.conversationId) {
        conversation = await conversationService.getConversation(
          messageData.conversationId,
          userId
        );
        if (!conversation) {
          throw new Error("Conversation not found or you do not have access");
        }
      } else if (messageData.recipientId) {
        const recipient = await (
          await import("../models")
        ).User.findByPk(messageData.recipientId);
        if (!recipient) {
          throw new Error("Recipient not found");
        }

        conversation = await conversationService.createConversation(
          userId,
          messageData.recipientId,
          recipient.name
        );

        if (!conversation) {
          throw new Error("Failed to create conversation");
        }
      } else {
        throw new Error(
          "Either conversationId or recipientId must be provided"
        );
      }

      const cost = messageData.priority === "urgent" ? 2 : 1;

      const canSend = await financialService.validateTransaction(userId, cost);
      if (!canSend) {
        throw new Error("Insufficient credits or exceeded limit");
      }

      const timestamp = new Date();
      const estimatedDelivery = new Date(timestamp);

      estimatedDelivery.setSeconds(
        estimatedDelivery.getSeconds() +
          (messageData.priority === "urgent" ? 5 : 30)
      );

      const messageId = uuidv4();
      const message = await Message.create({
        id: messageId,
        conversationId: conversation.id,
        content: messageData.content,
        senderId: userId,
        senderType: "client",
        timestamp,
        priority: messageData.priority,
        status: "queued",
        cost,
        estimatedDelivery,
      });

      await conversationService.updateLastMessage(
        conversation.id,
        messageData.content,
        timestamp
      );

      await messageQueue.sendMessage(
        {
          id: message.id,
          conversationId: conversation.id,
          recipientId:
            conversation.recipientId === userId
              ? conversation.clientId
              : conversation.recipientId,
          senderId: userId,
          content: messageData.content,
          priority: messageData.priority,
        },
        messageData.priority
      );

      const currentBalance = await financialService.deductCredits(userId, cost);

      const response: SendMessageResponse = {
        id: message.id,
        status: "queued",
        timestamp: timestamp.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
        cost,
      };

      if (currentBalance !== null) {
        response.currentBalance = currentBalance;
      }

      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }

  async getMessages(
    conversationId: string,
    userId: string
  ): Promise<MessageResponse[]> {
    try {
      const conversation = await conversationService.getConversation(
        conversationId,
        userId
      );
      if (!conversation) {
        throw new Error("Conversation not found or you do not have access");
      }

      const messages = await Message.findAll({
        where: {conversationId},
        order: [["timestamp", "ASC"]],
      });

      await conversationService.resetUnreadCount(conversationId, userId);

      return messages.map((message) => ({
        id: message.id,
        conversationId: message.conversationId,
        content: message.content,
        sentBy: {
          id: message.senderId,
          type: message.senderType,
        },
        timestamp: message.timestamp.toISOString(),
        priority: message.priority,
        status: message.status,
        cost: message.cost,
      }));
    } catch (error) {
      console.error("Error getting messages:", error);
      return [];
    }
  }

  async updateMessageStatus(
    messageId: string,
    status: Message["status"]
  ): Promise<boolean> {
    try {
      const message = await Message.findByPk(messageId);
      if (!message) {
        return false;
      }

      message.status = status;
      await message.save();

      return true;
    } catch (error) {
      console.error("Error updating message status:", error);
      return false;
    }
  }

  async processQueuedMessages(): Promise<void> {
    try {
      // Process urgent messages first
      await messageQueue.consumeMessages(async (messageData) => {
        console.log("Processing urgent message:", messageData.id);

        // Update message status to processing
        await this.updateMessageStatus(messageData.id, "processing");

        // Simulate message processing time (would be replaced with actual delivery logic)
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Update message status to sent
        await this.updateMessageStatus(messageData.id, "sent");

        // Increment unread count for recipient
        const conversation = await Conversation.findByPk(
          messageData.conversationId
        );
        if (conversation) {
          await conversationService.incrementUnreadCount(
            conversation.id,
            messageData.recipientId
          );
        }

        console.log("Urgent message processed:", messageData.id);
      }, "urgent");

      // Then process normal messages
      await messageQueue.consumeMessages(async (messageData) => {
        console.log("Processing normal message:", messageData.id);

        // Update message status to processing
        await this.updateMessageStatus(messageData.id, "processing");

        // Simulate message processing time (would be replaced with actual delivery logic)
        await new Promise((resolve) => setTimeout(resolve, 30000));

        // Update message status to sent
        await this.updateMessageStatus(messageData.id, "sent");

        // Increment unread count for recipient
        const conversation = await Conversation.findByPk(
          messageData.conversationId
        );
        if (conversation) {
          await conversationService.incrementUnreadCount(
            conversation.id,
            messageData.recipientId
          );
        }

        console.log("Normal message processed:", messageData.id);
      }, "normal");
    } catch (error) {
      console.error("Error processing queued messages:", error);
    }
  }
}

export default new MessageService();
