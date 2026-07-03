import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { fetchIngredients, fetchMeals } from "@/lib/fetch";
import { copyToClipboard } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

const fetchData = async () => ({
  ingredients: await fetchIngredients(),
  meals: await fetchMeals(),
});

function RouteComponent() {
  return (
    <Button
      onClick={async () => {
        await copyToClipboard(JSON.stringify(await fetchData()));
        alert("Data copied to clipboard as JSON");
      }}
    >
      Copy data to clipboard as JSON
    </Button>
  );
}
