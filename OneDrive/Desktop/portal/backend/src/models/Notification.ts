import mongoose, { Schema, Document } from "mongoose";

export interface INotificationDoc extends Document {
  message: string;
  isRead: boolean;
  date: Date;
}

const NotificationSchema: Schema = new Schema({
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export const NotificationModel = mongoose.model<INotificationDoc>("Notification", NotificationSchema);
