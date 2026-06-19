import type { Flight } from "@/lib/types";

const TAX_RATE = 0.18;

export interface PriceBreakdown {
  passengers: number;
  farePerPassenger: number;
  taxesPerPassenger: number;
  fare: number;
  taxes: number;
  total: number;
  currency: string;
}

export function computePricing(flight: Flight, passengers: number): PriceBreakdown {
  const farePerPassenger = flight.price;
  const taxesPerPassenger = Math.round(flight.price * TAX_RATE);
  return {
    passengers,
    farePerPassenger,
    taxesPerPassenger,
    fare: farePerPassenger * passengers,
    taxes: taxesPerPassenger * passengers,
    total: (farePerPassenger + taxesPerPassenger) * passengers,
    currency: flight.currency,
  };
}
