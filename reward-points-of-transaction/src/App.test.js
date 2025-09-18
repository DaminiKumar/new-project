import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the FilteredCustomers component to isolate the test
jest.mock("./component/FilteredCustomers", () => () => {
  return (
    <div data-testid="filtered-customers">FilteredCustomers Component</div>
  );
});

describe("App Component", () => {
  it("renders the FilteredCustomers component", () => {
    render(<App />);
    const filteredCustomersElement = screen.getByTestId("filtered-customers");
    expect(filteredCustomersElement).toBeInTheDocument();
  });
});
