import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EnhancedTable from "./EnhancedTable";

describe("EnhancedTable Component", () => {
  const columns = [
    { id: "id", label: "ID" },
    { id: "name", label: "Name" },
    { id: "score", label: "Score" },
  ];

  const rows = [
    { id: 1, name: "Alice", score: 50 },
    { id: 2, name: "Bob", score: 70 },
    { id: 3, name: "Charlie", score: 40 },
    { id: 4, name: "David", score: 90 },
    { id: 5, name: "Eve", score: 60 },
    { id: 6, name: "Frank", score: 80 },
  ];

  it("renders table with correct title and headers", () => {
    render(<EnhancedTable columns={columns} rows={rows} title="Test Table" />);

    expect(screen.getByText("Test Table")).toBeInTheDocument();
    columns.forEach((col) => {
      expect(screen.getByText(col.label)).toBeInTheDocument();
    });
  });

  it("renders correct number of rows per page", () => {
    render(<EnhancedTable columns={columns} rows={rows} title="Test Table" />);

    // Default rows per page is 5
    expect(screen.getAllByRole("row")).toHaveLength(6); // 5 rows + 1 header row
  });

  it("sorts rows when clicking on a column header", () => {
    render(<EnhancedTable columns={columns} rows={rows} title="Test Table" />);

    const scoreHeader = screen.getByText("Score");
    fireEvent.click(scoreHeader); // first click: ascending
    const firstRowScore = screen.getAllByRole("row")[1].cells[2].textContent;
    expect(Number(firstRowScore)).toBe(40); // Charlie's score

    fireEvent.click(scoreHeader); // second click: descending
    const firstRowScoreDesc =
      screen.getAllByRole("row")[1].cells[2].textContent;
    expect(Number(firstRowScoreDesc)).toBe(90); // David's score
  });

  // it("changes page correctly using pagination", () => {
  //   render(<EnhancedTable columns={columns} rows={rows} title="Test Table" />);

  //   const nextButton = screen.getByLabelText("Go to next page");
  //   fireEvent.click(nextButton);

  //   // After clicking next page, only one row remains (6th row)
  //   const rowsOnPage2 = screen.getAllByRole("row");
  //   expect(rowsOnPage2).toHaveLength(2); // 1 row + 1 header row
  //   expect(screen.getByText("Frank")).toBeInTheDocument();
  // });

  // it("changes rows per page correctly", async () => {
  //   render(<EnhancedTable columns={columns} rows={rows} title="Test Table" />);

  //   const user = userEvent.setup();

  //   // open the select
  //   const selectButton = screen.getByRole("button", { name: /rows per page/i });
  //   await user.click(selectButton);

  //   // select the option 10
  //   const option10 = screen.getByRole("option", { name: "10" });
  //   await user.click(option10);

  //   // all rows should now be visible (6 rows + 1 header)
  //   const allRows = screen.getAllByRole("row");
  //   expect(allRows).toHaveLength(7);
  // });
});
