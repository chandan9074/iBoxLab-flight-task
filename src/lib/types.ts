export interface Airport {
  code: string;
  city: string;
  name: string;
}

export interface Airline {
  code: string;
  name: string;
}

export type CabinClass = "economy" | "premium_economy" | "business" | "first";

export interface Flight {
  id: string;
  airline: Airline;
  flightNumber: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stops: number;
  layoverAirports: string[];
  price: number;
  currency: string;
  cabinClass: CabinClass;
  seatsAvailable: number;
  aircraft: string;
}

export interface SearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

export type SortField = "price" | "duration" | "departureTime" | "arrivalTime";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export interface FlightFilters {
  airlines?: string[];
  stops?: number[];
  maxPrice?: number;
  cabinClasses?: CabinClass[];
}

export interface AirlineFacet {
  code: string;
  name: string;
  count: number;
}

export interface Facets {
  airlines: AirlineFacet[];
  stops: number[];
  cabinClasses: CabinClass[];
  priceMin: number;
  priceMax: number;
}

export interface FlightSearchResponse {
  flights: Flight[];
  total: number;
  query: SearchParams;
  facets: Facets;
}

export interface ApiErrorResponse {
  error: string;
  details?: Record<string, string>;
}

export interface ContactDetails {
  email: string;
  phone: string;
}

export interface PassengerDetails {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface BookingConfirmation {
  reference: string;
  createdAt: string;
  flight: Flight;
  contact: ContactDetails;
  passengers: PassengerDetails[];
}
