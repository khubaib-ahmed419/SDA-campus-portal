import { Request, Response } from "express";
import { AdminService } from "../service/AdminServices";

export class AdminController {
  // =================== Admin Signup ===================
  static async signUp(req: Request, res: Response) {
    try {
      const { name, email, contact, password } = req.body;
      const result = await AdminService.signup(name, email, contact, password);

      return res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        userId: result.userId,
        adminId: result.adminId,
        notificationId: result.notificationId
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // =================== Add Campus ===================
  static async addCampus(req: Request, res: Response) {
    try {
      const { name, location } = req.body;
      const adminID = req.user._id;
      if (!name || !location)
        return res.status(400).json({ success: false, message: "Name and location required" });

      const campus = await AdminService.addCampus(adminID, name, location);

      return res.status(201).json({
        success: true,
        message: "Campus created successfully",
        data: campus,
      });

    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // =================== Add Degree ===================
  static async addDegree(req: Request, res: Response) {
    try {
      const { name, major, duration } = req.body;

      if (!name || !major || !duration)
        return res.status(400).json({ message: "All fields are required" });

      const degree = await AdminService.addDegree(
        req.user._id,
        name,
        major,
        duration
      );

      res.status(201).json({
        success: true,
        message: "Degree created successfully",
        data: degree,
      });

    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
