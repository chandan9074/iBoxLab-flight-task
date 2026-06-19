import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlightCard } from "../FlightCard";
import type { Flight } from "@/lib/types";

const flight: Flight = {
  id: "JFK-LAX-1",
  airline: { code: "AA", name: "American Airlines" },
  flightNumber: "AA101",
  origin: { code: "JFK", city: "New York", name: "JFK" },
  destination: { code: "LAX", city: "Los Angeles", name: "LAX" },
  departureTime: "2026-07-20T08:00:00.000Z",
  arrivalTime: "2026-07-20T14:00:00.000Z",
  durationMinutes: 360,
  stops: 0,
  layoverAirports: [],
  price: 200,
  currency: "USD",
  cabinClass: "economy",
  seatsAvailable: 5,
  aircraft: "Boeing 737",
};

describe("FlightCard", () => {
  it("shows airline, flight number, times, and price", () => {
    render(<FlightCard flight={flight} passengers={1} onSelect={() => {}} />);
    expect(screen.getByText("American Airlines")).toBeInTheDocument();
    expect(screen.getByText("AA101")).toBeInTheDocument();
    expect(screen.getByText("08:00")).toBeInTheDocument();
    expect(screen.getByText("14:00")).toBeInTheDocument();
    expect(screen.getByText("$200")).toBeInTheDocument();
  });

  it("shows the total for multiple passengers", () => {
    render(<FlightCard flight={flight} passengers={2} onSelect={() => {}} />);
    expect(screen.getByText("$400 total")).toBeInTheDocument();
  });

  it("calls onSelect with the flight id when Select is clicked", async () => {
    const onSelect = jest.fn();
    render(<FlightCard flight={flight} passengers={1} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: /select/i }));
    expect(onSelect).toHaveBeenCalledWith("JFK-LAX-1");
  });
});
