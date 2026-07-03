import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { fetchIngredients, fetchMeals } from "@/lib/fetch";
import { copyToClipboard } from "@/lib/utils";

const fetchData = async () => ({
  ingredients: await fetchIngredients(),
  meals: await fetchMeals(),
});

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
  loader: () => fetchData(),
});

function RouteComponent() {
  const data = Route.useLoaderData();

  return (
    <Button
      onClick={async () => {
        await copyToClipboard(JSON.stringify(data));
        alert("Data copied to clipboard as JSON");
      }}
    >
      Copy data to clipboard as JSON
    </Button>
  );
}
