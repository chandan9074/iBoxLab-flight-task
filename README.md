# Flight Search Aggregator

A flight search and booking experience built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Ant Design 6**, and **Tailwind CSS v4**.

Users search for flights, filter and sort the results, select a flight, review it, and complete a booking — with loading, empty, and error states handled throughout.

> Mock data only. No real backend, no real payments.

## Features

- **Search** by origin, destination, date, and passenger count, with client-side validation.
- **Results** shown as cards or an Ant Design table (user-toggleable), fully responsive.
- **Sort** by price, duration, departure, or arrival.
- **Filter** by airline, stops, cabin class, and max price.
- **State handling** for loading (skeletons), empty (no matches), and error (with retry) conditions.
- **Booking flow** with a stepper: review → passenger details → confirmation.
- **Validation & feedback** on the booking form (contact, passengers, and a mock payment section).
- **Booking confirmation** with a reference number and printable summary.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI library | React 19 |
| Language | TypeScript (strict) |
| Components | Ant Design 6 |
| Styling / layout | Tailwind CSS v4 |
| Icons | Ant Design Icons + lucide-react |
| Testing | Jest + React Testing Library |

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or the port shown in the terminal).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with ESLint |
| `npm run test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Mock API

The app talks to a mock REST endpoint implemented as a Next.js Route Handler at
[`src/app/api/flights/route.ts`](src/app/api/flights/route.ts). It reads from a
static dataset ([`src/data/flights.json`](src/data/flights.json), 56 flights
across three routes) and supports:

```
GET /api/flights?origin=JFK&destination=LAX&date=2026-07-20&passengers=2
    &airlines=AA,DL&stops=0&maxPrice=400&cabinClasses=economy
    &sortBy=price&sortDir=asc
```

- Validates the query and returns **400** with field-level errors for bad input.
- Returns **filtered + sorted** flights plus **facets** (available airlines, stops, cabins, price range) for the route.
- Adds a small artificial delay so loading states are visible.
- `&simulate=error` returns **503** to demonstrate the error state.

## Project structure

```
src/
├─ app/                      Routes (App Router)
│  ├─ page.tsx               Home — hero + search form
│  ├─ search/page.tsx        Results page
│  ├─ booking/[flightId]/    Booking flow + not-found
│  ├─ api/flights/route.ts   Mock API
│  ├─ providers.tsx          Ant Design theme provider
│  └─ layout.tsx             Root layout (header, footer)
├─ components/               Shared presentational components
├─ features/                 Each feature groups its own components/hooks/tests
│  ├─ search/
│  │  └─ SearchForm.tsx      Single component — kept flat
│  ├─ results/
│  │  ├─ components/         Results list, filters, sort, state views
│  │  ├─ hooks/              useFlightSearch, useResultsControls
│  │  └─ __tests__/          Component tests for this feature
│  └─ booking/
│     └─ components/         Review, passenger form, confirmation
├─ lib/                      Framework-agnostic logic + types (flat module folder)
└─ data/                     Mock dataset
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the design decisions behind this structure.

## Testing

Tests use Jest and React Testing Library. Pure logic (filtering, sorting,
validation, pricing) is unit-tested; key UI behavior (flight cards, result
states) is tested with RTL.

```bash
npm run test
```
