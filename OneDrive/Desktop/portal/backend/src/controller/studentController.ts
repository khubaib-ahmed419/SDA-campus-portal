import { Request, Response } from "express";
import { StudentService } from "../service/studentServices";

export class StudentController {

  // ================================
  // Student SignUp
  // ================================
  public studentSignUp = async (req: Request, res: Response) => {
    try {
      const result = await StudentService.studentSignUp(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
  static async getTotalStudentsController(req: Request, res: Response) {
    try {
      const total = await StudentService.getTotalStudents();
      res.status(200).json({ totalStudents: total });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
