import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { fetchIngredients, fetchMeals } from "@/lib/fetch";
import { copyToClipboard, importData } from "@/lib/utils";

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
    <>
      <Button
        onClick={async () => {
          await copyToClipboard(JSON.stringify(data));
          alert("Data copied to clipboard as JSON");
        }}
      >
        Copy data to clipboard as JSON
      </Button>

      <Button
        onClick={async () => {
          try {
            const json = (await navigator?.clipboard?.readText()) || "";
            await importData(json);
            alert("Data imported from clipboard");
          } catch (error) {
            alert(`Failed to import data from clipboard: ${error}`);
          }
        }}
      >
        Import data from clipboard (this will clear existing data)
      </Button>
    </>
  );
}
