import mongoose, { Schema, Document } from "mongoose";

export interface IFundraising extends Document {
  title: string;
  description: string;
  organiserId: string; // reference to Student
  goalAmount: number;
  collectedAmount: number;
  donationIds: string[];
  isApproved: "no" | "yes" | "rejected";
  status: "ongoing" | "completed" | "closed" | "pending";
}

const FundraisingSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  organiserId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  goalAmount: { type: Number, required: true },
  collectedAmount: { type: Number, default: 0 },
  donationIds: [{ type: Schema.Types.ObjectId, ref: "Donation" }],
  isApproved: { type: String, enum: ["no", "yes", "rejected"], default: "no" },
  status: { type: String, enum: ["ongoing", "completed", "closed", "pending"], default: "ongoing" },
}, { timestamps: true });

export const FundraisingModel = mongoose.model<IFundraising>("Fundraising", FundraisingSchema);
