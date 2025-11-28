// src/controller/fundraiserController.ts
import { Request, Response } from "express";
import { FundraiserService } from "../service/fundRaiserServices";
import { FundraisingModel } from "../models/FundRaising";
import { DonationService } from "../service/donationServices";
import { DonationModel } from "../models/Donation";
export class FundraiserController {
  static async getTotalApprovedFundraisersController(req: Request, res: Response) {
    try {
      const total = await FundraiserService.getTotalApprovedFundraisers();
      res.status(200).json({ totalApprovedFundraisers: total });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  static async getAllFundraisersController(req: Request, res: Response) {
    try {
      const fundraisers = await FundraiserService.getAllFundraisers();
      res.status(200).json({ fundraisers });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }


   static async createFundraiserController(req: Request, res: Response) {
    try {
      const studentId = req.user._id;
      const newFundraiser = await FundraiserService.createFundraiser(studentId, req.body);

      res.status(201).json({
        message: "Fundraiser submitted for admin approval",
        fundraiser: newFundraiser,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }


  static async getFundraiseById(req: Request, res: Response) {
    try {
      const fundraiser = await FundraiserService.getById(req.params.id);

      if (!fundraiser) {
        return res.status(404).json({ message: "Fundraiser not found." });
      }

      // Convert Class Object → JSON safely
      return res.json({
        fundraiser: fundraiser.toJSON()
      });

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Server error.", error: error.message });
    }
  }






  
  static async getDonationsWithDetails(req: Request, res: Response) {
    try {
      const { fundraiserId } = req.params;
      console.log("fundID", fundraiserId)
      if (!fundraiserId) return res.status(400).json({ error: "Fundraiser ID is required" });

      const donations = await FundraiserService.getDonationsForFundraiser(fundraiserId);

      return res.status(200).json({ donations });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message || "Server error" });
    }
  }


  static async cancelFundraiser(req: Request, res: Response) {
    try {
      const userId = req.user.id; // from auth middleware
      const fundraiser = await FundraiserService.cancelFundraiser(req.params.id, userId);
      res.json({ message: "Fundraiser cancelled", fundraiser });
    } catch (err: any) {
      res.status(403).json({ message: err.message });
    }
  }
}
