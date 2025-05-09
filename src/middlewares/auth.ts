import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {JwtPayload} from "../types/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any | undefined> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return Promise.resolve(
      res.status(401).json({message: "Authentication token required"})
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
    return Promise.resolve();
  } catch (error) {
    return Promise.resolve(
      res.status(403).json({message: "Invalid or expired token"})
    );
  }
};
