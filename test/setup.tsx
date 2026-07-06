import { afterEach, beforeEach, vi } from "vitest";
import { db } from "@/lib/db";
import { mockIngredients } from "./mocks/ingredient";
import { mockMeals } from "./mocks/meal";

vi.spyOn(window, "alert").mockImplementation(() => { });

vi.mock(import("@tanstack/react-router"), async (importOriginal) => {
  const original = await importOriginal();

  return {
    ...original,
    Link: vi.fn(({ to, params, ...props }) => {
      const searchParams = params
        ? `?${new URLSearchParams(params).toString()}`
        : "";
      const href = (typeof to === "string" ? to : "#") + searchParams;
      return <a {...props} onClick={(e) => e.preventDefault()} href={href} />;
    }),
  };
});

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
