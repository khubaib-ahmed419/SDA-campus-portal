import mongoose, { Schema, Document } from "mongoose";

export interface IStudyGroup extends Document {
  founderId: string; // reference to Student
  name: string;
  subject: string;
  memberIds: string[]; // array of Student IDs
}

const StudyGroupSchema: Schema = new Schema({
  founderId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  memberIds: [{ type: Schema.Types.ObjectId, ref: "Student" }],
}, { timestamps: true });

export const StudyGroupModel = mongoose.model<IStudyGroup>("StudyGroup", StudyGroupSchema);
