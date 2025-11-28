// src/controllers/utilityController.ts
import { Request, Response } from "express";
import { UtilityServicesClass } from "../service/utilityservices";

export class UtilityController {

  public static getAllDegreesController = async (req: Request, res: Response) => {
    try {
      const degrees = await UtilityServicesClass.getAllDegrees();
      res.status(200).json(degrees);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  public static getAllCampusesController = async (req: Request, res: Response) => {
    try {
      const campuses = await UtilityServicesClass.getAllCampuses();
      res.status(200).json(campuses);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
