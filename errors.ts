export class InvalidTimeSlotRange extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTimeSlotRange";
  }
}
