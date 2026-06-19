import { parseSearchInput, toSearchQuery, validateSearch } from "../search-params";

describe("validateSearch", () => {
  const valid = {
    origin: "JFK",
    destination: "LAX",
    date: "2026-07-20",
    passengers: 2,
  };

  it("passes for valid input", () => {
    expect(validateSearch(valid)).toEqual({});
  });

  it("requires origin and destination", () => {
    const errors = validateSearch({ ...valid, origin: "", destination: "" });
    expect(errors.origin).toBeDefined();
    expect(errors.destination).toBeDefined();
  });

  it("rejects identical origin and destination", () => {
    const errors = validateSearch({ ...valid, destination: "JFK" });
    expect(errors.destination).toBeDefined();
  });

  it("rejects a malformed date", () => {
    expect(validateSearch({ ...valid, date: "20-07-2026" }).date).toBeDefined();
  });

  it("rejects a past date when today is provided", () => {
    expect(validateSearch(valid, "2026-08-01").date).toBeDefined();
  });

  it("rejects passenger counts outside 1-9", () => {
    expect(validateSearch({ ...valid, passengers: 0 }).passengers).toBeDefined();
    expect(validateSearch({ ...valid, passengers: 12 }).passengers).toBeDefined();
  });
});

describe("toSearchQuery", () => {
  it("serializes a search to a query string", () => {
    const query = toSearchQuery({
      origin: "JFK",
      destination: "LAX",
      date: "2026-07-20",
      passengers: 2,
    });
    expect(query).toBe(
      "origin=JFK&destination=LAX&date=2026-07-20&passengers=2",
    );
  });
});

describe("parseSearchInput", () => {
  it("returns a normalized search for valid input", () => {
    expect(
      parseSearchInput({
        origin: "jfk",
        destination: "lax",
        date: "2026-07-20",
        passengers: "2",
      }),
    ).toEqual({
      origin: "JFK",
      destination: "LAX",
      date: "2026-07-20",
      passengers: 2,
    });
  });

  it("returns null for invalid input", () => {
    expect(parseSearchInput({ origin: "JFK" })).toBeNull();
  });
});
