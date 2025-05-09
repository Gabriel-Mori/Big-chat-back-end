import {Request, Response, NextFunction} from "express";
import conversationService from "../services/conversationService";

class ConversationController {
  async getConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({message: "User not authenticated"});
      }

      const conversations = await conversationService.getConversations(
        req.user.id
      );
      return res.status(200).json(conversations);
    } catch (error) {
      next();
      console.error("Get conversations error:", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }

  async getConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({message: "User not authenticated"});
      }

      const conversationId = req.params.id;
      const conversation = await conversationService.getConversation(
        conversationId,
        req.user.id
      );

      if (!conversation) {
        return res.status(404).json({message: "Conversation not found"});
      }

      return res.status(200).json(conversation);
    } catch (error) {
      console.error("Get conversation error:", error);
      next();
      return res.status(500).json({message: "Internal server error"});
    }
  }
}

export default new ConversationController();
