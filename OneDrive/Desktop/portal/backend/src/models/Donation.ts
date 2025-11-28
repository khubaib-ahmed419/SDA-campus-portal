import mongoose, { Schema, Document } from "mongoose";

export interface IDonation extends Document {
  donorId: string; // reference to Student
  fundraiserId: string; // reference to Fundraising
  amount: number;
  dateOfDonation: Date;
}

const DonationSchema: Schema = new Schema({
  donorId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  fundraiserId: { type: Schema.Types.ObjectId, ref: "Fundraising", required: true },
  amount: { type: Number, required: true },
  dateOfDonation: { type: Date, default: Date.now },
}, { timestamps: true });

export const DonationModel = mongoose.model<IDonation>("Donation", DonationSchema);
