// src/services/conversationService.ts
import {Conversation, Message, User} from "../models";
import {ConversationResponse} from "../types/conversation";
import {Op} from "sequelize";

class ConversationService {
  async getConversations(userId: string): Promise<ConversationResponse[]> {
    try {
      const conversations = await Conversation.findAll({
        where: {
          [Op.or]: [{clientId: userId}, {recipientId: userId}],
        },
        order: [["lastMessageTime", "DESC"]],
        include: [
          {model: User, as: "client"},
          {model: User, as: "recipient"},
        ],
      });

      return conversations.map((conversation) => {
        const isClient = conversation.clientId === userId;
        const recipientInfo = isClient
          ? conversation.get("recipient")
          : conversation.get("client");

        return {
          id: conversation.id,
          recipientId: isClient
            ? conversation.recipientId
            : conversation.clientId,
          recipientName: recipientInfo
            ? (recipientInfo as User).name
            : conversation.recipientName,
          lastMessageContent: conversation.lastMessageContent || "",
          lastMessageTime: conversation.lastMessageTime
            ? conversation.lastMessageTime.toISOString()
            : new Date().toISOString(),
          unreadCount: conversation.unreadCount,
        };
      });
    } catch (error) {
      console.error("Error getting conversations:", error);
      return [];
    }
  }

  async getConversation(
    id: string,
    userId: string
  ): Promise<Conversation | null> {
    try {
      const conversation = await Conversation.findOne({
        where: {
          id,
          [Op.or]: [{clientId: userId}, {recipientId: userId}],
        },
      });

      return conversation;
    } catch (error) {
      console.error("Error getting conversation:", error);
      return null;
    }
  }

  async createConversation(
    clientId: string,
    recipientId: string,
    recipientName: string
  ): Promise<Conversation | null> {
    try {
      const existingConversation = await Conversation.findOne({
        where: {
          [Op.or]: [
            {
              clientId,
              recipientId,
            },
            {
              clientId: recipientId,
              recipientId: clientId,
            },
          ],
        },
      });

      if (existingConversation) {
        return existingConversation;
      }

      const conversation = await Conversation.create({
        clientId,
        recipientId,
        recipientName,
        unreadCount: 0,
      });

      return conversation;
    } catch (error) {
      console.error("Error creating conversation:", error);
      return null;
    }
  }

  async updateLastMessage(
    conversationId: string,
    content: string,
    timestamp: Date
  ): Promise<void> {
    try {
      await Conversation.update(
        {
          lastMessageContent: content,
          lastMessageTime: timestamp,
        },
        {
          where: {id: conversationId},
        }
      );
    } catch (error) {
      console.error("Error updating last message:", error);
    }
  }

  async incrementUnreadCount(
    conversationId: string,
    recipientId: string
  ): Promise<void> {
    try {
      const conversation = await Conversation.findByPk(conversationId);

      if (conversation && conversation.recipientId === recipientId) {
        conversation.unreadCount += 1;
        await conversation.save();
      }
    } catch (error) {
      console.error("Error incrementing unread count:", error);
    }
  }

  async resetUnreadCount(
    conversationId: string,
    userId: string
  ): Promise<void> {
    try {
      const conversation = await Conversation.findByPk(conversationId);

      if (conversation && conversation.recipientId === userId) {
        conversation.unreadCount = 0;
        await conversation.save();
      }
    } catch (error) {
      console.error("Error resetting unread count:", error);
    }
  }
}

export default new ConversationService();
