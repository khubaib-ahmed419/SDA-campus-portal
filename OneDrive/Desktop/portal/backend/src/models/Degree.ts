import mongoose, { Schema, Document } from "mongoose";

export interface IDegree extends Document {
  name: string;
  major: string;
  duration: number;
}

const DegreeSchema: Schema = new Schema({
  name: { type: String, required: true },
  major: { type: String, required: true },
  duration: { type: Number, required: true },
}, { timestamps: true });

export const DegreeModel = mongoose.model<IDegree>("Degree", DegreeSchema);
