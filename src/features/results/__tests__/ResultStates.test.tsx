import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState, ErrorState } from "../ResultStates";

describe("ErrorState", () => {
  it("shows the error message and retries on click", async () => {
    const onRetry = jest.fn();
    render(<ErrorState message="Provider unavailable" onRetry={onRetry} />);
    expect(screen.getByText("Provider unavailable")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe("EmptyState", () => {
  it("tells the user no flights matched", () => {
    render(<EmptyState />);
    expect(
      screen.getByText("No flights match your search"),
    ).toBeInTheDocument();
  });
});
