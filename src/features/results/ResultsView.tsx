"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge, Button, Drawer, Segmented } from "antd";
import {
  AppstoreOutlined,
  FilterOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { FlightCard } from "./FlightCard";
import { FlightTable } from "./FlightTable";
import { FiltersPanel } from "./FiltersPanel";
import { ResultsHeader } from "./ResultsHeader";
import { SortControl } from "./SortControl";
import { EmptyState, ErrorState, LoadingState } from "./ResultStates";
import { useFlightSearch } from "./useFlightSearch";
import { useResultsControls } from "./useResultsControls";

type View = "cards" | "table";

export function ResultsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, data, error, retry } = useFlightSearch();
  const controls = useResultsControls();

  const [view, setView] = useState<View>("cards");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const origin = searchParams.get("origin") ?? "";
  const destination = searchParams.get("destination") ?? "";
  const date = searchParams.get("date") ?? "";
  const passengers = Number(searchParams.get("passengers") ?? 1);

  function handleSelect(flightId: string) {
    router.push(`/booking/${flightId}?${searchParams.toString()}`);
  }

  const flights = data?.flights ?? [];

  const filtersPanel = (
    <FiltersPanel
      facets={data?.facets}
      filters={controls.filters}
      activeFilterCount={controls.activeFilterCount}
      onFilterChange={controls.setFilter}
      onClear={controls.clearFilters}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <ResultsHeader
        origin={origin}
        destination={destination}
        date={date}
        passengers={passengers}
        total={data?.total}
        loading={status === "loading"}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="hidden w-72 shrink-0 lg:block">{filtersPanel}</aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge count={controls.activeFilterCount} size="small" className="lg:hidden">
              <Button
                icon={<FilterOutlined />}
                onClick={() => setDrawerOpen(true)}
              >
                Filters
              </Button>
            </Badge>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <SortControl
                sortBy={controls.sortBy}
                sortDir={controls.sortDir}
                onChange={controls.setSort}
              />
              <Segmented<View>
                value={view}
                onChange={setView}
                options={[
                  { label: "Cards", value: "cards", icon: <AppstoreOutlined /> },
                  { label: "Table", value: "table", icon: <TableOutlined /> },
                ]}
              />
            </div>
          </div>

          {status === "loading" && <LoadingState />}

          {status === "error" && (
            <ErrorState
              message={error ?? "Something went wrong."}
              onRetry={retry}
            />
          )}

          {status === "success" && flights.length === 0 && (
            <EmptyState
              onReset={
                controls.activeFilterCount > 0 ? controls.clearFilters : undefined
              }
            />
          )}

          {status === "success" && flights.length > 0 && (
            <>
              {view === "cards" ? (
                <div className="flex flex-col gap-4">
                  {flights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      passengers={passengers}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              ) : (
                <FlightTable
                  flights={flights}
                  passengers={passengers}
                  onSelect={handleSelect}
                />
              )}
            </>
          )}
        </div>
      </div>

      <Drawer
        title="Filters"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={320}
      >
        {filtersPanel}
      </Drawer>
    </div>
  );
}
