import { afterEach, beforeEach, vi } from "vitest";
import { db } from "@/lib/db";
import { mockIngredients } from "./mocks/ingredient";
import { mockMeals } from "./mocks/meal";

vi.spyOn(window, "alert").mockImplementation(() => { });

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
