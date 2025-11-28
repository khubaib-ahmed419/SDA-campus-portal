// src/services/utilityService.ts
import { LostFoundItemModel } from "../models/LostAndFoundItem";

export class LostAndFoundServices {
  static async getTotalLostFound(): Promise<number> {
    return await LostFoundItemModel.countDocuments();
  }
}
