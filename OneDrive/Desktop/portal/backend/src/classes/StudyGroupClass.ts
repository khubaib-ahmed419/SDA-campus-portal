export class StudyGroupClass {
  private _id?: string;
  private _founderId: string;      // Student _id
  private _name: string;
  private _subject: string;
  private _memberIds: string[];    // array of Student _ids

  constructor(founderId: string, name: string, subject: string, id?: string) {
    this._founderId = founderId;
    this._name = name;
    this._subject = subject;
    this._memberIds = [founderId]; // founder is automatically a member
    if (id) this._id = id;
  }

  // =====================================================
  // Getters
  // =====================================================
  get id(): string | undefined { return this._id; }
  get founderId(): string { return this._founderId; }
  get name(): string { return this._name; }
  get subject(): string { return this._subject; }
  get memberIds(): string[] { return this._memberIds; }

  // =====================================================
  // Setters
  // =====================================================
  setName(name: string): void {
    if (name.length < 2) throw new Error("Group name too short");
    this._name = name;
  }

  setSubject(subject: string): void {
    if (subject.length < 2) throw new Error("Subject too short");
    this._subject = subject;
  }

  // =====================================================
  // Methods to manage members
  // =====================================================
  addMember(studentId: string): void {
    if (!this._memberIds.includes(studentId)) this._memberIds.push(studentId);
  }

  removeMember(studentId: string): void {
    this._memberIds = this._memberIds.filter(id => id !== studentId);
  }

  isMember(studentId: string): boolean {
    return this._memberIds.includes(studentId);
  }
}
