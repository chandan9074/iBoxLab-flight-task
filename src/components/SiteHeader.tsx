import Link from "next/link";
import { PlaneTakeoff } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <PlaneTakeoff className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-zinc-900">
            SkyFare
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link href="/" className="hover:text-zinc-900">
            Search
          </Link>
          <span className="hidden text-zinc-300 sm:inline">|</span>
          <span className="hidden sm:inline">Demo · iBoxLab Assignment</span>
        </nav>
      </div>
    </header>
  );
}
