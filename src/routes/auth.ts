import {Router} from "express";
import authController from "../controllers/authController";

const router = Router();

router.post("/auth/login", async (req, res, next) => {
  try {
    const result = await authController.login(req, res, next);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/auth/register", async (req, res, next) => {
  try {
    const result = await authController.register(req, res, next);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
