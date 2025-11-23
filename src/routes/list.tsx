import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from "@/components/ui/item";
import { useIngredient, useMeals } from "@/lib/hooks";
import type { Id, Ingredient, Quantity } from "@/lib/types";
import { simplify } from "@/lib/unit";
import { weekMealsAtom } from "@/routes/week";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function useWeekIngredients() {
	const weekMealIds = useAtomValue(weekMealsAtom);
	const weekMeals = useMeals(weekMealIds);

	if (weekMeals.isPending) return [];
	if (weekMeals.isError) throw weekMeals.error;

	const ingredients = weekMeals.data.reduce(
		(ings, meal) =>
			meal.ingredients.reduce((ings, { id, ...quantity }) => {
				const quantities = ings[id] || [];
				quantities.push({ ...quantity });
				ings[id] = quantities;
				return ings;
			}, ings),
		{} as { [id: Id<Ingredient>]: Quantity[] },
	);

	const ings = Object.entries(ingredients).map(([id, q]) => ({
		id: Number(id) satisfies Id<Ingredient>,
		quantities: simplify(q),
	}));

	return ings;
}

export const Route = createFileRoute("/list")({
	component: RouteComponent,
});

function RouteComponent() {
	const weekIngredients = useWeekIngredients();

	return (
		<div
			className="grid grid-cols-1 auto-rows-min size-full
    overflow-y-scroll"
		>
			<h2>Ingredients for the Week</h2>
			<ItemGroup>
				{weekIngredients.map((i) => (
					<IngredientItem id={i.id} quantities={i.quantities} key={i.id} />
				))}
			</ItemGroup>
		</div>
	);
}

function IngredientItem(props: { id: Id<Ingredient>; quantities: Quantity[] }) {
	const {
		isPending,
		isError,
		data: ingredient,
		error,
	} = useIngredient(props.id);

	if (isPending) return "Loading...";
	if (isError) return `Error: ${error}`;

	return (
		<Item key={ingredient.id}>
			<ItemContent className="gap-1">
				<ItemTitle>
					<Checkbox id={`${ingredient.id}`} className="peer" />
					<Label
						htmlFor={`${ingredient.id}`}
						className="peer-data-[state=checked]:line-through peer-data-[state=checked]:text-muted-foreground"
					>
						{ingredient.name}
					</Label>
				</ItemTitle>
				<ItemDescription>
					{props.quantities.map((q) => `${q.amount} ${q.unit}`).join(", ")}
				</ItemDescription>
			</ItemContent>
		</Item>
	);
}
