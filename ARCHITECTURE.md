# Architecture

This document explains how the app is structured and **why** each decision was
made.

## Guiding principles

1. **Separate responsibilities.** Framework-agnostic logic lives in `lib/` and
   knows nothing about React or Next.js. UI lives in `components/` and
   `features/`. This keeps logic easy to test and reason about.
2. **Keep state where it belongs.** Different kinds of state have different
   homes (see below) instead of one global store for everything.
3. **Prefer the simple, obvious implementation.** Plain functions and a static
   JSON dataset over clever abstractions.

## Layers

```
data/        Static mock dataset (flights.json) + reference lists
lib/         Types + pure logic: filtering, sorting, facets, validation, pricing
app/api/     Mock REST endpoint (the "backend")
features/    Feature UI: search, results, booking
components/   Shared UI (header)
app/         Routes that compose features
```

The dependency direction is one-way: `app` and `features` depend on `lib`,
never the reverse.

### Inside a feature

A feature folder groups its own pieces so each kind of file has an obvious
home, and a feature can be read (or moved) as a self-contained unit:

```
features/results/
  components/   UI components (FlightCard, FiltersPanel, ResultsView, …)
  hooks/        Stateful logic (useFlightSearch, useResultsControls)
  __tests__/    Tests for this feature
```

The rule is **fold by kind once there's more than one file of that kind** —
`results` has many components and two hooks, so both get a folder; `booking`
has several components and no hooks, so it has only `components/`; `search` is a
single component and stays flat (a folder for one file just adds nesting). `lib`
stays flat for the same reason — it's a set of small, peer utility modules, not
a hierarchy.

## State management

The brief asks for a deliberate state strategy. Rather than reach for a single
global store, state is placed according to its nature:

| State | Where it lives | Why |
| --- | --- | --- |
| Search, filters, sort | **URL query string** | Shareable, bookmarkable, survives refresh, and the back button works — exactly how real flight sites behave. |
| Flight results (server state) | **`useFlightSearch` hook** | Owns fetching, loading/error/empty status, and request cancellation. |
| Booking draft (passengers, payment) | **Local component state** in the booking flow | Ephemeral and scoped to one flow; you don't bookmark a half-filled form, and nothing else in the app needs it. |
| Ant Design theme | **`ConfigProvider`** in `providers.tsx` | Cross-cutting UI concern. |

The key payoff: because search/filter/sort live in the URL, the data hook only
depends on the URL string. Adding a filter writes to the URL, and the hook
re-fetches automatically — the layers are decoupled.

## Data flow

```
SearchForm ──(validate)──▶ URL: /search?origin=…&sortBy=…
                                  │
                                  ▼
                        useFlightSearch (reads URL)
                                  │  fetch /api/flights?…
                                  ▼
                          GET /api/flights
                    (validate → getRouteFlights → filter → sort → facets)
                                  │
                                  ▼
                ResultsView → FlightCard / FlightTable
                                  │  Select
                                  ▼
              /booking/[flightId]  (server component, direct data access)
                                  │
                                  ▼
        BookingFlow:  Review → PassengerForm → ConfirmationStep
```

### Client vs server fetching — a deliberate contrast

- The **results page fetches on the client** (`useFlightSearch`) because it
  needs interactive loading/error states and re-fetches as filters change.
- The **booking page fetches on the server** (direct call to the data service)
  because the review screen is static once loaded — no spinner needed, and it
  renders instantly.

Both read flight data through a single service module
([`lib/flights-service.ts`](src/lib/flights-service.ts)) so the API route and
the booking page can't drift apart.

## Filtering, sorting, and facets

- `filterFlights` and `sortFlights` are pure functions used by both the API and
  the tests — one source of truth.
- **Facets** (available airlines, stops, cabins, price range) are computed from
  the route's flights **before** filters are applied. If they were computed from
  the filtered list, selecting one airline would erase the others from the
  filter panel. Computing them up front keeps all options visible.

## Booking flow

A single route (`/booking/[flightId]`) drives a three-step flow with an Ant
Design `Steps` indicator:

1. **Review** — itinerary + price summary.
2. **Passenger details** — contact info, one block per passenger, and a mock
   payment section. Validation uses Ant Design `Form` rules plus small pure
   validators (`isValidCardNumber`, `isValidExpiry`) that are unit-tested.
3. **Confirmation** — booking reference, passenger list, printable summary.

Pricing is computed by `computePricing` (base fare + 18% taxes × passengers),
shared across the review and confirmation screens.

## UI states

The results experience explicitly handles all three required states:

- **Loading** — skeleton placeholders (better perceived performance than a spinner).
- **Empty** — a clear "no matches" message with a way to clear filters.
- **Error** — an error panel with a retry button (driven by the API's `503` path).

## Styling

Tailwind handles layout, spacing, and the marketing/hero sections; Ant Design
provides the interactive components (forms, table, steps, slider, drawer). The
Ant Design theme's primary color is set to the brand color so the two systems
stay visually consistent.

## Testing

- **Unit tests** cover the pure logic: filtering, sorting, facets, search
  validation, URL merging, pricing, and booking validation.
- **Component tests** (React Testing Library) cover user-facing behavior:
  flight cards render the right data and fire selection, and the result states
  render and retry.
- The runner is **Jest** via [`next/jest`](jest.config.ts), which uses the
  Next.js SWC transform (no Babel/ts-jest config), mocks CSS/image imports, and
  runs every test in a jsdom environment. Custom matchers and DOM globals
  (`matchMedia`, `ResizeObserver`) are registered in [`jest.setup.ts`](jest.setup.ts).
- **File layout:** each test lives in a `__tests__/` folder beside its source
  (e.g. `lib/__tests__/pricing.test.ts`, `features/results/__tests__/FlightCard.test.tsx`).
  This groups tests per feature while keeping them one hop from the code they
  cover. Jest discovers them via the `testMatch` glob, so new tests just need to
  go in the matching feature's `__tests__/` folder.

## Possible improvements

- Swap the custom data hook for a caching library (TanStack Query / SWR) if the
  app grew real endpoints.
- Add pagination (the API already returns a `total`).
- Persist the booking draft (e.g. `sessionStorage`) so a refresh mid-flow is
  recoverable.
- Round-trip and multi-city search; real authentication and payments.
