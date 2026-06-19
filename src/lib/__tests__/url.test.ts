import { mergeQuery, parseListParam } from "../url";

describe("mergeQuery", () => {
  it("sets new values", () => {
    const result = mergeQuery(new URLSearchParams("origin=JFK"), {
      sortBy: "price",
    });
    expect(result).toBe("origin=JFK&sortBy=price");
  });

  it("joins array values with commas", () => {
    const result = mergeQuery(new URLSearchParams(), {
      airlines: ["AA", "DL"],
    });
    expect(result).toBe("airlines=AA%2CDL");
  });

  it("deletes keys for empty values", () => {
    const result = mergeQuery(new URLSearchParams("airlines=AA"), {
      airlines: [],
    });
    expect(result).toBe("");
  });
});

describe("parseListParam", () => {
  it("splits a comma list", () => {
    expect(parseListParam("AA,DL")).toEqual(["AA", "DL"]);
  });

  it("returns an empty array for null", () => {
    expect(parseListParam(null)).toEqual([]);
  });
});
