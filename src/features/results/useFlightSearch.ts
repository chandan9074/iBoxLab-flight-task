"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError, fetchFlights } from "@/lib/api";
import type { FlightSearchResponse } from "@/lib/types";

type Status = "loading" | "success" | "error";

interface Settled {
  key: string;
  status: Exclude<Status, "loading">;
  data?: FlightSearchResponse;
  error?: string;
}

export function useFlightSearch() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const [reloadToken, setReloadToken] = useState(0);
  const [settled, setSettled] = useState<Settled | null>(null);

  const key = `${query}|${reloadToken}`;

  useEffect(() => {
    const controller = new AbortController();

    fetchFlights(query, controller.signal)
      .then((data) => setSettled({ key, status: "success", data }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        const message =
          error instanceof ApiError ? error.message : "Network error.";
        setSettled({ key, status: "error", error: message });
      });

    return () => controller.abort();
  }, [query, key]);

  const retry = useCallback(() => setReloadToken((token) => token + 1), []);

  // Until the in-flight request for the current key resolves, we are loading.
  if (!settled || settled.key !== key) {
    return { status: "loading" as const, retry };
  }

  return {
    status: settled.status,
    data: settled.data,
    error: settled.error,
    retry,
  };
}
