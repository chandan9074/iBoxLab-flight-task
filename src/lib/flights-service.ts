import { FLIGHTS } from "@/data/flights";
import type { Flight } from "@/lib/types";

// Seed data lives on a fixed date; shift a flight onto the requested date
// while preserving its time-of-day.
export function rebaseToDate(flight: Flight, date: string): Flight {
  const shift = (iso: string) => `${date}T${iso.split("T")[1]}`;
  return {
    ...flight,
    departureTime: shift(flight.departureTime),
    arrivalTime: shift(flight.arrivalTime),
  };
}

export function getRouteFlights(
  origin: string,
  destination: string,
  date: string,
): Flight[] {
  return FLIGHTS.filter(
    (f) => f.origin.code === origin && f.destination.code === destination,
  ).map((f) => rebaseToDate(f, date));
}

export function getFlightById(id: string, date: string): Flight | null {
  const flight = FLIGHTS.find((f) => f.id === id);
  return flight ? rebaseToDate(flight, date) : null;
}
