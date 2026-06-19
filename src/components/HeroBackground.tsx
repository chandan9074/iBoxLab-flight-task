import { Plane, PlaneTakeoff } from "lucide-react";

/**
 * Decorative, animated backdrop for the home hero. Purely presentational —
 * marked aria-hidden and non-interactive so it never affects the search form
 * sitting above it. Animations are defined as Tailwind theme tokens in
 * globals.css and respect prefers-reduced-motion.
 */
export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* dotted grid texture */}
      <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_center,white_1px,transparent_1.5px)] bg-size-[30px_30px]" />
      {/* soft floating glow orbs */}
      <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl animate-float" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl animate-float-slow" />
      {/* top highlight sweep */}
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(60rem_30rem_at_70%_-10%,white,transparent)]" />

      {/* dotted flight path with an animated trail */}
      <svg
        className="absolute right-0 top-8 h-56 w-2/3 text-white/40 sm:top-12 sm:h-72"
        viewBox="0 0 400 200"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M8 188 Q 170 30 392 86"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
          className="animate-dash"
        />
        <circle cx="8" cy="188" r="4" fill="currentColor" />
      </svg>

      {/* drifting plane following the sky */}
      <Plane className="absolute left-0 top-24 h-7 w-7 -rotate-12 text-white/70 animate-drift" />
      {/* gently floating plane near the headline area */}
      <PlaneTakeoff className="absolute right-10 top-16 h-10 w-10 text-white/25 animate-float sm:right-24" />

      {/* twinkling accents */}
      <span className="absolute left-[18%] top-12 h-1.5 w-1.5 rounded-full bg-white animate-twinkle" />
      <span
        className="absolute left-[42%] top-24 h-1 w-1 rounded-full bg-white animate-twinkle"
        style={{ animationDelay: "1.2s" }}
      />
      <span
        className="absolute right-[30%] top-32 h-1.5 w-1.5 rounded-full bg-white animate-twinkle"
        style={{ animationDelay: "2.4s" }}
      />
    </div>
  );
}
