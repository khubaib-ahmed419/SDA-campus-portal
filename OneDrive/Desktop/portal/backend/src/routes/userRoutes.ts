import { Router } from "express";
import { UserController } from "../controller/userController";

const router = Router();

router.post("/login", UserController.login);
router.post("/get-users", UserController.getUsers)
export default router;
