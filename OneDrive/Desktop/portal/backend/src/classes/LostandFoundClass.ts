export class LostFoundItemClass {
  private _id?: string;
  private _title: string;
  private _description: string;
  private _type: "lost" | "found";
  private _ownerId: string;       // Student _id
  private _finderId?: string;     // Student _id
  private _isClaimed: boolean;
  private _claimedById?: string;  // Student _id
  private _dateReported: Date;

  constructor(
    title: string, description: string, type: "lost" | "found", ownerId: string,
    finderId?: string, isClaimed: boolean = false, claimedById?: string, dateReported: Date = new Date(), id?: string
  ) {
    this._title = title;
    this._description = description;
    this._type = type;
    this._ownerId = ownerId;
    this._finderId = finderId;
    this._isClaimed = isClaimed;
    this._claimedById = claimedById;
    this._dateReported = dateReported;
    if (id) this._id = id;
  }
}
