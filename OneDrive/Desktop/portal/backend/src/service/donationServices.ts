import { FundraisingModel } from "../models/FundRaising";
import {DonationModel} from "../models/Donation";
import {NotificationModel} from "../models/Notification";
import { FundraisingClass } from "../classes/FundRaisingClass";
import { DonationClass } from "../classes/DonationClass";
import { UserModel } from "../models/User";

export class DonationService {
  static async donate(userId: string, fundraiseId: string, amount: number) {

    const fundraiserDoc = await FundraisingModel.findById(fundraiseId);
    if (!fundraiserDoc) throw new Error("Fundraiser not found");

    // Build domain object with real DB values
    const fundraiser = new FundraisingClass(
      fundraiserDoc.title,
      fundraiserDoc.description,
      fundraiserDoc.goalAmount,
      fundraiserDoc.organiserId,
      fundraiserDoc._id.toString(),
      fundraiserDoc.collectedAmount,
      fundraiserDoc.donationIds,
      fundraiserDoc.isApproved,
      fundraiserDoc.status
    );

    // Create donation
    const donation = new DonationClass(userId, fundraiseId, amount);
    // const donationRecord = await DonationModel.create(donation.getRecord());
    const donationRecord = await DonationModel.create(donation.toRecord());


    // Apply donation domain logic
    fundraiser.addDonation(donationRecord._id.toString(), amount);

    // Save back fundraiser
    fundraiserDoc.collectedAmount = fundraiser.collectedAmount;
    fundraiserDoc.status = fundraiser.status;
    fundraiserDoc.donationIds = fundraiser.donationIds;

    await fundraiserDoc.save();

    // Send Notification
   const notification = await NotificationModel.create({
      message: `You donated $${amount} to ${fundraiserDoc.title}.`,
      isRead: false
    });
    // Push notification to student
        const student = await UserModel.findById(userId);
        if (student) {
          student.notifications.push(notification._id);
          await student.save();
        }

    return fundraiserDoc;
  }

  static async getDonationsWithUserDetails(fundraiserId: string) {
    // Find fundraiser
    const fundraiser = await FundraisingModel.findById(fundraiserId).populate({
      path: "donationIds",
      model: "Donation", // assuming you have a Donation model
      populate: { path: "userId", model: "User" } // populate user inside donation
    });

    if (!fundraiser) throw new Error("Fundraiser not found");

    // Map to desired structure
    const donations = fundraiser.donationIds.map((donation: any) => ({
      userId: donation.userId._id.toString(),
      name: donation.userId._name,
      email: donation.userId._email,
      contact: donation.userId._contact || "N/A",
      amount: donation.amount
    }));

    return donations;
  }
}
