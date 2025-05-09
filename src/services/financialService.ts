// src/services/financialService.ts
import {Plan} from "../models";

class FinancialService {
  async validateTransaction(userId: string, cost: number): Promise<boolean> {
    try {
      const plan = await Plan.findOne({
        where: {userId},
      });

      if (!plan) {
        return false;
      }

      if (plan.planType === "prepaid") {
        return plan.credits >= cost;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error validating transaction:", error);
      return false;
    }
  }

  async deductCredits(userId: string, cost: number): Promise<number | null> {
    try {
      const plan = await Plan.findOne({
        where: {userId},
      });

      if (!plan) {
        return null;
      }

      if (plan.planType === "prepaid") {
        plan.credits -= cost;
        await plan.save();
        return plan.credits;
      }

      return null;
    } catch (error) {
      console.error("Error deducting credits:", error);
      return null;
    }
  }

  async rechargeCredits(
    userId: string,
    amount: number
  ): Promise<number | null> {
    try {
      const plan = await Plan.findOne({
        where: {userId},
      });

      if (!plan || plan.planType !== "prepaid") {
        return null;
      }

      plan.credits += amount;
      await plan.save();
      return plan.credits;
    } catch (error) {
      console.error("Error recharging credits:", error);
      return null;
    }
  }
}

export default new FinancialService();
