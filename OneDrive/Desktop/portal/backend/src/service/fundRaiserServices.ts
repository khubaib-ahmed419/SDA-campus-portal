// src/services/fundraiserService.ts
import { FundraisingModel, IFundraising } from "../models/FundRaising";
import { FundraisingClass } from "../classes/FundRaisingClass";
import { UserModel, IUser } from "../models/User";
import { StudentModel, IStudent } from "../models/Student";
import { AdminModel } from "../models/Admin";
import { DonationModel, IDonation } from "../models/Donation";
import {NotificationModel} from "../models/Notification"
import { DonationClass } from "../classes/DonationClass";
import mongoose, { Document } from "mongoose";


export class FundraiserService {
  static async getTotalApprovedFundraisers(): Promise<number> {
    return await FundraisingModel.countDocuments({ isApproved: "yes" });
  }

  static async getAllFundraisers() {
    return await FundraisingModel.find({ isApproved: "yes" });
  }

   static async createFundraiser(organiserId: string, data: { title: string; description: string; goalAmount: number }) {
    const { title, description, goalAmount } = data;

    if (!title || !description || !goalAmount) {
      throw new Error("All fields are required");
    }

    // Create fundraiser with pending status
    const newFundraiser = await FundraisingModel.create({
      organiserId,
      title,
      description,
      goalAmount,
      status: "pending",
      collectedAmount: 0,
    });

    // Create notification
    const notification = await NotificationModel.create({
      message: `Your fundraiser "${title}" has been submitted for admin approval.`,
      isRead: false,
    });

    // Push notification to student
    const student = await UserModel.findById(organiserId);
    if (student) {
      student.notifications.push(notification._id);
      await student.save();
    }

    // push fundraiser to admin's requestedFundRaisers
    const admin = await AdminModel.findOne(); // assuming only 1 admin
    if (!admin) throw new Error("Admin not found!");

    const studentDoc = await StudentModel.findOne({ userId: organiserId });
  if (studentDoc) {
    studentDoc.requestedFundraiserIds.push(newFundraiser._id.toString());
    await studentDoc.save();
  }
  
    admin.requestedFundRaisers.push(newFundraiser._id);
    await admin.save();

    return newFundraiser;
  }

  static async getById(id: string): Promise<FundraisingClass | null> {
    const doc = await FundraisingModel.findById(id);

    if (!doc) return null;

    // Convert DB -> Class OOP Object
    return new FundraisingClass(
      doc.title,
      doc.description,
      doc.goalAmount,
      doc.organiserId.toString(),
      doc._id.toString(),
      doc.collectedAmount,
      doc.donationIds,
      doc.isApproved,
      doc.status
    );
  }







  

  static async getDonationsForFundraiser(fundraiserId: string): Promise<DonationClass[]> {
  if (!mongoose.Types.ObjectId.isValid(fundraiserId)) {
    throw new Error("Invalid fundraiserId");
  }

  console.log("we are in service file");

  // 1️⃣ Get all donations for this fundraiser
  const donationsDocs: IDonation[] = await DonationModel.find({
    fundraiserId: fundraiserId
  });
  console.log("donationsDocs:", donationsDocs);

  const donations: DonationClass[] = [];

  // 2️⃣ Collect all unique donor IDs (they are also User _id)
  const donorIds = donationsDocs.map(d => d.donorId.toString());

  // 3️⃣ Fetch user details directly
  const users = await UserModel.find({ _id: { $in: donorIds } }, "name email contact");
  console.log("users:", users);

  // 4️⃣ Map user _id to user object
  const userMap = new Map<string, IUser>();
  for (const u of users) {
    userMap.set(u._id.toString(), u);
  }

  // 5️⃣ Build DonationClass objects with donor details
  for (const doc of donationsDocs) {
    const donorUser = userMap.get(doc.donorId.toString());
    if (!donorUser) continue;

    const donation = new DonationClass(
      donorUser._id.toString(),  // donorId
      fundraiserId,
      doc.amount,
      doc.dateOfDonation,
      doc._id.toString()
    );

    (donation as any).donorDetails = {
      studentId: donorUser._id.toString(),
      name: donorUser.name,
      email: donorUser.email,
      contact: donorUser.contact || "N/A"
    };

    donations.push(donation);
  }

  console.log("final donations array:", donations);

  return donations;
}


static async cancelFundraiser(fundraiserId: string, userId: string): Promise<IFundraising> {
    const fundraiser = await FundraisingModel.findById(fundraiserId);
    if (!fundraiser) throw new Error("Fundraiser not found");

    console.log("userid", userId)
    if (fundraiser.organiserId.toString() !== userId) {
      throw new Error("You are not authorised to cancel this fundraiser");
    }

    fundraiser.status = "closed";
    await fundraiser.save();
    return fundraiser;
  }

}
