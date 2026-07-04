import { db } from "@/lib/db";
import type { Id, Meal, NoId } from "@/lib/types";

export async function GetAllMeals() {
  return await db.meals.toArray();
}

export async function GetMealsByIds(ids: Id<Meal>[]) {
  return await db.meals.where("id").anyOf(ids).toArray();
}

export async function GetMealById(id: Id<Meal>) {
  const meals = await db.meals.where("id").equals(id).limit(1).toArray();

  if (meals.length === 0) throw new Error(`Meal with id ${id} not found`);

  return meals[0];
}

export async function QueryMeals(query: string) {
  if (!query) throw new Error("Query string cannot be empty");

  return await db.meals
    .filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
    .toArray();
}

export async function ImportMeals(meals: Meal[]) {
  await db.meals.clear();
  await db.meals.bulkPut(meals);
}

export async function CreateMeal(meal: NoId<Meal>) {
  if (!meal.name) throw new Error("Meal name cannot be empty");
  return { ...meal, id: await db.meals.add(meal) };
}

export async function RenameMeal(id: Id<Meal>, newName: string) {
  if (!newName) throw new Error("Meal name cannot be empty");

  const meal = await GetMealById(id);
  meal.name = newName;
  await db.meals.put(meal);
  return meal;
}
