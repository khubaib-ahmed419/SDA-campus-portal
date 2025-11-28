// src/classes/Degree.ts

export class DegreeClass {
  private _id?: string;
  private _name: string;          // e.g., "BS Computer Science"
  private _major:string;
  private _duration: number;      // in years

  constructor(name: string, duration: number, major: string, id?: string) {
    this._name = name;
    this._duration = duration;
    this._major = major;
    if (id) this._id = id;
  }

  // =====================================================
  // Getters
  // =====================================================
  get id(): string | undefined {
    return this._id;
  }

  get major(): string{
    return this._major;
  }
  get name(): string {
    return this._name;
  }

  get duration(): number {
    return this._duration;
  }

  // =====================================================
  // Setters
  // =====================================================
  setName(name: string): void {
    if (name.length < 2) throw new Error("Degree name too short");
    this._name = name;
  }

  setDuration(duration: number): void {
    if (duration < 1) throw new Error("Duration must be at least 1 year");
    this._duration = duration;
  }
}
