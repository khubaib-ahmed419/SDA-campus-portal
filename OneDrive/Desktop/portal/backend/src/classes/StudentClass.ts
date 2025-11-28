import { UserClass } from "./UserClass";
import { DegreeClass } from "./DegreeClass";
import { CampusClass } from "./CampusClass";

export class StudentClass extends UserClass {
  private _rollNo: string;
  private _degreeId: string;        // store Degree _id
  private _campusId: string;        // store Campus _id
  private _batch: string;

  private _organisedStudyGroupIds: string[];   // store StudyGroup _id
  private _joinedStudyGroupIds: string[];
  private _requestedFundraiserIds: string[];
  private _approvedFundraiserIds: string[];
  private _lostAndFoundItemIds: string[];
  private _donationIds: string[];

  constructor(
    name: string,
    email: string,
    contact: string,
    password: string,
    rollNo: string,
    degreeId: string,
    campusId: string,
    batch: string,
    id?: string
  ) {
    super(name, email, contact, password, id);
    this._rollNo = rollNo;
    this._degreeId = degreeId;
    this._campusId = campusId;
    this._batch = batch;

    this._organisedStudyGroupIds = [];
    this._joinedStudyGroupIds = [];
    this._requestedFundraiserIds = [];
    this._approvedFundraiserIds = [];
    this._lostAndFoundItemIds = [];
    this._donationIds = [];
  }

  // =====================================================
  // Getters
  // =====================================================
  get rollNo(): string { return this._rollNo; }
  get degreeId(): string { return this._degreeId; }
  get campusId(): string { return this._campusId; }
  get batch(): string { return this._batch; }

  get organisedStudyGroupIds(): string[] { return this._organisedStudyGroupIds; }
  get joinedStudyGroupIds(): string[] { return this._joinedStudyGroupIds; }
  get requestedFundraiserIds(): string[] { return this._requestedFundraiserIds; }
  get approvedFundraiserIds(): string[] { return this._approvedFundraiserIds; }
  get lostAndFoundItemIds(): string[] { return this._lostAndFoundItemIds; }
  get donationIds(): string[] { return this._donationIds; }

  // =====================================================
  // Setters
  // =====================================================
  setRollNo(rollNo: string): void { this._rollNo = rollNo; }
  setDegreeId(degreeId: string): void { this._degreeId = degreeId; }
  setCampusId(campusId: string): void { this._campusId = campusId; }
  setBatch(batch: string): void { this._batch = batch; }

  // =====================================================
  // Methods to add IDs
  // =====================================================
  joinStudyGroup(groupId: string): void { this._joinedStudyGroupIds.push(groupId); }
  organiseStudyGroup(groupId: string): void { this._organisedStudyGroupIds.push(groupId); }
  requestFundraiser(fundraiserId: string): void { this._requestedFundraiserIds.push(fundraiserId); }
  approveFundraiser(fundraiserId: string): void { this._approvedFundraiserIds.push(fundraiserId); }
  addLostAndFoundItem(itemId: string): void { this._lostAndFoundItemIds.push(itemId); }
  addDonation(donationId: string): void { this._donationIds.push(donationId); }

  // =====================================================
  // Polymorphism
  // =====================================================
  getRole(): string { return "Student"; }
}
