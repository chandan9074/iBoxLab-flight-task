"use client";

import { Button, Tag } from "antd";
import { ArrowRightOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { Flight } from "@/lib/types";
import { formatDuration, formatTime } from "@/lib/date";
import { CABIN_LABELS, formatPrice, formatStops } from "@/lib/format";

interface FlightCardProps {
  flight: Flight;
  passengers: number;
  onSelect: (flightId: string) => void;
}

export function FlightCard({ flight, passengers, onSelect }: FlightCardProps) {
  const total = flight.price * passengers;

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-3 sm:w-44">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
              {flight.airline.code}
            </span>
            <div className="leading-tight">
              <p className="font-medium text-zinc-900">{flight.airline.name}</p>
              <p className="text-xs text-zinc-500">{flight.flightNumber}</p>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-3 sm:gap-5">
            <div className="text-center">
              <p className="text-xl font-semibold tabular-nums text-zinc-900">
                {formatTime(flight.departureTime)}
              </p>
              <p className="text-xs font-medium text-zinc-500">
                {flight.origin.code}
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center gap-1">
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <ClockCircleOutlined />
                {formatDuration(flight.durationMinutes)}
              </span>
              <div className="flex w-full items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border-2 border-zinc-400" />
                <span className="h-px flex-1 bg-zinc-300" />
                <ArrowRightOutlined className="text-zinc-400" />
                <span className="h-2 w-2 rounded-full bg-brand-500" />
              </div>
              <span className="text-xs font-medium text-zinc-500">
                {flight.stops === 0
                  ? "Non-stop"
                  : `${formatStops(flight.stops)} · ${flight.layoverAirports.join(", ")}`}
              </span>
            </div>

            <div className="text-center">
              <p className="text-xl font-semibold tabular-nums text-zinc-900">
                {formatTime(flight.arrivalTime)}
              </p>
              <p className="text-xs font-medium text-zinc-500">
                {flight.destination.code}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-zinc-100 pt-4 lg:w-52 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="flex flex-col items-start lg:items-end">
            <Tag color="blue" className="!mr-0 !mb-1">
              {CABIN_LABELS[flight.cabinClass]}
            </Tag>
            <p className="text-2xl font-bold tracking-tight text-zinc-900">
              {formatPrice(flight.price, flight.currency)}
            </p>
            <p className="text-xs text-zinc-500">
              {passengers > 1
                ? `${formatPrice(total, flight.currency)} total`
                : "per passenger"}
            </p>
          </div>
          <Button type="primary" onClick={() => onSelect(flight.id)}>
            Select
          </Button>
        </div>
      </div>
    </article>
  );
}
