import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValidationFeedback } from "../validation-feedback";

describe("ValidationFeedback", () => {
  it("shows correct message when passed=true", () => {
    render(<ValidationFeedback passed={true} />);
    expect(screen.getByText("Correct!")).toBeInTheDocument();
  });

  it("shows row count when correct with result", () => {
    render(
      <ValidationFeedback
        passed={true}
        result={{
          columns: ["id"],
          rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
        }}
      />,
    );
    expect(screen.getByText(/3 rows/)).toBeInTheDocument();
  });

  it("labels the first matched solution as teacher solution", () => {
    render(<ValidationFeedback passed={true} matchedSolutionIndex={1} />);
    expect(screen.getByText("Matched: Teacher solution")).toBeInTheDocument();
  });

  it("labels later matched solutions as alternatives", () => {
    render(<ValidationFeedback passed={true} matchedSolutionIndex={3} />);
    expect(
      screen.getByText("Matched: Alternative solution 2"),
    ).toBeInTheDocument();
  });

  it("uses singular row when count is 1", () => {
    render(
      <ValidationFeedback
        passed={true}
        result={{ columns: ["id"], rows: [{ id: 1 }] }}
      />,
    );
    expect(screen.getByText(/1 row/)).toBeInTheDocument();
  });

  it("shows incorrect without diff details", () => {
    render(<ValidationFeedback passed={false} />);
    expect(screen.getByText("Incorrect")).toBeInTheDocument();
  });

  it("shows SQL error", () => {
    render(
      <ValidationFeedback
        passed={false}
        diff={{ sqlError: "Syntax error near SELECT" }}
      />,
    );
    expect(screen.getByText("Syntax error near SELECT")).toBeInTheDocument();
  });

  it("shows column mismatch", () => {
    render(
      <ValidationFeedback
        passed={false}
        diff={{
          columnDiff: {
            expected: ["id", "name"],
            actual: ["id"],
            missing: ["name"],
            extra: [],
          },
        }}
      />,
    );
    expect(screen.getByText("Column mismatch")).toBeInTheDocument();
    expect(screen.getByText(/id, name/)).toBeInTheDocument();
    expect(screen.getByText("Missing: name")).toBeInTheDocument();
  });

  it("shows extra columns", () => {
    render(
      <ValidationFeedback
        passed={false}
        diff={{
          columnDiff: {
            expected: ["id"],
            actual: ["id", "name"],
            missing: [],
            extra: ["name"],
          },
        }}
      />,
    );
    expect(screen.getByText("Extra: name")).toBeInTheDocument();
  });

  it("shows row count mismatch", () => {
    render(
      <ValidationFeedback
        passed={false}
        diff={{
          rowCountDiff: { expected: 5, actual: 3 },
        }}
      />,
    );
    expect(screen.getByText(/expected 5, got 3/)).toBeInTheDocument();
  });

  it("shows only the verification label for schema verification failures", () => {
    render(
      <ValidationFeedback
        passed={false}
        verificationLabel="Table 'CUSTOMER' must have the expected unique constraints"
        diff={{
          rowCountDiff: { expected: 1, actual: 0 },
          dataDiff: {
            missingRows: [{ columns: "email" }],
            extraRows: [],
          },
        }}
      />,
    );

    expect(
      screen.getByText(
        "Table 'CUSTOMER' must have the expected unique constraints",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Row count mismatch/)).not.toBeInTheDocument();
    expect(screen.queryByText(/expected row/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Expected:/)).not.toBeInTheDocument();
  });

  it("shows a readable sentence for column name failures", () => {
    render(
      <ValidationFeedback
        passed={false}
        verificationLabel="Table 'CUSTOMER' columns must match the expected names and order"
        diff={{
          dataDiff: {
            missingRows: [
              { columnNames: "customerId, customerName, address, email" },
            ],
            extraRows: [{ columnNames: "test, test2, test3, test4" }],
          },
        }}
      />,
    );

    expect(
      screen.getByText(
        "Expected columns: customerId, customerName, address, email. Got: test, test2, test3, test4.",
      ),
    ).toBeInTheDocument();
  });

  it("shows a readable sentence for column property failures", () => {
    render(
      <ValidationFeedback
        passed={false}
        verificationLabel="Column 'customerName' in table 'CUSTOMER' must match the expected type, nullability, default, and auto-increment settings"
        diff={{
          dataDiff: {
            missingRows: [
              {
                columnName: "customerName",
                dataType: "varchar",
                isNullable: "NO",
              },
            ],
            extraRows: [
              {
                columnName: "customerName",
                dataType: "varchar",
                isNullable: "YES",
              },
            ],
          },
        }}
      />,
    );

    expect(
      screen.getByText("Column 'customerName' should be NOT NULL."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/^Expected:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Got:/)).not.toBeInTheDocument();
  });

  it("shows a readable sentence for missing auto-increment", () => {
    render(
      <ValidationFeedback
        passed={false}
        verificationLabel="Column 'customerId' in table 'CUSTOMER' must match the expected type, nullability, default, and auto-increment settings"
        diff={{
          dataDiff: {
            missingRows: [
              {
                columnName: "customerId",
                dataType: "int",
                isNullable: "NO",
                extra: "auto_increment",
              },
            ],
            extraRows: [
              {
                columnName: "customerId",
                dataType: "int",
                isNullable: "YES",
                extra: "",
              },
            ],
          },
        }}
      />,
    );

    expect(
      screen.getByText(
        "Column 'customerId' should be NOT NULL and should use AUTO_INCREMENT.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/dataType: int/)).not.toBeInTheDocument();
    expect(screen.queryByText(/extra: auto_increment/)).not.toBeInTheDocument();
  });

  it("does not duplicate type mismatch messages", () => {
    render(
      <ValidationFeedback
        passed={false}
        verificationLabel="Column 'customerName' in table 'CUSTOMER' must match the expected type, nullability, default, and auto-increment settings"
        diff={{
          dataDiff: {
            missingRows: [
              {
                columnName: "customerName",
                dataType: "varchar",
                columnType: "varchar",
              },
            ],
            extraRows: [
              {
                columnName: "customerName",
                dataType: "text",
                columnType: "text",
              },
            ],
          },
        }}
      />,
    );

    expect(
      screen.getByText(
        "Column 'customerName' should be varchar, but got text.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/should be varchar/g).textContent).toBe(
      "Column 'customerName' should be varchar, but got text.",
    );
  });

  it("shows missing rows count", () => {
    render(
      <ValidationFeedback
        passed={false}
        diff={{
          dataDiff: {
            missingRows: [{ id: 1 }, { id: 2 }],
            extraRows: [],
          },
        }}
      />,
    );
    expect(screen.getByText(/2 expected rows missing/)).toBeInTheDocument();
    expect(screen.getByText("Expected rows")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "id" }),
    ).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.queryByText(/\{\s*"id"/)).not.toBeInTheDocument();
  });

  it("shows extra rows count", () => {
    render(
      <ValidationFeedback
        passed={false}
        diff={{
          dataDiff: {
            missingRows: [],
            extraRows: [{ id: 5 }],
          },
        }}
      />,
    );
    expect(screen.getByText(/1 unexpected row returned/)).toBeInTheDocument();
    expect(screen.getByText("Got rows")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "id" }),
    ).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.queryByText(/\{\s*"id"/)).not.toBeInTheDocument();
  });

  it("renders row diffs as tables with all row columns", () => {
    render(
      <ValidationFeedback
        passed={false}
        diff={{
          dataDiff: {
            missingRows: [
              {
                customerName: "Farid Mansouri",
                phoneNumber: "0771234567",
                totalDataConsp: 9008452608,
              },
            ],
            extraRows: [
              {
                customerName: "MMS",
                phoneNumber: null,
                totalDataConsp: undefined,
              },
            ],
          },
        }}
      />,
    );

    expect(screen.getAllByRole("table")).toHaveLength(2);
    expect(
      screen.getAllByRole("columnheader", { name: "customerName" }),
    ).toHaveLength(2);
    expect(screen.getByText("Farid Mansouri")).toBeInTheDocument();
    expect(screen.getByText("0771234567")).toBeInTheDocument();
    expect(screen.getByText("9008452608")).toBeInTheDocument();
    expect(screen.getByText("NULL")).toBeInTheDocument();
  });

  it("shows all diff details simultaneously", () => {
    render(
      <ValidationFeedback
        passed={false}
        diff={{
          columnDiff: {
            expected: ["id", "name"],
            actual: ["id"],
            missing: ["name"],
            extra: [],
          },
          rowCountDiff: { expected: 3, actual: 2 },
          dataDiff: {
            missingRows: [{ id: 1 }],
            extraRows: [{ id: 9 }],
          },
        }}
      />,
    );
    expect(screen.getByText("Column mismatch")).toBeInTheDocument();
    expect(screen.getByText(/expected 3, got 2/)).toBeInTheDocument();
    expect(screen.getByText(/1 expected row missing/)).toBeInTheDocument();
    expect(screen.getByText(/1 unexpected row returned/)).toBeInTheDocument();
  });
});
