// src/routes/utilityRoutes.ts
import express from "express";
import { UtilityController } from "../controller/utilityController";

const router = express.Router();

router.get("/degrees", UtilityController.getAllDegreesController);
router.get("/campuses", UtilityController.getAllCampusesController);

export default router;
