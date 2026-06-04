type ResultsTableProps = {
  columns: string[];
  rows: Record<string, unknown>[];
  affectedRows?: number;
};

export function ResultsTable({
  columns,
  rows,
  affectedRows,
}: ResultsTableProps) {
  if (columns.length === 0 && rows.length === 0) {
    if (affectedRows !== undefined && affectedRows > 0) {
      return (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Query executed successfully. {affectedRows} row
          {affectedRows !== 1 ? "s" : ""} affected.
        </p>
      );
    }

    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        Query returned no results.
      </p>
    );
  }

  return (
    <div className="overflow-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            {columns.map((column) => (
              <th
                key={column}
                className="px-3 py-2 text-left font-medium text-foreground"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border last:border-0 hover:bg-sidebar-hover"
            >
              {columns.map((column) => (
                <td
                  key={column}
                  className="px-3 py-1.5 text-muted-foreground whitespace-nowrap"
                >
                  {formatCellValue(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-border px-3 py-1.5 text-xs text-muted-foreground">
        {rows.length} row{rows.length !== 1 ? "s" : ""} returned
      </div>
    </div>
  );
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "NULL";
  }
  return String(value);
}
