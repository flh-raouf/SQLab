import { ChevronDown, ChevronRight, Database, Table, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

export function SchemaViewer() {
  const [showErDiagram, setShowErDiagram] = useState(false);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const { data: tables } = trpc.schema.tables.useQuery();

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(tableName)) {
        next.delete(tableName);
      } else {
        next.add(tableName);
      }
      return next;
    });
    setSelectedTable(tableName);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowErDiagram(true)}
        >
          <Database className="mr-1 h-4 w-4" />
          ER Diagram
        </Button>
      </div>

      {showErDiagram && (
        <div>
          <button
            type="button"
            className="fixed inset-0 z-50 cursor-default border-none bg-black/60 p-0"
            onClick={() => setShowErDiagram(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowErDiagram(false);
            }}
            aria-label="Close ER diagram"
          />
          <div className="fixed inset-4 z-50 mx-auto max-w-4xl overflow-auto rounded-lg border border-border bg-card p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">TelecomDZ ER Schema</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowErDiagram(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <img
              src="/assets/telecomdz-er-schema.png"
              alt="TelecomDZ ER Schema"
              className="w-full rounded-md"
            />
          </div>
        </div>
      )}

      {tables && tables.length > 0 && (
        <div className="rounded-md border border-border">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Table className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Tables</span>
          </div>
          <ScrollArea className="max-h-96">
            {tables.map(({ tableName }) => (
              <div key={tableName}>
                <button
                  type="button"
                  onClick={() => toggleTable(tableName)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors hover:bg-sidebar-hover",
                    selectedTable === tableName && "bg-sidebar-active",
                  )}
                >
                  {expandedTables.has(tableName) ? (
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3 w-3 shrink-0" />
                  )}
                  {tableName}
                </button>
                {expandedTables.has(tableName) && (
                  <TableDetails tableName={tableName} />
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </>
  );
}

function TableDetails({ tableName }: { tableName: string }) {
  const { data: columns } = trpc.schema.tableColumns.useQuery(tableName);
  const { data: tableData, isLoading: isDataLoading } =
    trpc.schema.tableData.useQuery(tableName);

  return (
    <div className="border-t border-border bg-card/50 px-3 py-2">
      {columns && (
        <div className="mb-2">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Columns
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="pr-2 font-normal">Name</th>
                <th className="pr-2 font-normal">Type</th>
                <th className="font-normal">Key</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((col) => (
                <tr key={col.columnName} className="border-t border-border/50">
                  <td className="py-0.5 pr-2 text-foreground">
                    {col.columnName}
                  </td>
                  <td className="py-0.5 pr-2 text-muted-foreground">
                    {col.columnType}
                  </td>
                  <td className="py-0.5 text-muted-foreground">
                    {col.columnKey || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isDataLoading && (
        <p className="text-xs text-muted-foreground">Loading preview...</p>
      )}

      {tableData && tableData.rows.length > 0 && (
        <div>
          <Separator className="mb-1" />
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Preview ({tableData.rows.length} rows)
          </p>
          <div className="overflow-auto text-xs">
            <table className="w-full">
              <thead>
                <tr className="text-left text-muted-foreground">
                  {tableData.columns.map((col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap px-1 font-normal"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, i) => (
                  <tr key={i} className="border-t border-border/50">
                    {tableData.columns.map((col) => (
                      <td
                        key={col}
                        className="whitespace-nowrap px-1 text-foreground"
                      >
                        {String(row[col] ?? "NULL")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
