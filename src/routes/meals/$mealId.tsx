import { createFileRoute, redirect } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import ButtonLink from "@/components/ButtonLink";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from "@/components/ui/item";
import { db } from "@/lib/db";
import { useIngredient } from "@/lib/hooks";
import type { Meal } from "@/lib/types";

export const Route = createFileRoute("/meals/$mealId")({
	component: RouteComponent,
	loader: ({ params }) => fetchMeal(params.mealId),
});

function RouteComponent() {
	const meal = Route.useLoaderData();

	return (
		<div className="grid grid-cols-[1fr_min-content]">
			<h2>{meal.name}</h2>
			<ButtonLink
				to="/meals/$mealId/edit"
				params={{ mealId: `${meal.id}` }}
				variant="ghost"
			>
				<Pencil />
			</ButtonLink>
			<h3 className="col-span-full">Ingredients</h3>
			<MealIngredients ingredients={meal.ingredients} />
		</div>
	);
}

function MealIngredients(props: { ingredients: Meal["ingredients"] }) {
	return (
		<ItemGroup className="col-span-full">
			{props.ingredients.map((ing) => (
				<IngredientItem {...ing} key={ing.id} />
			))}
		</ItemGroup>
	);
}

function IngredientItem({
	id: ingredientId,
	amount,
	unit,
}: Meal["ingredients"][number]) {
	const {
		isPending,
		isError,
		data: ingredient,
		error,
	} = useIngredient(ingredientId);

	if (isPending) return "Loading...";
	if (isError) return `Error: ${error}`;

	return (
		<Item>
			<ItemContent className="gap-1">
				<ItemTitle>{ingredient.name}</ItemTitle>
				<ItemDescription>
					Quantity: {amount} {unit}
				</ItemDescription>
			</ItemContent>
		</Item>
	);
}

async function fetchMeal(mealId: string) {
	const meals = await db.meals
		.where("id")
		.equals(Number(mealId))
		.limit(1)
		.toArray();

	if (meals.length === 0)
		throw redirect({ to: "/meals", search: { error: "Meal not found" } });

	return meals[0];
}
