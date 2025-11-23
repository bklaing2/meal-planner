/// <reference types="vite/client" />
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { toast } from "sonner";
import BottomBar from "@/components/BottomBar";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

type RootSearch = {
  message?: string;
  error?: string;
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Meal Planner",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  validateSearch: (search: Record<string, unknown>): RootSearch => {
    return {
      message: (search.message as string) || undefined,
      error: (search.error as string) || undefined,
    };
  },
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { message, error } = Route.useSearch();
  if (message) toast(message);
  if (error) toast.error(error);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="grid grid-rows-[1fr_auto] h-dvh max-h-dvh">
        <main className="max-h-full h-full max-w-full w-full overflow-y-auto">
          {children}
        </main>
        <BottomBar />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}
