"use client";

import { Select } from "antd";
import { SortAscendingOutlined } from "@ant-design/icons";
import type { SortDirection, SortField } from "@/lib/types";

interface SortControlProps {
  sortBy: SortField;
  sortDir: SortDirection;
  onChange: (sortBy: SortField, sortDir: SortDirection) => void;
}

const OPTIONS: { value: string; label: string }[] = [
  { value: "price:asc", label: "Price · Low to high" },
  { value: "price:desc", label: "Price · High to low" },
  { value: "duration:asc", label: "Duration · Shortest" },
  { value: "departureTime:asc", label: "Departure · Earliest" },
  { value: "arrivalTime:asc", label: "Arrival · Earliest" },
];

export function SortControl({ sortBy, sortDir, onChange }: SortControlProps) {
  return (
    <Select
      value={`${sortBy}:${sortDir}`}
      onChange={(value) => {
        const [field, dir] = value.split(":") as [SortField, SortDirection];
        onChange(field, dir);
      }}
      options={OPTIONS}
      prefix={<SortAscendingOutlined />}
      style={{ minWidth: 210 }}
      aria-label="Sort flights"
    />
  );
}
