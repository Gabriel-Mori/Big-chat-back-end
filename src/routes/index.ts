// src/routes/index.ts
import {Router} from "express";
import authRoutes from "./auth";
import conversationRoutes from "./conversation";
import messageRoutes from "./message";

const router = Router();

router.use(authRoutes);
router.use(conversationRoutes);
router.use(messageRoutes);

export default router;
