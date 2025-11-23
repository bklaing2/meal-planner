import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import ButtonLink from "@/components/ButtonLink";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { fetchIngredients } from "@/lib/fetch";
import type { Ingredient } from "@/lib/types";

export const Route = createFileRoute("/ingredients/")({
  component: RouteComponent,
  loader: () => fetchIngredients(),
});

function RouteComponent() {
  const ingredients = Route.useLoaderData();

  return (
    <div
      className="grid grid-cols-[1fr_min-content] auto-rows-min size-full
    overflow-y-scroll"
    >
      <h2>Ingredients</h2>
      <ButtonLink
        to="/ingredients/$ingredientId/edit"
        params={{ ingredientId: "new" }}
        variant="ghost"
      >
        <Plus />
      </ButtonLink>
      <ItemGroup>{ingredients.map(IngredientItem)}</ItemGroup>
    </div>
  );
}

function IngredientItem(ingredient: Ingredient) {
  return (
    <Item asChild key={ingredient.id}>
      <Link
        to={`/ingredients/$ingredientId`}
        params={{ ingredientId: `${ingredient.id}` }}
      >
        <ItemContent className="gap-1">
          <ItemTitle>{ingredient.name}</ItemTitle>
        </ItemContent>
      </Link>
    </Item>
  );
}
