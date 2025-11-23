import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus } from "lucide-react";
import ButtonLink from "@/components/ButtonLink";
import { Item, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item";
import { db } from "@/lib/db";
import type { Meal } from "@/lib/types";

export const Route = createFileRoute("/meals/")({
  component: RouteComponent,
});

function RouteComponent() {
  const meals = useLiveQuery(() => db.meals.toArray()) || [];

  return (
    <div
      className="grid grid-cols-[1fr_min-content] auto-rows-min size-full
    overflow-y-scroll"
    >
      <h2>Meals</h2>
      <ButtonLink
        to="/meals/$mealId/edit"
        params={{ mealId: "new" }}
        variant="ghost"
      >
        <Plus />
      </ButtonLink>
      <ItemGroup>{meals.map(MealItem)}</ItemGroup>
    </div>
  );
}

function MealItem(meal: Meal) {
  return (
    <Item asChild key={meal.id}>
      <Link to={`/meals/$mealId`} params={{ mealId: `${meal.id}` }}>
        <ItemContent className="gap-1">
          <ItemTitle>{meal.name}</ItemTitle>
        </ItemContent>
      </Link>
    </Item>
  );
}
