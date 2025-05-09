import {Router} from "express";

import messageController from "../controllers/messageController";
import {authenticateToken} from "../middlewares/auth";

const router = Router();

router.post("/message", authenticateToken, async (req, res, next) => {
  try {
    const result = await messageController.sendMessage(req, res, next);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/conversations/:conversationId/messages",
  authenticateToken,
  async (req, res, next) => {
    try {
      const result = await messageController.getMessages(req, res, next);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
