// src/services/utilityService.ts
import { StudyGroupModel, IStudyGroup } from "../models/StudyGroup";
import { StudyGroupClass } from "../classes/StudyGroupClass";
import { StudentModel } from "../models/Student";
import { UserModel } from "../models/User";
import { NotificationModel } from "../models/Notification";

export class StudyGroupServices {
  static async getTotalStudyGroups(): Promise<number> {
    return await StudyGroupModel.countDocuments();
  }
  static async getAllStudyGroups() {
    return await StudyGroupModel.find();
  }

  static async joinStudyGroup(userID: string, groupID: string): Promise<StudyGroupClass> {
  // Step 1: Verify student exists
  const user = await UserModel.findById( userID );
  if (!user) throw new Error("User not found");
  const student = await StudentModel.findOne({ userId: userID });
  if (!student) throw new Error("Student not found");

  // Step 2: Find the study group in DB
  const groupDoc = await StudyGroupModel.findById(groupID);
  if (!groupDoc) throw new Error("Study group not found");

  // Step 3: Convert DB document to OOP instance
  const group = new StudyGroupClass(
    groupDoc.founderId.toString(),
    groupDoc.name,
    groupDoc.subject,
    groupDoc._id.toString()
  );

  // Add all existing members
  groupDoc.memberIds.forEach((memberId) => group.addMember(memberId.toString()));

  // Step 4: Add the student if not already a member
  if (!group.isMember(userID)) {
    group.addMember(userID);

    // Step 5: Update DB
    groupDoc.memberIds.push(userID);
    await groupDoc.save();

    // Also update student's joinedStudyGroupIds
    if (!student.joinedStudyGroupIds.includes(groupID)) {
      student.joinedStudyGroupIds.push(groupID);
      await student.save();
    }
  }

  const notification = await NotificationModel.create({
      message: `Your have successfully joined studygroup "${groupDoc.name}".`,
      isRead: false,
    });
      user.notifications.push(notification._id);
      await user.save();


  return group;
}

static async leaveStudyGroup(userID: string, groupID: string): Promise<StudyGroupClass> {
  // Step 1: Verify student exists
  const user = await UserModel.findById(userID);
  if (!user) throw new Error("User not found");

  const student = await StudentModel.findOne({ userId: userID });
  if (!student) throw new Error("Student not found");

  // Step 2: Find the study group in DB
  const groupDoc = await StudyGroupModel.findById(groupID);
  if (!groupDoc) throw new Error("Study group not found");

  // Step 3: Convert DB document to OOP instance
  const group = new StudyGroupClass(
    groupDoc.founderId.toString(),
    groupDoc.name,
    groupDoc.subject,
    groupDoc._id.toString()
  );

  // Add all existing members
  groupDoc.memberIds.forEach((memberId) => group.addMember(memberId.toString()));

  // Step 4: Remove student from group
  if (group.isMember(userID)) {
    group.removeMember(userID);

    // Step 5: Update DB
    groupDoc.memberIds = group.memberIds;
    await groupDoc.save();

    // Also update student's joinedStudyGroupIds
    student.joinedStudyGroupIds = student.joinedStudyGroupIds.filter(id => id !== groupID);
    await student.save();

    // Notification for leaving
    const notification = await NotificationModel.create({
      message: `You have successfully left studygroup "${groupDoc.name}".`,
      isRead: false,
    });
    user.notifications.push(notification._id);
    await user.save();
  }

  return group;
}

  static async getStudyGroupById(id: string): Promise<StudyGroupClass | null> {
  const doc = await StudyGroupModel.findById(id);

  if (!doc) return null;

  // Convert DB -> Class OOP Object
  const group = new StudyGroupClass(
    doc.founderId.toString(),
    doc.name,
    doc.subject,
    doc._id.toString() // use _id.toString() here
  );

  // Assign memberIds separately
  doc.memberIds.forEach((memberId) => group.addMember(memberId.toString()));

  return group;
}

   static async createStudyGroup(founderId: string, data: { name: string; subject: string}) {

    const founder = await UserModel.findById(founderId);
    if (!founder) throw new Error("Founder student not found");

    const groupObj = new StudyGroupClass(founderId, data.name, data.subject);
    
    const savedGroup = await StudyGroupModel.create({
      founderId,
      name: data.name,
      subject: data.subject,
      memberIds: [founderId],
    });

    // ========================
    // Push notification
    // ========================
    const notification = await NotificationModel.create({
      message: `Your studygroup "${data.name}" has been created.`,
      isRead: false,
    });
      founder.notifications.push(notification._id);
      await founder.save();

    const student = await StudentModel.findOne({userId: founderId})
    if(!student){
      console.log("student not found")
    }
    if(student){
      student.organisedStudyGroupIds.push(savedGroup._id.toString());
      student.joinedStudyGroupIds.push(savedGroup._id.toString());
      await student.save();


    }

    await founder.save();
    await notification.save();

    return savedGroup;
  }

  static async removeMemberFromGroup(founderId: string, groupID: string, memberId: string): Promise<StudyGroupClass> {
  // Step 1: Verify founder exists
  const founder = await UserModel.findById(founderId);
  if (!founder) throw new Error("Founder not found");

  // Step 2: Find the study group
  const groupDoc = await StudyGroupModel.findById(groupID);
  if (!groupDoc) throw new Error("Study group not found");

  // Step 3: Check if the user is the founder
  if (groupDoc.founderId.toString() !== founderId) {
    throw new Error("Only the founder can remove members");
  }

  // Step 4: Check that the member exists in the group
  if (!groupDoc.memberIds.includes(memberId)) {
    throw new Error("Member not part of this group");
  }

  // Step 5: Convert DB document to OOP instance
  const group = new StudyGroupClass(
    groupDoc.founderId.toString(),
    groupDoc.name,
    groupDoc.subject,
    groupDoc._id.toString()
  );
  groupDoc.memberIds.forEach((id) => group.addMember(id.toString()));

  // Step 6: Remove member
  group.removeMember(memberId);
  groupDoc.memberIds = group.memberIds;
  await groupDoc.save();

  // Step 7: Update student's joinedStudyGroupIds
  const student = await StudentModel.findOne({ userId: memberId });
  if (student) {
    student.joinedStudyGroupIds = student.joinedStudyGroupIds.filter(id => id !== groupID);
    await student.save();
  }

  // Step 8: Send notification to the removed member
  const removedUser = await UserModel.findById(memberId);
  if (removedUser) {
    const notification = await NotificationModel.create({
      message: `You have been removed from the study group "${groupDoc.name}".`,
      isRead: false,
    });
    removedUser.notifications.push(notification._id);
    await removedUser.save();
  }

  return group;
}

static async transferFounderAndLeave(
  currentFounderId: string,
  groupId: string,
  newFounderId: string
): Promise<StudyGroupClass> {
  // Step 1: Verify current founder exists
  const founderUser = await UserModel.findById(currentFounderId);
  if (!founderUser) throw new Error("Founder not found");

  // Step 2: Verify group exists
  const groupDoc = await StudyGroupModel.findById(groupId);
  if (!groupDoc) throw new Error("Study group not found");

  console.log("founderid  ", groupDoc.founderId)
  console.log("userid ", currentFounderId)
  // Step 3: Verify current user is founder
  if (groupDoc.founderId.toString().trim() !== currentFounderId.toString().trim()) {
  throw new Error("Only the founder can transfer ownership.." );
}

  // Step 4: Verify new founder is a member
  if (!groupDoc.memberIds.map(id => id.toString()).includes(newFounderId))
    throw new Error("New founder must be a member of the group");

  // Step 5: Update founderId in DB
  groupDoc.founderId = newFounderId;
  await groupDoc.save();

  // Step 6: Update student documents
  // Remove group from current founder's organisedStudyGroupIds
  const currentFounderStudent = await StudentModel.findOne({ userId: currentFounderId });
  if (currentFounderStudent) {
    currentFounderStudent.organisedStudyGroupIds = currentFounderStudent.organisedStudyGroupIds.filter(
      id => id !== groupId
    );
    currentFounderStudent.joinedStudyGroupIds = currentFounderStudent.joinedStudyGroupIds.filter(
      id => id !== groupId
    );
    await currentFounderStudent.save();
  }

  // Add group to new founder's organisedStudyGroupIds if not already there
  const newFounderStudent = await StudentModel.findOne({ userId: newFounderId });
  if (newFounderStudent && !newFounderStudent.organisedStudyGroupIds.includes(groupId)) {
    newFounderStudent.organisedStudyGroupIds.push(groupId);
    await newFounderStudent.save();
  }

  // Step 7: Send notifications
  const notificationForNewFounder = await NotificationModel.create({
    message: `You are now the founder of study group "${groupDoc.name}".`,
    isRead: false,
  });
  if (newFounderStudent) {
    const newFounderUser = await UserModel.findById(newFounderId);
    if (newFounderUser) {
      newFounderUser.notifications.push(notificationForNewFounder._id);
      await newFounderUser.save();
    }
  }

  const notificationForOldFounder = await NotificationModel.create({
    message: `You have successfully transferred ownership and left study group "${groupDoc.name}".`,
    isRead: false,
  });
  if (founderUser) {
    founderUser.notifications.push(notificationForOldFounder._id);
    await founderUser.save();
  }

  // Step 8: Remove old founder from members
  groupDoc.memberIds = groupDoc.memberIds.filter(id => id.toString() !== currentFounderId);
  await groupDoc.save();

  // Step 9: Return OOP StudyGroupClass instance
  const group = new StudyGroupClass(
    groupDoc.founderId.toString(),
    groupDoc.name,
    groupDoc.subject,
    groupDoc._id.toString()
  );
  groupDoc.memberIds.forEach(id => group.addMember(id.toString()));

  return group;
}




// src/services/utilityService.ts
static async deleteStudyGroup(founderId: string, groupId: string): Promise<void> {
  // Step 1: Verify founder exists
  const founderUser = await UserModel.findById(founderId);
  if (!founderUser) throw new Error("Founder not found");

  // Step 2: Verify group exists
  const groupDoc = await StudyGroupModel.findById(groupId);
  if (!groupDoc) throw new Error("Study group not found");

  // Step 3: Only founder can delete
  if (groupDoc.founderId.toString() !== founderId) {
    throw new Error("Only the founder can delete the study group");
  }

  // Step 4: Ensure founder is the only member
  if (groupDoc.memberIds.length > 1) {
    throw new Error("Cannot delete group while other members exist. Remove all members first.");
  }

  // Step 5: Send notification to founder
  const notification = await NotificationModel.create({
    message: `Study group "${groupDoc.name}" has been deleted.`,
    isRead: false,
  });
  founderUser.notifications.push(notification._id);
  await founderUser.save();

  // Step 6: Remove group from founder's organisedStudyGroupIds & joinedStudyGroupIds
  const founderStudent = await StudentModel.findOne({ userId: founderId });
  if (founderStudent) {
    founderStudent.organisedStudyGroupIds = founderStudent.organisedStudyGroupIds.filter(id => id !== groupId);
    founderStudent.joinedStudyGroupIds = founderStudent.joinedStudyGroupIds.filter(id => id !== groupId);
    await founderStudent.save();
  }

  // Step 7: Delete group from DB
  await StudyGroupModel.findByIdAndDelete(groupId);
}

}
