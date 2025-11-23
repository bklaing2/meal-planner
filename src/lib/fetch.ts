import { redirect } from "@tanstack/react-router";
import type { EntityTable } from "dexie";
import { db } from "@/lib/db";
import type { Id, Ingredient, Meal, NoId } from "@/lib/types";

// Helpers
const REGEX_ARGS = [/[.*+?^${}()|[\]\\]/g, "\\$&"] as const;

export async function fetchTable<T extends { id: unknown; name: string }>(
	table: EntityTable<T, "id">,
	query?: string,
) {
	if (!query) return await table.toArray();

	// Escape regex special chars so queries like "(a" don’t break
	const escaped = query.replace(...REGEX_ARGS);
	const regex = new RegExp(escaped, "i");

	return await table.filter((ing) => regex.test(ing.name)).toArray();
}

// Ingredients
export async function fetchIngredients(query?: string | Id<Ingredient>[]) {
	if (Array.isArray(query))
		return await db.ingredients.where("id").anyOf(query).toArray();

	return await fetchTable(db.ingredients, query);
}

export async function fetchIngredient(id: Id<Ingredient> | "new") {
	if (!id)
		throw redirect({
			to: "/ingredients",
			search: { error: "Ingredient not found" },
		});

	if (id === "new") return { id: -1, name: "" };

	const ingredients = await db.ingredients
		.where("id")
		.equals(Number(id))
		.limit(1)
		.toArray();

	if (ingredients.length === 0)
		throw redirect({
			to: "/ingredients",
			search: { error: "Ingredient not found" },
		});

	return ingredients[0];
}

export async function createIngredient(ing: NoId<Ingredient>) {
	return { ...ing, id: await db.ingredients.add(ing) };
}

// Meals
export async function fetchMeals(query?: string | Id<Meal>[]) {
	if (Array.isArray(query))
		return await db.meals.where("id").anyOf(query).toArray();

	return await fetchTable(db.meals, query);
}

export async function fetchMeal(id: Id<Meal> | "new"): Promise<Meal> {
	if (!id)
		throw redirect({
			to: "/meals",
			search: { error: "Meal not found" },
		});

	if (id === "new") return { id: -1, name: "", ingredients: [] };

	const meals = await db.meals
		.where("id")
		.equals(Number(id))
		.limit(1)
		.toArray();

	if (meals.length === 0)
		throw redirect({
			to: "/meals",
			search: { error: "Meal not found" },
		});

	return meals[0];
}

export async function createMeal(meal: NoId<Meal>) {
	return { ...meal, id: await db.meals.add(meal) };
}
