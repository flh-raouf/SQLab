import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./router";

const port = Number(process.env.API_PORT ?? 3001);

createHTTPServer({
  router: appRouter,
}).listen(port);

console.log(`BDD Revision API listening on http://localhost:${port}`);
