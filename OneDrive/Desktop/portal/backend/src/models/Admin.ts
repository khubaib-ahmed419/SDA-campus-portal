import mongoose, { Schema, Document } from "mongoose";

export interface IAdminDoc extends Document {
  userId: mongoose.Types.ObjectId; // reference to User
  requestedFundRaisers: mongoose.Types.ObjectId[]; // references FundRaising
}

const AdminSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedFundRaisers: [{ type: Schema.Types.ObjectId, ref: "FundRaising" }],
  },
  { timestamps: true }
);

export const AdminModel = mongoose.model<IAdminDoc>("Admin", AdminSchema);
