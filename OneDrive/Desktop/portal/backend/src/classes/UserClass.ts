
export abstract class UserClass {
  protected _id?: string;
  protected _name: string;
  protected _email: string;
  protected _contact: string;
  private _password: string;
  private _notificationIds: string[]; // store notification _id only

  constructor(name: string, email: string, contact: string, password: string, id?: string) {
    this._name = name;
    this._email = email;
    this._contact = contact;
    this._password = password;
    this._notificationIds = [];
    if (id) this._id = id;
  }

  get id(): string | undefined { return this._id; }
  get name(): string { return this._name; }
  get email(): string { return this._email; }
  get contact(): string { return this._contact; }

  setName(name: string): void { this._name = name; }
  setEmail(email: string): void { this._email = email; }
  setContact(contact: string): void { this._contact = contact; }

  validatePassword(password: string): boolean { return this._password === password; }
  updatePassword(oldPass: string, newPass: string): void {
    if (!this.validatePassword(oldPass)) throw new Error("Incorrect old password!");
    if (newPass.length < 6) throw new Error("Password must be 6+ characters");
    this._password = newPass;
  }

  addNotification(notificationId: string): void { this._notificationIds.push(notificationId); }
  getNotifications(): string[] { return this._notificationIds; }
  clearNotifications(): void { this._notificationIds = []; }

  abstract getRole(): string;
}
