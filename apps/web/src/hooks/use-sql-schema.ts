import { useMemo } from "react";
import { trpc } from "@/lib/trpc";

type SqlSchema = Record<string, { label: string }[]>;

export function useSqlSchema() {
  const { data } = trpc.schema.fullSchema.useQuery();

  return useMemo<SqlSchema | undefined>(() => {
    if (!data) return undefined;
    const schema: SqlSchema = {};
    for (const [table, columns] of Object.entries(data)) {
      schema[table] = columns.map((col) => ({ label: col }));
    }
    return schema;
  }, [data]);
}
