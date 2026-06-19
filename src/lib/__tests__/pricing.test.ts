import { computePricing } from "../pricing";
import type { Flight } from "../types";

const flight = {
  price: 200,
  currency: "USD",
} as Flight;

describe("computePricing", () => {
  it("computes fare, taxes (18%), and total per passenger count", () => {
    const pricing = computePricing(flight, 2);
    expect(pricing.farePerPassenger).toBe(200);
    expect(pricing.taxesPerPassenger).toBe(36);
    expect(pricing.fare).toBe(400);
    expect(pricing.taxes).toBe(72);
    expect(pricing.total).toBe(472);
  });

  it("carries the currency through", () => {
    expect(computePricing(flight, 1).currency).toBe("USD");
  });
});
