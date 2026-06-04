import { readFile } from "node:fs/promises";
import { join } from "node:path";
import mysql from "mysql2/promise";

const sqlFilePath = join(import.meta.dir, "../../../TelecomDZ_schema_data.sql");

const connectionConfig = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3308),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "root",
};

const stripComments = (sql: string) =>
  sql
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("--"))
    .join("\n");

const splitStatements = (sql: string) =>
  stripComments(sql)
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

async function seedDatabase() {
  const connection = await mysql.createConnection(connectionConfig);

  try {
    const sql = await readFile(sqlFilePath, "utf8");
    const statements = [
      "DROP DATABASE IF EXISTS DZTelecom",
      ...splitStatements(sql),
    ];

    for (const statement of statements) {
      await connection.query(statement);
    }

    console.log("DZTelecom database seeded successfully.");
  } finally {
    await connection.end();
  }
}

await seedDatabase();
