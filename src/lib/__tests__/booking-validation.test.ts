import {
  generateBookingReference,
  isValidCardNumber,
  isValidExpiry,
} from "../booking-validation";

describe("isValidCardNumber", () => {
  it("accepts 13-19 digit numbers, ignoring spaces", () => {
    expect(isValidCardNumber("4111 1111 1111 1111")).toBe(true);
  });

  it("rejects numbers that are too short or too long", () => {
    expect(isValidCardNumber("4111")).toBe(false);
    expect(isValidCardNumber("4".repeat(20))).toBe(false);
  });
});

describe("isValidExpiry", () => {
  const now = new Date("2026-06-18T00:00:00.000Z");

  it("accepts a future MM/YY", () => {
    expect(isValidExpiry("08/29", now)).toBe(true);
  });

  it("rejects a past MM/YY", () => {
    expect(isValidExpiry("01/24", now)).toBe(false);
  });

  it("rejects an invalid month", () => {
    expect(isValidExpiry("13/29", now)).toBe(false);
  });

  it("rejects a malformed value", () => {
    expect(isValidExpiry("2029-08", now)).toBe(false);
  });
});

describe("generateBookingReference", () => {
  it("produces a SKY- prefixed 6-character reference", () => {
    expect(generateBookingReference()).toMatch(/^SKY-[A-Z2-9]{6}$/);
  });
});
