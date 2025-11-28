import { UserModel, IUser } from "../models/User";
import { StudentModel, IStudent } from "../models/Student";
import { StudentClass } from "../classes/StudentClass";
import { CampusModel } from "../models/Campus";
import { DegreeModel } from "../models/Degree";
import { NotificationModel } from "../models/Notification";
import bcrypt from "bcrypt";


export class StudentService {
  // ================================
  // Student SignUp
  // ================================
  static async studentSignUp(data: {
    name: string;
    email: string;
    contact: string;
    password: string;
    rollNo: string;
    degreeId: string;
    campusId: string;
    batch: string;
  }) {
    const {
      name,
      email,
      contact,
      password,
      rollNo,
      degreeId,
      campusId,
      batch,
    } = data;

    // Check if user already exists
    const exists = await UserModel.findOne({ email });
    if (exists) throw new Error("User already exists!");

    // Validate campus
    const campExists = await CampusModel.findById(campusId);
    if (!campExists) throw new Error("No such campus exists!");

    // Validate degree
    const degreeExists = await DegreeModel.findById(degreeId);
    if (!degreeExists) throw new Error("No such degree exists!");

     const hashedPassword = await bcrypt.hash(password, 10);

    // OOP Student Entity
    const studentEntity = new StudentClass(
      name,
      email,
      contact,
      hashedPassword,
      rollNo,
      degreeId,
      campusId,
      batch
    );

    
    // Save in User collection
    const newUser = await UserModel.create({
      name,
      email,
      contact,
      password: hashedPassword,
      role: "student",
      notifications: [],
    });

    // Save notification
    const notification = await NotificationModel.create({
      message: `Welcome ${name}! Your student account has been created successfully.`,
      isRead: false,
    });

    // Push notification into user's notification array
    newUser.notifications.push(notification._id);
    await newUser.save();

    // Save in Student collection
    const newStudent = await StudentModel.create({
      userId: newUser._id,
      rollNo,
      degreeId,
      campusId,
      batch,
      organisedStudyGroupIds: [],
      joinedStudyGroupIds: [],
      requestedFundraiserIds: [],
      approvedFundraiserIds: [],
      lostAndFoundItemIds: [],
      donationIds: [],
    });

    return {
      message: "Student registered successfully",
      user: newUser,
      student: newStudent,
    };
  }
  static async getTotalStudents(): Promise<number> {
    return await StudentModel.countDocuments(); // counts all students
  }

  static async getStudentByUserId(userId: string): Promise<StudentClass | null> {
    // 1. Find the student document
    const studentDoc: IStudent | null = await StudentModel.findOne({ userId });
    if (!studentDoc) return null;

    // 2. Find the user document
    const userDoc: IUser | null = await UserModel.findById(userId);
    if (!userDoc) return null;

    // 3. Return a StudentClass instance
    const student = new StudentClass(
      userDoc.name,
      userDoc.email,
      userDoc.contact,
      userDoc.password,   // optional: can hash / hide
      studentDoc.rollNo,
      studentDoc.degreeId,
      studentDoc.campusId,
      studentDoc.batch,
      studentDoc._id.toString()
    );

    if (userDoc.notifications && userDoc.notifications.length > 0) {
  userDoc.notifications.forEach((notifId: any) => student.addNotification(notifId.toString()));
}
    // 4. Populate other ID arrays
    studentDoc.organisedStudyGroupIds.forEach(id => student.organiseStudyGroup(id));
    studentDoc.joinedStudyGroupIds.forEach(id => student.joinStudyGroup(id));
    studentDoc.requestedFundraiserIds.forEach(id => student.requestFundraiser(id));
    studentDoc.approvedFundraiserIds.forEach(id => student.approveFundraiser(id));
    studentDoc.lostAndFoundItemIds.forEach(id => student.addLostAndFoundItem(id));
    studentDoc.donationIds.forEach(id => student.addDonation(id));

    return student;
  }

}
