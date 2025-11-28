import mongoose, { Schema, Document } from "mongoose";

export interface ICampus extends Document {
  name: string;
  location: string;
}

const CampusSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
}, { timestamps: true });

export const CampusModel = mongoose.model<ICampus>("Campus", CampusSchema);
