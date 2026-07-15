import type { Ingredient } from "@/lib/types";

export const mockIngredient: Ingredient = {
  id: 1,
  name: "ingredient 1",
} as const;

export const mockIngredients: Ingredient[] = [
  mockIngredient,
  { id: 2, name: "ingredient 2" },
  { id: 3, name: "ingredient 3" },
  { id: 4, name: "ingredient 4" },
  { id: 5, name: "ingredient 5" },
  { id: 6, name: "ingredient 6" },
  { id: 7, name: "ingredient 7" },
  { id: 8, name: "ingredient 8" },
  { id: 9, name: "ingredient 9" },
  { id: 10, name: "ingredient 10" },
] as const;
