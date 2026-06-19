import type { Airline, Airport, Flight } from "@/lib/types";
import flightsData from "./flights.json";

export const FLIGHTS = flightsData as Flight[];

export const AIRPORTS: Airport[] = [
  { code: "JFK", city: "New York", name: "John F. Kennedy International" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International" },
  { code: "ORD", city: "Chicago", name: "O'Hare International" },
  { code: "MIA", city: "Miami", name: "Miami International" },
  { code: "SEA", city: "Seattle", name: "Seattle-Tacoma International" },
];

export const AIRLINES: Airline[] = [
  { code: "AA", name: "American Airlines" },
  { code: "DL", name: "Delta Air Lines" },
  { code: "UA", name: "United Airlines" },
  { code: "B6", name: "JetBlue Airways" },
  { code: "AS", name: "Alaska Airlines" },
  { code: "WN", name: "Southwest Airlines" },
];
