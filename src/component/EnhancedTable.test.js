import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EnhancedTable from "./EnhancedTable";

const columns = [
  { id: "name", label: "Name" },
  { id: "age", label: "Age" },
  { id: "purchaseDate", label: "Purchase Date" },
];

const rows = [
  { name: "Alice", age: 30, purchaseDate: "01/04/2023" },
  { name: "Bob", age: 25, purchaseDate: "15/03/2023" },
  { name: "Charlie", age: 35, purchaseDate: "10/05/2023" },
];

describe("EnhancedTable", () => {
  it("renders table with correct title and columns", () => {
    render(<EnhancedTable columns={columns} rows={rows} title="Test Table" />);
    expect(screen.getByText("Test Table")).toBeInTheDocument();
    columns.forEach((col) => {
      expect(screen.getByText(col.label)).toBeInTheDocument();
    });
  });

  it("renders all rows on first page", () => {
    render(<EnhancedTable columns={columns} rows={rows} title="Test Table" />);
    rows.forEach((row) => {
      expect(screen.getByText(row.name)).toBeInTheDocument();
    });
  });

  it("sorts by age column ascending and descending", () => {
    render(<EnhancedTable columns={columns} rows={rows} title="Test Table" />);
    const ageHeader = screen.getByText("Age");
    fireEvent.click(ageHeader); // sort asc
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Bob");
    fireEvent.click(ageHeader); // sort desc
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Charlie");
  });

  it("sorts by purchaseDate column correctly", () => {
    render(<EnhancedTable columns={columns} rows={rows} title="Test Table" />);
    const dateHeader = screen.getByText("Purchase Date");
    fireEvent.click(dateHeader); // sort asc
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Bob");
    fireEvent.click(dateHeader); // sort desc
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Charlie");
  });

  it("handles empty rows gracefully", () => {
    render(<EnhancedTable columns={columns} rows={[]} title="Empty Table" />);
    expect(screen.getByText("Empty Table")).toBeInTheDocument();
    expect(screen.queryAllByRole("row")).toHaveLength(1); // Only header row
  });
});
