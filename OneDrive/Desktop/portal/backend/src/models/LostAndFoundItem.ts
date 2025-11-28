import mongoose, { Schema, Document } from "mongoose";

export interface ILostFoundItem extends Document {
  title: string;
  description: string;
  type: "lost" | "found";
  ownerId: string; // reference to Student
  finderId?: string | null; // reference to Student
  isClaimed: boolean;
  claimedById?: string; // reference to Student
  dateReported: Date;
}

const LostFoundItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["lost", "found"], required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  finderId: { type: Schema.Types.ObjectId, ref: "Student", default: null },
  isClaimed: { type: Boolean, default: false },
  claimedById: { type: Schema.Types.ObjectId, ref: "Student" },
  dateReported: { type: Date, default: Date.now },
}, { timestamps: true });

export const LostFoundItemModel = mongoose.model<ILostFoundItem>("LostFoundItem", LostFoundItemSchema);
