import { UserClass } from "./UserClass";


export class AdminClass extends UserClass {
  private _requestedFundraisers: string[];

  constructor(userDoc: any) {
    super(userDoc.name, userDoc.email, userDoc.contact, userDoc.password, userDoc._id);
    this._requestedFundraisers = userDoc.requestedFundraisers || [];
  }

  get requestedFundraisers(): string[] {
    return this._requestedFundraisers;
  }

  viewPendingFundraisers(): string[] {
    return this._requestedFundraisers;
  }

  approveFundraiser(fundraiserId: string): string {
    const index = this._requestedFundraisers.indexOf(fundraiserId);
    if (index === -1) throw new Error("Fundraiser not found");
    this._requestedFundraisers.splice(index, 1);
    return `Fundraiser ${fundraiserId} approved by Admin ${this.name}`;
  }

  rejectFundraiser(fundraiserId: string): string {
    const index = this._requestedFundraisers.indexOf(fundraiserId);
    if (index === -1) throw new Error("Fundraiser not found");
    this._requestedFundraisers.splice(index, 1);
    return `Fundraiser ${fundraiserId} rejected by Admin ${this.name}`;
  }

  // ✅ Implement getRole
  getRole(): string {
    return "Admin";
  }
}
