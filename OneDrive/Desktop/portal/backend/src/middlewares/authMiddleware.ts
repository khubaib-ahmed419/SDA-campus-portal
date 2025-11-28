import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export class AuthMiddleware {
  // =================== Verify JWT ===================
  public static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new Error("Authorization token missing");

      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

      const user = await UserModel.findById(decoded.id);
      if (!user) throw new Error("User not found");

      req.user = user; // attach user to request
      next();
    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message });
    }
  }

  // =================== Verify Admin ===================
  public static async verifyAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error("User not authenticated");
      if (req.user.role !== "admin") throw new Error("Admin access required");
      next();
    } catch (err: any) {
      res.status(403).json({ success: false, message: err.message });
    }
  }

  // =================== Verify Student ===================
  public static async verifyStudent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Error("User not authenticated");
      if (req.user.role !== "student") throw new Error("Student access required");
      next();
    } catch (err: any) {
      res.status(403).json({ success: false, message: err.message });
    }
  }
}
