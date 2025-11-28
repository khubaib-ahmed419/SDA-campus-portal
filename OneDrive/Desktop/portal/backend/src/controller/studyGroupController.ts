// src/controller/utilityController.ts
import { Request, Response } from "express";
import { StudyGroupServices } from "../service/studyGroupServices";

export class StudyGroupController {
  static async getTotalStudyGroups(req: Request, res: Response) {
    try {
      const total = await StudyGroupServices.getTotalStudyGroups();
      res.status(200).json({ studyGroups: total });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  static async joinStudyGroup(req: Request, res: Response){
    try {
      const joinGroup = await StudyGroupServices.joinStudyGroup(req.user.id, req.params.id);
      res.status(200).json({ studyGroup: joinGroup });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

    static async removeMember(req: Request, res: Response){
    try {
      const { memberId } = req.body;
      const removeMember = await StudyGroupServices.removeMemberFromGroup(req.user.id, req.params.id, memberId);
      res.status(200).json({ studyGroup: removeMember });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }


    static async leaveStudyGroup(req: Request, res: Response){
    try {
      const leaveGroup = await StudyGroupServices.leaveStudyGroup(req.user.id, req.params.id);
      res.status(200).json({ studyGroup: leaveGroup });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  static async getAllStudyGrops(req: Request, res: Response){
    try {
      const allGroups = await StudyGroupServices.getAllStudyGroups();
      res.status(200).json({ studyGroups: allGroups });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  static async getStudyGropByID(req: Request, res: Response){
    try {
      const allGroups = await StudyGroupServices.getStudyGroupById(req.params.id);
      res.status(200).json({ studyGroups: allGroups });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
  static async createStudyGroup(req: Request, res: Response) {
    try {
      const founderId = req.user.id;           // comes from auth middleware
      const { name, subject } = req.body;

      const result = await StudyGroupServices.createStudyGroup(
        founderId,
        req.body
      );

      res.status(201).json({
        message: "Study group created successfully",
        group: result,
      });

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteStudyGroup(req: Request, res: Response) {
  try {
    const founderId = req.user.id; // comes from auth middleware

    await StudyGroupServices.deleteStudyGroup(founderId, req.params.id);

    res.status(200).json({
      message: "Study group deleted successfully",
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

  static async transferFounderAndLeave(req: Request, res: Response) {
    try {
      const currentFounderId = req.user?._id; // assuming middleware adds user object
      const { groupId } = req.params;
      const { newFounderId } = req.body;

      if (!currentFounderId) return res.status(401).json({ message: "Login required" });
      if (!newFounderId) return res.status(400).json({ message: "New founder ID is required" });

      const updatedGroup = await StudyGroupServices.transferFounderAndLeave(
        currentFounderId,
        groupId,
        newFounderId
      );

      return res.status(200).json({
        success: true,
        studyGroup: {
          _id: updatedGroup.id,
          _name: updatedGroup.name,
          _subject: updatedGroup.subject,
          _founderId: updatedGroup.founderId,
          _memberIds: updatedGroup.memberIds,
        },
      });
    } catch (err: any) {
      console.error("Transfer founder error:", err);
      return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
  }
}
