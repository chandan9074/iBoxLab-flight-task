import { computeFacets, filterFlights, sortFlights } from "../flight-query";
import type { Flight } from "../types";

function makeFlight(overrides: Partial<Flight> = {}): Flight {
  return {
    id: "F1",
    airline: { code: "AA", name: "American Airlines" },
    flightNumber: "AA1",
    origin: { code: "JFK", city: "New York", name: "JFK" },
    destination: { code: "LAX", city: "Los Angeles", name: "LAX" },
    departureTime: "2026-07-01T08:00:00.000Z",
    arrivalTime: "2026-07-01T14:00:00.000Z",
    durationMinutes: 360,
    stops: 0,
    layoverAirports: [],
    price: 200,
    currency: "USD",
    cabinClass: "economy",
    seatsAvailable: 5,
    aircraft: "Boeing 737",
    ...overrides,
  };
}

const sample: Flight[] = [
  makeFlight({ id: "a", airline: { code: "AA", name: "American Airlines" }, price: 300, stops: 0, durationMinutes: 360, cabinClass: "economy" }),
  makeFlight({ id: "b", airline: { code: "DL", name: "Delta Air Lines" }, price: 150, stops: 1, durationMinutes: 480, cabinClass: "business" }),
  makeFlight({ id: "c", airline: { code: "AA", name: "American Airlines" }, price: 220, stops: 2, durationMinutes: 600, cabinClass: "economy" }),
];

describe("filterFlights", () => {
  it("returns all flights when no filters are applied", () => {
    expect(filterFlights(sample, {})).toHaveLength(3);
  });

  it("filters by airline", () => {
    const result = filterFlights(sample, { airlines: ["AA"] });
    expect(result.map((f) => f.id)).toEqual(["a", "c"]);
  });

  it("filters by stops", () => {
    const result = filterFlights(sample, { stops: [0] });
    expect(result.map((f) => f.id)).toEqual(["a"]);
  });

  it("filters by max price (inclusive)", () => {
    const result = filterFlights(sample, { maxPrice: 220 });
    expect(result.map((f) => f.id)).toEqual(["b", "c"]);
  });

  it("filters by cabin class", () => {
    const result = filterFlights(sample, { cabinClasses: ["business"] });
    expect(result.map((f) => f.id)).toEqual(["b"]);
  });

  it("combines filters with AND semantics", () => {
    const result = filterFlights(sample, { airlines: ["AA"], stops: [2] });
    expect(result.map((f) => f.id)).toEqual(["c"]);
  });
});

describe("sortFlights", () => {
  it("sorts by price ascending", () => {
    const result = sortFlights(sample, { field: "price", direction: "asc" });
    expect(result.map((f) => f.price)).toEqual([150, 220, 300]);
  });

  it("sorts by price descending", () => {
    const result = sortFlights(sample, { field: "price", direction: "desc" });
    expect(result.map((f) => f.price)).toEqual([300, 220, 150]);
  });

  it("sorts by duration ascending", () => {
    const result = sortFlights(sample, { field: "duration", direction: "asc" });
    expect(result.map((f) => f.durationMinutes)).toEqual([360, 480, 600]);
  });

  it("does not mutate the input array", () => {
    const input = [...sample];
    sortFlights(input, { field: "price", direction: "asc" });
    expect(input.map((f) => f.id)).toEqual(["a", "b", "c"]);
  });
});

describe("computeFacets", () => {
  it("aggregates airlines with counts", () => {
    const facets = computeFacets(sample);
    expect(facets.airlines).toEqual([
      { code: "AA", name: "American Airlines", count: 2 },
      { code: "DL", name: "Delta Air Lines", count: 1 },
    ]);
  });

  it("collects available stops sorted ascending", () => {
    expect(computeFacets(sample).stops).toEqual([0, 1, 2]);
  });

  it("computes the price range", () => {
    const facets = computeFacets(sample);
    expect(facets.priceMin).toBe(150);
    expect(facets.priceMax).toBe(300);
  });

  it("handles an empty list", () => {
    const facets = computeFacets([]);
    expect(facets.airlines).toEqual([]);
    expect(facets.priceMin).toBe(0);
    expect(facets.priceMax).toBe(0);
  });
});
