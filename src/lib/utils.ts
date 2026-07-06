import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { db } from "@/lib/db";
import type { Ingredient, Meal, Optional } from "@/lib/types";

export const wait = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pluralize(
  count: Optional<string | number>,
  singular: string,
  plural?: string,
) {
  if (Number(count) === 1) return singular;
  return plural || `${singular}s`;
}

export function copyToClipboard(text: string) {
  if (navigator?.clipboard?.writeText)
    return navigator.clipboard.writeText(text);

  return Promise.reject("The Clipboard API is not available.");
}

export async function importData(json: string) {
  const { ingredients = [], meals = [] } = JSON.parse(json) as {
    ingredients: Ingredient[];
    meals: Meal[];
  };

  await db.ingredients.clear();
  await db.meals.clear();

  await db.ingredients.bulkPut(ingredients);
  await db.meals.bulkPut(meals);
}
