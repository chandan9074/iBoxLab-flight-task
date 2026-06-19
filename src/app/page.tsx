import { ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { HeroBackground } from "@/components/HeroBackground";
import { SearchForm } from "@/features/search/SearchForm";
import { todayISO } from "@/lib/date";

const HIGHLIGHTS = [
  {
    icon: Wallet,
    title: "Compare every fare",
    body: "Sort by price, duration, or departure across all carriers at once.",
  },
  {
    icon: Sparkles,
    title: "Filter to fit",
    body: "Narrow by airline, stops, cabin, and budget in a couple of clicks.",
  },
  {
    icon: ShieldCheck,
    title: "Book with confidence",
    body: "Review the full itinerary before you confirm — no surprises.",
  },
];

export default function Home() {
  const today = todayISO();

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-linear-to-br from-brand-700 via-brand-600 to-brand-800">
        <HeroBackground />
        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-16 sm:px-6 sm:pt-24">
          <p className="text-sm font-medium uppercase tracking-wider text-brand-100">
            Find your flight
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Search, compare, and book flights in one place.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-brand-100">
            One simple search across airlines, sorted and filtered the way you
            want.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-20 max-w-6xl px-4 sm:px-6">
        <SearchForm
          today={today}
          defaults={{ origin: "JFK", destination: "LAX", passengers: 1 }}
        />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-zinc-900">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
