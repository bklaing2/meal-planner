import { beforeEach, afterEach } from "vitest";
import { db } from "@/lib/db";
import { mockMeals } from "./mocks/meal";
import { mockIngredients } from "./mocks/ingredient";

beforeEach(async () => {
  await db.open();

  await db.ingredients.clear();
  await db.meals.clear();

  await db.meals.bulkPut(mockMeals);
  await db.ingredients.bulkPut(mockIngredients);
});

afterEach(async () => {
  db.close();
});
