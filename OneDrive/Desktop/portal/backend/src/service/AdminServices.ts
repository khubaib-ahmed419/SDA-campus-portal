import { CampusModel } from "../models/Campus"; // MongoDB models
import { DegreeModel } from "../models/Degree";
import { UserModel } from "../models/User";
import { AdminModel } from "../models/Admin";
import { NotificationModel } from "../models/Notification";
import { CampusClass } from "../classes/CampusClass";
import { DegreeClass } from "../classes/DegreeClass";
import bcrypt from "bcrypt";

export class AdminService {
  // =================== Admin Signup ===================
  static async signup(name: string, email: string, contact: string, password: string) {
  // Check if user exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create User
  const user = await UserModel.create({
    name,
    email,
    contact,
    password: hashedPassword,
    role: "admin",
    notifications: [],
  });

  // Create Admin document referencing the user
  const admin = await AdminModel.create({
    userId: user._id,
    requestedFundRaisers: [],
  });

  // Create Notification for admin
  const notification = await NotificationModel.create({
    message: `Welcome ${name}! Admin account created successfully.`,
    isRead: false,
  });

  // Push notification _id to User
  user.notifications.push(notification._id);
  await user.save();

  // Return IDs
  return { userId: user._id, adminId: admin._id, notificationId: notification._id };
}

  // =================== Add Degree ===================
   static async addDegree(
    adminId: string,
    name: string,
    major: string,
    duration: number
  ) {

    // 1. Create degree
    const degree = await DegreeModel.create({
      name,
      major,
      duration,
    });

    // 2. Create notification
    const notification = await NotificationModel.create({
      message: `Degree '${name}' created successfully.`,
    });

    // 3. Push notification to admin user
    await UserModel.findByIdAndUpdate(
      adminId,
      { $push: { notifications: notification._id } },
      { new: true }
    );

    return degree;
  }

  // =================== List Campuses ===================
  static async listCampuses() {
    return await CampusModel.find();
  }

  // =================== List Degrees ===================
  static async listDegrees() {
    return await DegreeModel.find();
  }


   static async addCampus(adminId: string, name: string, location: string) {

    // 1. Create campus
    const campus = await CampusModel.create({ name, location });

    // 2. Create notification
    const notification = await NotificationModel.create({
      message: `Campus '${name}' created successfully.`,
    });

    // 3. Push notification into admin user
    await UserModel.findByIdAndUpdate(
      adminId,
      { $push: { notifications: notification._id } },
      { new: true }
    );

    return campus;
  }



}
