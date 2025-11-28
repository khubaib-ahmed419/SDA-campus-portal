import { FundraisingModel } from "../models/FundRaising";
export class FundraisingClass {
  private _id: string | null;
  private _title: string;
  private _description: string;
  private _organiserId: string;  // store Student _id
  private _goalAmount: number;
  private _collectedAmount: number;
  private _donationIds: string[]; // store Donation _id
  private _isApproved: "no" | "yes" | "rejected";
  private _status: "ongoing" | "completed" | "closed" | "pending";

  constructor(
  title: string,
  description: string,
  goalAmount: number,
  organiserId: string,
  id: string | null = null,
  collectedAmount: number = 0,
  donationIds: string[] = [],
  isApproved: "no" | "yes" | "rejected" = "no",
  status: "ongoing" | "completed" | "closed" | "pending"
) {
  this._id = id;
  this._title = title;
  this._description = description;
  this._organiserId = organiserId;
  this._goalAmount = goalAmount;
  this._collectedAmount = collectedAmount;
  this._donationIds = donationIds;
  this._isApproved = isApproved;
  this._status = status;
}

  // =====================================================
  // Getters
  // =====================================================
  get id(): string | null { return this._id; }
  get title(): string { return this._title; }
  get description(): string { return this._description; }
  get organiserId(): string { return this._organiserId; }
  get goalAmount(): number { return this._goalAmount; }
  get collectedAmount(): number { return this._collectedAmount; }
  get donationIds(): string[] { return this._donationIds; }
  get isApproved(): "no" | "yes" | "rejected" { return this._isApproved; }
  get status(): "ongoing" | "completed" | "closed" | "pending" { return this._status; }

  // =====================================================
  // Setters / Updates
  // =====================================================
  setTitle(title: string): void { this._title = title; }
  setDescription(description: string): void { this._description = description; }
  setOrganiserId(organiserId: string): void { this._organiserId = organiserId; }
  approve(): void { this._isApproved = "yes"; }
  reject(): void { this._isApproved = "rejected"; }
  complete(): void { this._status = "completed"; }
  close(): void { this._status = "closed"; }

  // =====================================================
  // Donations
  // =====================================================

  addDonation(donationId: string, amount: number): void {
  if (this._status !== "ongoing") {
    throw new Error("Cannot donate to a non-ongoing fundraiser");
  }

  this._donationIds.push(donationId);
  this._collectedAmount += amount;

  if (this._collectedAmount >= this._goalAmount) {
    this.complete();
  }
}


  getProgress(): string {
    return `${this._collectedAmount}/${this._goalAmount}`;
  }
  toDTO() {
  return {
    collectedAmount: this._collectedAmount,
    donationIds: this._donationIds,
    status: this._status,
  };
}
toJSON() {
  return {
    id: this._id,
    title: this._title,
    description: this._description,
    organiserId: this._organiserId,
    goalAmount: this._goalAmount,
    collectedAmount: this._collectedAmount,
    status: this._status,
    isApproved: this._isApproved,
    donations: this._donationIds,
  };
}

async save() {
  if (this._id) {
    await FundraisingModel.findByIdAndUpdate(this._id, this.toJSON());
  } else {
    const doc = await FundraisingModel.create(this.toJSON());
    this._id = doc._id.toString();
  }
}


static async findById(id: string): Promise<FundraisingClass | null> {
  const doc = await FundraisingModel.findById(id);
  if (!doc) return null;

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

}
