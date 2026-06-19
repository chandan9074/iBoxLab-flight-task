import { notFound } from "next/navigation";
import { BookingFlow } from "@/features/booking/components/BookingFlow";
import { getFlightById } from "@/lib/flights-service";
import { todayISO } from "@/lib/date";
import { MAX_PASSENGERS, MIN_PASSENGERS } from "@/lib/search-params";

function clampPassengers(value: number): number {
  if (!Number.isInteger(value)) return MIN_PASSENGERS;
  return Math.min(MAX_PASSENGERS, Math.max(MIN_PASSENGERS, value));
}

function buildResultsHref(
  sp: Record<string, string | string[] | undefined>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") query.set(key, value);
  }
  const qs = query.toString();
  return qs ? `/search?${qs}` : "/";
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ flightId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { flightId } = await params;
  const sp = await searchParams;

  const date = typeof sp.date === "string" ? sp.date : todayISO();
  const passengers = clampPassengers(Number(sp.passengers ?? 1));

  const flight = getFlightById(flightId, date);
  if (!flight) notFound();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <BookingFlow
        flight={flight}
        passengers={passengers}
        backToResultsHref={buildResultsHref(sp)}
      />
    </main>
  );
}
