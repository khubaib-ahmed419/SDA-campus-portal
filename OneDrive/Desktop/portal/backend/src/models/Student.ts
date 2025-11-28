import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId; 
  rollNo: string;
  degreeId: string;
  campusId: string;
  batch: string;
  organisedStudyGroupIds: string[];
  joinedStudyGroupIds: string[];
  requestedFundraiserIds: string[];
  approvedFundraiserIds: string[];
  lostAndFoundItemIds: string[];
  donationIds: string[];
}


const StudentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rollNo: { type: String, required: true },
  degreeId: { type: String, ref: "Degree", required: true },
  campusId: { type: String, ref: "Campus", required: true },
  batch: { type: String, required: true },
  organisedStudyGroupIds: [{ type: String, ref: "StudyGroup" }],
  joinedStudyGroupIds: [{ type: String, ref: "StudyGroup" }],
  requestedFundraiserIds: [{ type: String, ref: "Fundraising" }],
  approvedFundraiserIds: [{ type: String, ref: "Fundraising" }],
  lostAndFoundItemIds: [{ type: String, ref: "LostFoundItem" }],
  donationIds: [{ type: String, ref: "Donation" }],
}, { timestamps: true });

export const StudentModel = mongoose.model<IStudent>("Student", StudentSchema);
