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
        copyToClipboard(JSON.stringify(await fetchData()));
      }}
    >
      Copy data to clipboard as JSON
    </Button>
  );
}
