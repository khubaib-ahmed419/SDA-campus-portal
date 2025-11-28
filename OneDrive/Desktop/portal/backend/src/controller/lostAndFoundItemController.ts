// src/controller/utilityController.ts
import { Request, Response } from "express";
import { LostAndFoundServices } from "../service/lostAndFoundServices";

export class LostAndFoundItemController {
  static async getTotalLostFoundController(req: Request, res: Response) {
    try {
      const total = await LostAndFoundServices.getTotalLostFound();
      res.status(200).json({ totalLostAndFound: total });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
