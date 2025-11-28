// src/services/utilityservices.ts
import { DegreeModel } from "../models/Degree";
import { DegreeClass } from "../classes/DegreeClass";
import { CampusModel } from "../models/Campus";
import { CampusClass } from "../classes/CampusClass";

export class UtilityServicesClass {
  static async getAllDegrees() {
    const degrees = await DegreeModel.find();
    return degrees.map(
      (d) => new DegreeClass(d.name, d.duration, d.major, d._id.toString())
    );
  }

  static async getAllCampuses() {
    const campuses = await CampusModel.find();
    return campuses.map(
      (c) => new CampusClass(c.name, c.location, c._id.toString())
    );
  }
}
