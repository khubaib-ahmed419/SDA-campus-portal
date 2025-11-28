export class DonationClass {
private _id?: string;
private _donorId: string;       // Student who donates
private _fundraiserId: string;  // Fundraising _id
private _amount: number;
private _dateOfDonation: Date;

constructor(
donorId: string,
fundraiserId: string,
amount: number,
dateOfDonation: Date = new Date(),
id?: string
) {
this._donorId = donorId;
this._fundraiserId = fundraiserId;
this._amount = amount;
this._dateOfDonation = dateOfDonation;
if (id) this._id = id;
}

// ------------------------
// Getters
// ------------------------
get id(): string | undefined { return this._id; }
get donorId(): string { return this._donorId; }
get fundraiserId(): string { return this._fundraiserId; }
get amount(): number { return this._amount; }
get dateOfDonation(): Date { return this._dateOfDonation; }

// ------------------------
// Convert class → DB record
// ------------------------
toRecord() {
return {
donorId: this._donorId,
fundraiserId: this._fundraiserId,
amount: this._amount,
dateOfDonation: this._dateOfDonation,
};
}
}
