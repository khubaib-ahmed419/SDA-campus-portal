import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  contact: string;
  password: string;
  role: "student" | "admin";
  notifications: mongoose.Types.ObjectId[]; // references Notification _id
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], required: true },
    notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
