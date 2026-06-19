"use client";

import { Button, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Flight } from "@/lib/types";
import { formatDuration, formatTime } from "@/lib/date";
import { CABIN_LABELS, formatPrice, formatStops } from "@/lib/format";

interface FlightTableProps {
  flights: Flight[];
  passengers: number;
  onSelect: (flightId: string) => void;
}

export function FlightTable({ flights, passengers, onSelect }: FlightTableProps) {
  const columns: ColumnsType<Flight> = [
    {
      title: "Airline",
      dataIndex: ["airline", "name"],
      render: (_, flight) => (
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
            {flight.airline.code}
          </span>
          <div className="leading-tight">
            <p className="font-medium text-zinc-900">{flight.airline.name}</p>
            <p className="text-xs text-zinc-500">{flight.flightNumber}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Departure",
      render: (_, f) => (
        <span className="tabular-nums">
          {formatTime(f.departureTime)} · {f.origin.code}
        </span>
      ),
    },
    {
      title: "Arrival",
      render: (_, f) => (
        <span className="tabular-nums">
          {formatTime(f.arrivalTime)} · {f.destination.code}
        </span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "durationMinutes",
      render: (minutes: number) => formatDuration(minutes),
    },
    {
      title: "Stops",
      dataIndex: "stops",
      render: (stops: number) => (
        <Tag color={stops === 0 ? "green" : "default"}>{formatStops(stops)}</Tag>
      ),
    },
    {
      title: "Cabin",
      dataIndex: "cabinClass",
      render: (cabin: Flight["cabinClass"]) => (
        <Tag color="blue">{CABIN_LABELS[cabin]}</Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      align: "right",
      render: (price: number, f) => (
        <div className="leading-tight">
          <p className="font-semibold text-zinc-900">
            {formatPrice(price, f.currency)}
          </p>
          {passengers > 1 && (
            <p className="text-xs text-zinc-500">
              {formatPrice(price * passengers, f.currency)} total
            </p>
          )}
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      align: "right",
      render: (_, f) => (
        <Button type="primary" size="small" onClick={() => onSelect(f.id)}>
          Select
        </Button>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={flights}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      scroll={{ x: "max-content" }}
    />
  );
}
