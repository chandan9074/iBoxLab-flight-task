import type { SearchParams } from "@/lib/types";

export type SearchInput = {
  origin?: string;
  destination?: string;
  date?: string;
  passengers?: string | number;
};

export type SearchErrors = Partial<Record<keyof SearchParams, string>>;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const MIN_PASSENGERS = 1;
export const MAX_PASSENGERS = 9;

export function validateSearch(
  input: SearchInput,
  today?: string,
): SearchErrors {
  const errors: SearchErrors = {};
  const origin = input.origin?.trim().toUpperCase() ?? "";
  const destination = input.destination?.trim().toUpperCase() ?? "";
  const date = input.date?.trim() ?? "";
  const passengers = Number(input.passengers);

  if (!origin) errors.origin = "Select an origin.";
  if (!destination) errors.destination = "Select a destination.";
  if (origin && destination && origin === destination) {
    errors.destination = "Destination must differ from origin.";
  }

  if (!date) {
    errors.date = "Choose a departure date.";
  } else if (!DATE_PATTERN.test(date)) {
    errors.date = "Use the format YYYY-MM-DD.";
  } else if (today && date < today) {
    errors.date = "Date cannot be in the past.";
  }

  if (
    !Number.isInteger(passengers) ||
    passengers < MIN_PASSENGERS ||
    passengers > MAX_PASSENGERS
  ) {
    errors.passengers = `Enter 1–${MAX_PASSENGERS} passengers.`;
  }

  return errors;
}

export function toSearchQuery(params: SearchParams): string {
  const query = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    date: params.date,
    passengers: String(params.passengers),
  });
  return query.toString();
}

export function parseSearchInput(input: SearchInput): SearchParams | null {
  if (Object.keys(validateSearch(input)).length > 0) return null;
  return {
    origin: String(input.origin).trim().toUpperCase(),
    destination: String(input.destination).trim().toUpperCase(),
    date: String(input.date).trim(),
    passengers: Number(input.passengers),
  };
}
