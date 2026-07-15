import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { fetchIngredients, fetchMeals } from "@/lib/fetch";
import { ImportIngredients } from "@/lib/ingredient";
import { ImportMeals } from "@/lib/meal";
import type { Ingredient, Meal } from "@/lib/types";
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
    <>
      <CopyDataToClipboardButton json={JSON.stringify(data)} />
      <ImportDataFromClipboardButton />
    </>
  );
}

export function CopyDataToClipboardButton(props: { json: string }) {
  return (
    <Button
      onClick={async () => {
        await copyToClipboard(props.json);
        alert("Data copied to clipboard as JSON");
      }}
    >
      Copy data to clipboard as JSON
    </Button>
  );
}

export function ImportDataFromClipboardButton() {
  return (
    <Button
      onClick={async () => {
        try {
          const json = (await navigator?.clipboard?.readText()) || "";
          const { ingredients = [], meals = [] } = JSON.parse(json) as {
            ingredients: Ingredient[];
            meals: Meal[];
          };

          await ImportIngredients(ingredients);
          await ImportMeals(meals);

          alert("Data imported from clipboard");
        } catch (error) {
          alert(`Failed to import data from clipboard: ${error}`);
        }
      }}
    >
      Import data from clipboard (this will clear existing data)
    </Button>
  );
}
