// src/routes/fundraiserRoutes.ts
import express from "express";
import { FundraiserController } from "../controller/fundraiserController";
import { DonationController } from "../controller/DonationController";

import { AuthMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();

// Other routes...
router.get("/", FundraiserController.getAllFundraisersController);
router.get("/total-approved", FundraiserController.getTotalApprovedFundraisersController);
router.post("/create",AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, FundraiserController.createFundraiserController); // POST /api/fundraisers
router.post( "/donate/:fundraiseId",AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, DonationController.donate);
router.get("/:id", AuthMiddleware.verifyToken, FundraiserController.getFundraiseById)
router.post("/cancel/:id", AuthMiddleware.verifyToken, FundraiserController.cancelFundraiser);
router.get( "/:fundraiserId/donations", AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, FundraiserController.getDonationsWithDetails);

export default router;
