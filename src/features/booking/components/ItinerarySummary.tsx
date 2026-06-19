import { Tag } from "antd";
import type { Flight } from "@/lib/types";
import { formatDateLong, formatDuration, formatTime } from "@/lib/date";
import { CABIN_LABELS, formatStops } from "@/lib/format";

export function ItinerarySummary({ flight }: { flight: Flight }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
            {flight.airline.code}
          </span>
          <div>
            <p className="font-semibold text-zinc-900">{flight.airline.name}</p>
            <p className="text-xs text-zinc-500">
              {flight.flightNumber} · {flight.aircraft}
            </p>
          </div>
        </div>
        <Tag color="blue">{CABIN_LABELS[flight.cabinClass]}</Tag>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div>
          <p className="text-2xl font-bold tabular-nums text-zinc-900">
            {formatTime(flight.departureTime)}
          </p>
          <p className="text-sm font-medium text-zinc-700">{flight.origin.code}</p>
          <p className="text-xs text-zinc-500">{flight.origin.city}</p>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1">
          <span className="text-xs text-zinc-500">
            {formatDuration(flight.durationMinutes)}
          </span>
          <div className="flex w-full items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border-2 border-zinc-400" />
            <span className="h-px flex-1 bg-zinc-300" />
            <span className="h-2 w-2 rounded-full bg-brand-500" />
          </div>
          <span className="text-xs font-medium text-zinc-500">
            {flight.stops === 0
              ? "Non-stop"
              : `${formatStops(flight.stops)} · ${flight.layoverAirports.join(", ")}`}
          </span>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums text-zinc-900">
            {formatTime(flight.arrivalTime)}
          </p>
          <p className="text-sm font-medium text-zinc-700">
            {flight.destination.code}
          </p>
          <p className="text-xs text-zinc-500">{flight.destination.city}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
        {formatDateLong(flight.departureTime)} · {flight.seatsAvailable} seats left
        at this price
      </div>
    </div>
  );
}
