"use client";

import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { AIRPORTS } from "@/data/flights";
import { formatDateLong } from "@/lib/date";

interface ResultsHeaderProps {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
  total?: number;
  loading: boolean;
}

function cityOf(code: string): string {
  return AIRPORTS.find((a) => a.code === code)?.city ?? code;
}

export function ResultsHeader({
  origin,
  destination,
  date,
  passengers,
  total,
  loading,
}: ResultsHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
      >
        <ArrowLeftOutlined /> New search
      </Link>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {cityOf(origin)} <span className="text-zinc-400">→</span>{" "}
          {cityOf(destination)}
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          {formatDateLong(date + "T00:00:00.000Z")} · {passengers}{" "}
          {passengers === 1 ? "passenger" : "passengers"}
          {!loading && typeof total === "number" && (
            <>
              {" · "}
              <span className="font-medium text-zinc-900">
                {total} {total === 1 ? "flight" : "flights"}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
