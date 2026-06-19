import type {
  CabinClass,
  Facets,
  Flight,
  FlightFilters,
  SortOption,
} from "@/lib/types";

export function computeFacets(flights: Flight[]): Facets {
  const airlineMap = new Map<string, { name: string; count: number }>();
  const stops = new Set<number>();
  const cabinClasses = new Set<CabinClass>();
  let priceMin = Infinity;
  let priceMax = 0;

  for (const flight of flights) {
    const existing = airlineMap.get(flight.airline.code);
    airlineMap.set(flight.airline.code, {
      name: flight.airline.name,
      count: (existing?.count ?? 0) + 1,
    });
    stops.add(flight.stops);
    cabinClasses.add(flight.cabinClass);
    priceMin = Math.min(priceMin, flight.price);
    priceMax = Math.max(priceMax, flight.price);
  }

  return {
    airlines: [...airlineMap.entries()]
      .map(([code, { name, count }]) => ({ code, name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    stops: [...stops].sort((a, b) => a - b),
    cabinClasses: [...cabinClasses],
    priceMin: Number.isFinite(priceMin) ? priceMin : 0,
    priceMax,
  };
}

export function filterFlights(
  flights: Flight[],
  filters: FlightFilters,
): Flight[] {
  return flights.filter((flight) => {
    if (filters.airlines?.length && !filters.airlines.includes(flight.airline.code)) {
      return false;
    }
    if (filters.stops?.length && !filters.stops.includes(flight.stops)) {
      return false;
    }
    if (filters.maxPrice != null && flight.price > filters.maxPrice) {
      return false;
    }
    if (
      filters.cabinClasses?.length &&
      !filters.cabinClasses.includes(flight.cabinClass)
    ) {
      return false;
    }
    return true;
  });
}

function valueForField(flight: Flight, field: SortOption["field"]): number {
  switch (field) {
    case "price":
      return flight.price;
    case "duration":
      return flight.durationMinutes;
    case "departureTime":
      return new Date(flight.departureTime).getTime();
    case "arrivalTime":
      return new Date(flight.arrivalTime).getTime();
  }
}

export function sortFlights(flights: Flight[], sort: SortOption): Flight[] {
  const direction = sort.direction === "desc" ? -1 : 1;
  return [...flights].sort((a, b) => {
    const diff = valueForField(a, sort.field) - valueForField(b, sort.field);
    if (diff !== 0) return diff * direction;
    return a.id.localeCompare(b.id);
  });
}
