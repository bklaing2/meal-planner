import { Meal } from "@/lib/types"
import { mockIngredients } from "./ingredient"

export const mealWithNoIngredients: Meal = {
  id: 1,
  name: "meal (no ingredients)",
  ingredients: []
}

export const mealWithOneIngredient: Meal = {
  id: 2,
  name: "meal (with one ingredient)",
  ingredients: [
    { id: mockIngredients[0].id, amount: 1, unit: "pound" },
  ]
}

export const mealWithIngredients: Meal = {
  id: 3,
  name: "meal (with ingredients)",
  ingredients: [
    { id: mockIngredients[1].id, amount: 1, unit: "pound" },
    { id: mockIngredients[2].id, amount: 3, unit: "tablespoon" },
    { id: mockIngredients[3].id, amount: 3 }
  ]
}

export const mockMeals = [
  mealWithNoIngredients,
  mealWithOneIngredient,
  mealWithIngredients
]
