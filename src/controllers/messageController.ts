import {Request, Response, NextFunction} from "express";
import * as yup from "yup";
import messageService from "../services/messageService";

class MessageController {
  async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({message: "User not authenticated"});
      }

      const schema = yup.object().shape({
        conversationId: yup
          .string()
          .when("recipientId", (recipientId: any, schema: yup.StringSchema) => {
            return recipientId
              ? schema.nullable()
              : schema.required(
                  "Either conversationId or recipientId is required"
                );
          }),
        recipientId: yup
          .string()
          .when(
            "conversationId",
            (conversationId: any, schema: yup.StringSchema) => {
              return conversationId
                ? schema.nullable()
                : schema.required(
                    "Either conversationId or recipientId is required"
                  );
            }
          ),
        content: yup.string().required("Content is required"),
        priority: yup
          .string()
          .oneOf(["normal", "urgent"], "Priority must be normal or urgent")
          .default("normal"),
      });

      await schema.validate(req.body);

      const response = await messageService.sendMessage(req.user.id, {
        conversationId: req.body.conversationId,
        recipientId: req.body.recipientId,
        content: req.body.content,
        priority: req.body.priority,
      });

      if (!response) {
        return res.status(400).json({message: "Failed to send message"});
      }

      return res.status(201).json(response);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(400).json({message: error.message});
      }

      if (error instanceof Error) {
        return res.status(400).json({message: error.message});
      }

      console.error("Send message error:", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }

  async getMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({message: "User not authenticated"});
      }

      const conversationId = req.params.conversationId;

      if (!conversationId) {
        return res.status(400).json({message: "Conversation ID is required"});
      }

      const messages = await messageService.getMessages(
        conversationId,
        req.user.id
      );
      return res.status(200).json(messages);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({message: error.message});
      }

      console.error("Get messages error:", error);
      return res.status(500).json({message: "Internal server error"});
    }
  }
}

export default new MessageController();
