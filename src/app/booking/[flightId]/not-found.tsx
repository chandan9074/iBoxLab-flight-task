import Link from "next/link";
import { Button } from "antd";

export default function BookingNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        Flight unavailable
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900">
        We couldn&apos;t find that flight
      </h1>
      <p className="mt-2 max-w-md text-zinc-600">
        The flight may no longer be available. Start a new search to see current
        options.
      </p>
      <Link href="/" className="mt-6">
        <Button type="primary">Search flights</Button>
      </Link>
    </main>
  );
}
