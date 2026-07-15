import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "vitest-browser-react";

function Providers(props: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {props.children}
    </QueryClientProvider>
  );
}

export const renderWithProviders: typeof render = (ui, options?) => {
  return render(ui, { wrapper: Providers, ...options });
};
