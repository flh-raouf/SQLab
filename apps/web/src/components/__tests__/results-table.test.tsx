import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultsTable } from "../results-table";

describe("ResultsTable", () => {
  it("shows 'no results' for empty query", () => {
    render(<ResultsTable columns={[]} rows={[]} />);
    expect(screen.getByText("Query returned no results.")).toBeInTheDocument();
  });

  it("shows affected rows message for non-SELECT queries", () => {
    render(<ResultsTable columns={[]} rows={[]} affectedRows={3} />);
    expect(
      screen.getByText(/Query executed successfully. 3 rows affected./),
    ).toBeInTheDocument();
  });

  it("uses singular for 1 affected row", () => {
    render(<ResultsTable columns={[]} rows={[]} affectedRows={1} />);
    expect(
      screen.getByText(/Query executed successfully. 1 row affected./),
    ).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(
      <ResultsTable
        columns={["id", "name"]}
        rows={[
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ]}
      />,
    );
    expect(screen.getByText("id")).toBeInTheDocument();
    expect(screen.getByText("name")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(
      <ResultsTable
        columns={["id", "name"]}
        rows={[{ id: 1, name: "Alice" }]}
      />,
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders NULL for null values", () => {
    render(
      <ResultsTable columns={["id", "name"]} rows={[{ id: 1, name: null }]} />,
    );
    expect(screen.getByText("NULL")).toBeInTheDocument();
  });

  it("renders NULL for undefined values", () => {
    render(
      <ResultsTable
        columns={["id", "name"]}
        rows={[{ id: 1, name: undefined }]}
      />,
    );
    expect(screen.getByText("NULL")).toBeInTheDocument();
  });

  it("shows row count footer", () => {
    render(<ResultsTable columns={["id"]} rows={[{ id: 1 }, { id: 2 }]} />);
    expect(screen.getByText("2 rows returned")).toBeInTheDocument();
  });

  it("uses singular for 1 row in footer", () => {
    render(<ResultsTable columns={["id"]} rows={[{ id: 1 }]} />);
    expect(screen.getByText("1 row returned")).toBeInTheDocument();
  });

  it("handles numeric 0 value (not NULL)", () => {
    render(<ResultsTable columns={["val"]} rows={[{ val: 0 }]} />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.queryByText("NULL")).not.toBeInTheDocument();
  });
});
