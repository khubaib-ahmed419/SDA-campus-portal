// controllers/DonationController.ts

import { Request, Response } from "express";
import { DonationService } from "../service/donationServices";

export class DonationController {
  static async donate(req: Request, res: Response) {
    try {
      const userId = req.user.id; // Middleware placed user in req.user
      const { fundraiseId } = req.params;
      const { amount } = req.body;

      const result = await DonationService.donate(userId, fundraiseId, amount);

      return res.status(201).json({
        message: "Donation successful",
        fundraiser: result,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
