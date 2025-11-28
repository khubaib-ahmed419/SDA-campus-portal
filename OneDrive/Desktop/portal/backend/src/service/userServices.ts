import { UserModel } from "../models/User";
import { UserClass } from "../classes/UserClass";
import { StudentClass } from "../classes/StudentClass";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  static async login(email: string, password: string) {
    // 1. Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    // 3. Generate JWT
    console.log("user id :", user._id)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    return { token, userId: user._id, role: user.role };
  }


}
