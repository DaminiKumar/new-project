import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilteredCustomers from "./FilteredCustomers";
import log from "../utils/logger";
import TableContainer from "./TableContainer";

// ---------------- Mock DatePicker and Adapter ----------------
jest.mock("@mui/x-date-pickers", () => ({
  LocalizationProvider: ({ children }) => <div>{children}</div>,
  DatePicker: ({ label, value, onChange }) => (
    <input
      aria-label={label}
      value={value?.toISOString().split("T")[0] || ""}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));
jest.mock("@mui/x-date-pickers/AdapterDateFns", () => ({}));

// ---------------- Mock Logger ----------------
jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

// ---------------- Mock TableContainer ----------------
jest.mock("./TableContainer", () => ({ filteredCustomers }) => (
  <div data-testid="table-container">
    TableContainer with {filteredCustomers.length} rows
  </div>
));

// ---------------- Mock fetch data ----------------
const mockData = [
  {
    customerId: "C001",
    customerName: "Alice",
    transactionId: "T001",
    purchaseDate: "2025-01-15",
    product: "Product A",
    price: 120,
  },
  {
    customerId: "C002",
    customerName: "Bob",
    transactionId: "T002",
    purchaseDate: "2025-02-10",
    product: "Product B",
    price: 70,
  },
];

// ---------------- Mock today ----------------
const mockToday = new Date("2025-03-31T00:00:00Z");
beforeAll(() => {
  jest.useFakeTimers("modern");
  jest.setSystemTime(mockToday);
});

afterAll(() => {
  jest.useRealTimers();
});

// ---------------- Tests ----------------
beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockData),
    })
  );
});

describe("FilteredCustomers Component", () => {
  it("shows loading spinner initially", () => {
    render(<FilteredCustomers />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("fetches data and renders TableContainer", async () => {
    render(<FilteredCustomers />);
    const table = await screen.findByTestId("table-container");
    expect(table).toBeInTheDocument();
    expect(table).toHaveTextContent("TableContainer with 2 rows");
    expect(log.info).toHaveBeenCalledWith("Fetched customer data:", mockData);
  });

  it("handles fetch error correctly", async () => {
    global.fetch = jest.fn(() => Promise.reject("API error"));
    render(<FilteredCustomers />);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "Something went wrong, please try after some time"
    );
    expect(log.error).toHaveBeenCalled();
  });

  it("filters data correctly on button click", async () => {
    render(<FilteredCustomers />);
    await screen.findByTestId("table-container");

    const button = screen.getByRole("button", { name: /Filter/i });
    fireEvent.click(button);

    const table = await screen.findByTestId("table-container");
    expect(table).toHaveTextContent("TableContainer with 2 rows");
  });

  it("shows warning when no customers after filtering", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve([]) })
    );
    render(<FilteredCustomers />);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("No customer data is found");
  });
});
