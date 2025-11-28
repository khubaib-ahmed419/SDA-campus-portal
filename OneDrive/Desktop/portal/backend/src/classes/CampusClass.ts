// src/classes/Campus.ts

export class CampusClass {
  private _id?: string;
  private _name: string;        // e.g., "FAST Lahore"
  private _location: string;    // e.g., "Lahore, Pakistan"

  constructor(name: string, location: string, id?: string) {
    this._name = name;
    this._location = location;
    if (id) this._id = id;
  }

  // =====================================================
  // Getters
  // =====================================================
  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get location(): string {
    return this._location;
  }

  // =====================================================
  // Setters
  // =====================================================
  setName(name: string): void {
    if (name.length < 2) throw new Error("Campus name too short");
    this._name = name;
  }

  setLocation(location: string): void {
    if (location.length < 2) throw new Error("Location too short");
    this._location = location;
  }
}
