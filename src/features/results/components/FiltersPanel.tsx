"use client";

import { useState } from "react";
import { Button, Checkbox, Divider, Skeleton, Slider } from "antd";
import type { Facets, FlightFilters } from "@/lib/types";
import { CABIN_LABELS, formatPrice, formatStops } from "@/lib/format";

interface FiltersPanelProps {
  facets?: Facets;
  filters: FlightFilters;
  activeFilterCount: number;
  onFilterChange: (
    updates: Partial<Record<keyof FlightFilters, string[] | number | undefined>>,
  ) => void;
  onClear: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-zinc-900">{title}</h3>
      {children}
    </div>
  );
}

export function FiltersPanel({
  facets,
  filters,
  activeFilterCount,
  onFilterChange,
  onClear,
}: FiltersPanelProps) {
  // The committed "max price" filter (falls back to the upper bound when unset).
  const committedMax = filters.maxPrice ?? facets?.priceMax;
  // Local value so the thumb can move while dragging; committed on release.
  const [sliderValue, setSliderValue] = useState(committedMax);
  // Sync during render (instead of an effect) when the filter changes elsewhere
  // — e.g. "Clear all" or a new search resets the committed value.
  const [lastCommitted, setLastCommitted] = useState(committedMax);
  if (committedMax !== lastCommitted) {
    setLastCommitted(committedMax);
    setSliderValue(committedMax);
  }

  if (!facets) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900">Filters</h2>
        {activeFilterCount > 0 && (
          <Button type="link" size="small" onClick={onClear} className="px-0!">
            Clear all
          </Button>
        )}
      </div>

      <Divider className="my-4!" />

      <Section title="Airlines">
        <Checkbox.Group
          className="flex flex-col gap-2"
          value={filters.airlines ?? []}
          onChange={(values) =>
            onFilterChange({ airlines: values as string[] })
          }
          options={facets.airlines.map((a) => ({
            label: (
              <span className="flex w-full justify-between gap-3">
                <span>{a.name}</span>
                <span className="text-zinc-400">{a.count}</span>
              </span>
            ),
            value: a.code,
          }))}
        />
      </Section>

      <Divider className="my-4!" />

      <Section title="Stops">
        <Checkbox.Group
          className="flex flex-col gap-2"
          value={(filters.stops ?? []).map(String)}
          onChange={(values) => onFilterChange({ stops: values as string[] })}
          options={facets.stops.map((s) => ({
            label: formatStops(s),
            value: String(s),
          }))}
        />
      </Section>

      <Divider className="my-4!" />

      <Section title="Cabin">
        <Checkbox.Group
          className="flex flex-col gap-2"
          value={filters.cabinClasses ?? []}
          onChange={(values) =>
            onFilterChange({ cabinClasses: values as string[] })
          }
          options={facets.cabinClasses.map((c) => ({
            label: CABIN_LABELS[c],
            value: c,
          }))}
        />
      </Section>

      <Divider className="my-4!" />

      <Section title="Max price">
        <Slider
          min={facets.priceMin}
          max={facets.priceMax}
          value={sliderValue}
          tooltip={{ formatter: (v) => formatPrice(v ?? 0) }}
          onChange={(value) => setSliderValue(value as number)}
          onChangeComplete={(value) =>
            onFilterChange({
              maxPrice: value >= facets.priceMax ? undefined : value,
            })
          }
        />
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{formatPrice(facets.priceMin)}</span>
          <span className="font-medium text-zinc-900">
            Up to {formatPrice(sliderValue ?? facets.priceMax)}
          </span>
        </div>
      </Section>
    </div>
  );
}
