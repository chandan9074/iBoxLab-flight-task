import { NextResponse } from "next/server";
import { computeFacets, filterFlights, sortFlights } from "@/lib/flight-query";
import { getRouteFlights } from "@/lib/flights-service";
import type {
  ApiErrorResponse,
  CabinClass,
  FlightFilters,
  FlightSearchResponse,
  SortField,
  SortOption,
} from "@/lib/types";

const VALID_SORT_FIELDS: SortField[] = [
  "price",
  "duration",
  "departureTime",
  "arrivalTime",
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const origin = searchParams.get("origin")?.trim().toUpperCase() ?? "";
  const destination =
    searchParams.get("destination")?.trim().toUpperCase() ?? "";
  const date = searchParams.get("date")?.trim() ?? "";
  const passengersRaw = searchParams.get("passengers") ?? "1";

  const details: Record<string, string> = {};
  if (!origin) details.origin = "Origin is required.";
  if (!destination) details.destination = "Destination is required.";
  if (origin && destination && origin === destination) {
    details.destination = "Destination must differ from origin.";
  }
  if (!date) details.date = "Date is required.";
  else if (!DATE_PATTERN.test(date)) details.date = "Date must be YYYY-MM-DD.";

  const passengers = Number(passengersRaw);
  if (!Number.isInteger(passengers) || passengers < 1 || passengers > 9) {
    details.passengers = "Passengers must be a whole number between 1 and 9.";
  }

  if (Object.keys(details).length > 0) {
    const body: ApiErrorResponse = { error: "Invalid search.", details };
    return NextResponse.json(body, { status: 400 });
  }

  // Lets the UI demonstrate its error state on demand.
  if (searchParams.get("simulate") === "error") {
    const body: ApiErrorResponse = {
      error: "Flight provider is temporarily unavailable. Please try again.",
    };
    return NextResponse.json(body, { status: 503 });
  }

  await delay(600);

  const filters: FlightFilters = {
    airlines: parseList(searchParams.get("airlines")),
    stops: parseList(searchParams.get("stops"))?.map(Number),
    cabinClasses: parseList(searchParams.get("cabinClasses")) as
      | CabinClass[]
      | undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
  };

  const sort: SortOption = {
    field: VALID_SORT_FIELDS.includes(searchParams.get("sortBy") as SortField)
      ? (searchParams.get("sortBy") as SortField)
      : "price",
    direction: searchParams.get("sortDir") === "desc" ? "desc" : "asc",
  };

  const routeMatches = getRouteFlights(origin, destination, date);

  const filtered = filterFlights(routeMatches, filters);
  const sorted = sortFlights(filtered, sort);

  const body: FlightSearchResponse = {
    flights: sorted,
    total: sorted.length,
    query: { origin, destination, date, passengers },
    facets: computeFacets(routeMatches),
  };
  return NextResponse.json(body);
}

function parseList(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
}
