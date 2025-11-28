import { Router } from "express";
import { StudentController } from "../controller/studentController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { UserController } from "../controller/userController";

const router = Router();
const studentController = new StudentController();

router.post("/signup", studentController.studentSignUp);
router.get("/total", StudentController.getTotalStudentsController);
router.get("/:id", AuthMiddleware.verifyToken, UserController.getStudentById);


export default router;
