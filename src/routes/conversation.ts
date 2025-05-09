import {Router} from "express";
import conversationController from "../controllers/conversationController";
import {authenticateToken} from "../middlewares/auth";

const router = Router();

router.get("/conversations", authenticateToken, async (req, res, next) => {
  try {
    const result = await conversationController.getConversations(
      req,
      res,
      next
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/conversations/:id", authenticateToken, async (req, res, next) => {
  try {
    const result = await conversationController.getConversation(req, res, next);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
