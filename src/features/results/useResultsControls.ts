"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { mergeQuery, parseListParam } from "@/lib/url";
import type { CabinClass, FlightFilters, SortField, SortDirection } from "@/lib/types";

export interface ResultsControls {
  sortBy: SortField;
  sortDir: SortDirection;
  filters: FlightFilters;
  activeFilterCount: number;
  setSort: (sortBy: SortField, sortDir: SortDirection) => void;
  setFilter: (
    updates: Partial<Record<keyof FlightFilters, string[] | number | undefined>>,
  ) => void;
  clearFilters: () => void;
}

const SORT_FIELDS: SortField[] = [
  "price",
  "duration",
  "departureTime",
  "arrivalTime",
];

export function useResultsControls(): ResultsControls {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortByRaw = searchParams.get("sortBy") as SortField | null;
  const sortBy = sortByRaw && SORT_FIELDS.includes(sortByRaw) ? sortByRaw : "price";
  const sortDir: SortDirection =
    searchParams.get("sortDir") === "desc" ? "desc" : "asc";

  const airlines = parseListParam(searchParams.get("airlines"));
  const stops = parseListParam(searchParams.get("stops")).map(Number);
  const cabinClasses = parseListParam(
    searchParams.get("cabinClasses"),
  ) as CabinClass[];
  const maxPriceRaw = searchParams.get("maxPrice");
  const maxPrice = maxPriceRaw ? Number(maxPriceRaw) : undefined;

  const filters: FlightFilters = { airlines, stops, cabinClasses, maxPrice };
  const activeFilterCount =
    airlines.length +
    stops.length +
    cabinClasses.length +
    (maxPrice != null ? 1 : 0);

  const navigate = useCallback(
    (updates: Record<string, string | number | string[] | null | undefined>) => {
      const query = mergeQuery(searchParams, updates);
      router.replace(`/search?${query}`, { scroll: false });
    },
    [router, searchParams],
  );

  const setSort = useCallback(
    (field: SortField, dir: SortDirection) =>
      navigate({ sortBy: field, sortDir: dir }),
    [navigate],
  );

  const setFilter = useCallback(
    (updates: Partial<Record<keyof FlightFilters, string[] | number | undefined>>) =>
      navigate(updates),
    [navigate],
  );

  const clearFilters = useCallback(
    () =>
      navigate({
        airlines: null,
        stops: null,
        cabinClasses: null,
        maxPrice: null,
      }),
    [navigate],
  );

  return {
    sortBy,
    sortDir,
    filters,
    activeFilterCount,
    setSort,
    setFilter,
    clearFilters,
  };
}
