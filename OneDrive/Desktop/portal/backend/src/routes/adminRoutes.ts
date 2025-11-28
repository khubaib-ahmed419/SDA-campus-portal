import { Router } from "express";
import { AdminController } from "../controller/adminController";
import { AuthMiddleware } from "../middlewares/authMiddleware"; // Middleware to protect admin routes

const router = Router();

// Only accessible by admin
router.post("/signup", AdminController.signUp);
router.post("/add-campus", AuthMiddleware.verifyToken, AuthMiddleware.verifyAdmin, AdminController.addCampus);
router.post("/add-degree", AuthMiddleware.verifyToken, AuthMiddleware.verifyAdmin, AdminController.addDegree);


export default router;
