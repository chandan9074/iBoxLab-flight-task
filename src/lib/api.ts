import type { FlightSearchResponse } from "@/lib/types";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function fetchFlights(
  query: string,
  signal?: AbortSignal,
): Promise<FlightSearchResponse> {
  const res = await fetch(`/api/flights?${query}`, { signal });
  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      body?.error ?? "We couldn't load flights right now. Please try again.";
    throw new ApiError(message, res.status);
  }

  return body as FlightSearchResponse;
}
