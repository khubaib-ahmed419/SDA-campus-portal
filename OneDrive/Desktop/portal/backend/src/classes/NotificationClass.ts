export class NotificationClass {
  private _id?: string;         // MongoDB notification _id
  private _message: string;
  private _date: Date;
  private _isRead: boolean;

  constructor(message: string, date: Date = new Date(), isRead: boolean = false, id?: string) {
    this._message = message;
    this._date = date;
    this._isRead = isRead;
    if (id) this._id = id;
  }

  get id(): string | undefined { return this._id; }
  get message(): string { return this._message; }
  get date(): Date { return this._date; }
  get isRead(): boolean { return this._isRead; }

  markAsRead(): void { this._isRead = true; }
  markAsUnread(): void { this._isRead = false; }

  view(): string {
    return `[${this._date.toLocaleString()}] ${this._isRead ? "(Read)" : "(Unread)"} - ${this._message}`;
  }
}
