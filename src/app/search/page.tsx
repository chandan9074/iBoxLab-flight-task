import { Suspense } from "react";
import Link from "next/link";
import { Button } from "antd";
import { ResultsView } from "@/features/results/components/ResultsView";
import { LoadingState } from "@/features/results/components/ResultStates";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const hasSearch = params.origin && params.destination && params.date;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      {hasSearch ? (
        <Suspense fallback={<LoadingState />}>
          <ResultsView />
        </Suspense>
      ) : (
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
          <h1 className="text-xl font-semibold text-zinc-900">
            Start a flight search
          </h1>
          <p className="mt-2 text-zinc-600">
            Tell us where and when you want to fly.
          </p>
          <Link href="/" className="mt-6 inline-block">
            <Button type="primary">Go to search</Button>
          </Link>
        </div>
      )}
    </main>
  );
}
