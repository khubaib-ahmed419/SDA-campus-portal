// src/routes/utilityRoutes.ts
import express from "express";
import { LostAndFoundItemController } from "../controller/lostAndFoundItemController";

const router = express.Router();

// Other routes...
router.get("/total-lostfound", LostAndFoundItemController.getTotalLostFoundController);

export default router;
