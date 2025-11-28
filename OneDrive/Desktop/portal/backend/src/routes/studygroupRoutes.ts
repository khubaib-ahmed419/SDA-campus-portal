// src/routes/utilityRoutes.ts
import express from "express";
import { StudyGroupController } from "../controller/studyGroupController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Other routes...
router.get("/total-studygroups", StudyGroupController.getTotalStudyGroups);
router.post("/create", AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, StudyGroupController.createStudyGroup);
router.get("/", StudyGroupController.getAllStudyGrops)
router.get("/:id", AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, StudyGroupController.getStudyGropByID)
router.post("/join/:id", AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, StudyGroupController.joinStudyGroup)
router.post("/leave/:id", AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, StudyGroupController.leaveStudyGroup)
router.post("/remove-member/:id", AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, StudyGroupController.removeMember)
router.post("/transfer-founder/:groupId", AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, StudyGroupController.transferFounderAndLeave)
router.post("/delete/:id", AuthMiddleware.verifyToken, AuthMiddleware.verifyStudent, StudyGroupController.deleteStudyGroup)


export default router;
