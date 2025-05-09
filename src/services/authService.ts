import jwt from "jsonwebtoken";
import {User, Plan} from "../models";
import {AuthRequest, AuthResponse, JwtPayload} from "../types/auth";

class AuthService {
  async register(authData: AuthRequest): Promise<AuthResponse | null> {
    try {
      const user = await User.create({
        documentId: authData.documentId,
        documentType: authData.documentType,
        name: authData.name,
        active: true,
      });

      const response: AuthResponse = {
        client: {
          id: user.id,
          name: user.name,
          documentId: user.documentId,
          documentType: user.documentType,
          active: user.active,
        },
      };

      return response;
    } catch (error) {
      console.error("Registration error:", error);
      return null;
    }
  }

  async authenticate(authData: AuthRequest): Promise<AuthResponse | null> {
    try {
      const user = await User.findOne({
        where: {
          documentId: authData.documentId,
          documentType: authData.documentType,
          active: true,
        },
        include: [{model: Plan, as: "plan"}],
      });

      if (!user) {
        return null;
      }

      const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key";

      const payload: JwtPayload = {
        id: user.id,
        documentId: user.documentId,
        documentType: user.documentType,
      };

      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: "7d",
      });

      const plan = user.get("plan") as Plan;

      const response: AuthResponse = {
        token,
        client: {
          id: user.id,
          name: user.name,
          documentId: user.documentId,
          documentType: user.documentType,
          planType: plan?.planType || "prepaid",
          active: user.active,
        },
      };

      if (plan) {
        if (plan.planType === "prepaid") {
          response.client.balance = plan.credits;
        } else {
          response.client.limit = plan.limit;
        }
      }

      return response;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }
}

export default new AuthService();
