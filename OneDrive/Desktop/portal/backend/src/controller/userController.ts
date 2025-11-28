import { Request, Response } from "express";
import { UserService } from "../service/userServices";
import { UserModel } from "../models/User";
import { StudentModel } from "../models/Student";
import { StudentService } from "../service/studentServices";
export class UserController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
      }

      const data = await UserService.login(email, password);
      return res.status(200).json({ success: true, message: "Login successful", ...data });
    } catch (err: any) {
      return res.status(401).json({ success: false, message: err.message });
    }
  }


  static async getUsers(req: Request, res: Response) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "User IDs are required" });
      }

      // Fetch users from UserModel
      const users = await UserModel.find({ _id: { $in: ids } }).select("_id name email");

      // Fetch corresponding student data
      const studentData = await StudentModel.find({ userId: { $in: ids } })
        .select("userId rollNo degreeId campusId batch organisedStudyGroupIds joinedStudyGroupIds requestedFundraiserIds approvedFundraiserIds lostAndFoundItemIds donationIds")
        .lean();

      // Map userId to student data for easier merge
      const studentMap: Record<string, any> = {};
      studentData.forEach(student => {
        studentMap[student.userId.toString()] = student;
      });

      // Merge user + student info
      const result = users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        student: studentMap[user._id.toString()] || null,
      }));

      return res.status(200).json({ users: result });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }



  static async getStudentById(req: Request, res: Response) {
    try {
      const { id } = req.params; // this is userId
      const student = await StudentService.getStudentByUserId(id);

      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found" });
      }

      res.status(200).json(student);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
