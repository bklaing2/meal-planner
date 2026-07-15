import { db } from "@/lib/db";
import type { Id, Ingredient, NoId } from "@/lib/types";

export async function GetAllIngredients() {
  return await db.ingredients.toArray();
}

export async function GetIngredientsByIds(ids: Id<Ingredient>[]) {
  return await db.ingredients.where("id").anyOf(ids).toArray();
}

export async function GetIngredientById(id: Id<Ingredient>) {
  const ingredients = await db.ingredients
    .where("id")
    .equals(id)
    .limit(1)
    .toArray();

  if (ingredients.length === 0)
    throw new Error(`Ingredient with id ${id} not found`);

  return ingredients[0];
}

export async function QueryIngredients(query: string) {
  if (!query) throw new Error("Query string cannot be empty");

  return await db.ingredients
    .filter(({ name }) => name.toLowerCase().includes(query.toLowerCase()))
    .toArray();
}

export async function ImportIngredients(ingredients: Ingredient[]) {
  await db.ingredients.clear();
  await db.ingredients.bulkPut(ingredients);
}

export async function CreateIngredient(ingredient: NoId<Ingredient>) {
  if (!ingredient.name) throw new Error("Ingredient name cannot be empty");
  return { ...ingredient, id: await db.ingredients.add(ingredient) };
}

export async function RenameIngredient(id: Id<Ingredient>, newName: string) {
  if (!newName) throw new Error("Ingredient name cannot be empty");

  const ingredient = await GetIngredientById(id);
  ingredient.name = newName;
  await db.ingredients.put(ingredient);
  return ingredient;
}
