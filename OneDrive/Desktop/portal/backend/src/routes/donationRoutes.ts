// routes/donation.routes.ts

import { Router } from "express";
import { DonationController } from "../controller/DonationController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// POST /api/donation/:fundraiseId
router.post( "/donate/:fundraiseId",AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, DonationController.donate);

export default router;
