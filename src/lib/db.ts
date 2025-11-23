import Dexie, { type EntityTable } from "dexie";
import type { Ingredient, Meal } from "@/lib/types";

const db = new Dexie("MealPlanner") as Dexie & {
  ingredients: EntityTable<Ingredient, "id">;
  meals: EntityTable<Meal, "id">;
};

db.version(1).stores({
  ingredients: "++id, &name",
  meals: "++id, &name, *ingredients.id",
});

export { db };
