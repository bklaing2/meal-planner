import { createFileRoute, redirect } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import ButtonLink from "@/components/ButtonLink";
import { db } from "@/lib/db";

export const Route = createFileRoute("/ingredients/$ingredientId")({
  component: RouteComponent,
  loader: ({ params }) => fetchIngredient(params.ingredientId),
});

function RouteComponent() {
  const ingredient = Route.useLoaderData();

  return (
    <div className="grid grid-cols-[1fr_min-content]">
      <h2>{ingredient.name}</h2>
      <ButtonLink
        to="/ingredients/$ingredientId/edit"
        params={{ ingredientId: `${ingredient.id}` }}
        variant="ghost"
      >
        <Pencil />
      </ButtonLink>
    </div>
  );
}

async function fetchIngredient(ingredientId: string) {
  const ingredients = await db.ingredients
    .where("id")
    .equals(Number(ingredientId))
    .limit(1)
    .toArray();

  if (ingredients.length === 0)
    throw redirect({
      to: "/ingredients",
      search: { error: "Ingredient not found" },
    });

  return ingredients[0];
}
