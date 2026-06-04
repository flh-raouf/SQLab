import { createRoute } from "@tanstack/react-router";
import { SandboxPage } from "@/components/sandbox-page";
import { appLayoutRoute } from "./_layout";

export const sandboxRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/sandbox",
  component: SandboxPage,
});
