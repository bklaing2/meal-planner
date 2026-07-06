import { expect, test } from "vitest";
import * as mealActions from "@/lib/meal";
import { mealWithNoIngredients, mockMeal, mockMeals } from "./mocks/meal";

test("GetAll", async () => {
  const result = await mealActions.GetAllMeals();
  expect(result).toEqual(mockMeals);
});

test("GetByIds", async () => {
  const result = await mealActions.GetMealsByIds([
    mockMeals[0].id,
    mockMeals[2].id,
  ]);
  expect(result).toEqual([mockMeals[0], mockMeals[2]]);
});

test("GetById", async () => {
  const result = await mealActions.GetMealById(mockMeal.id);
  expect(result).toEqual(mockMeal);
});

test("GetById - throws error when no meal found", async () => {
  const mealId = -1;
  const getById = () => mealActions.GetMealById(mealId);
  await expect(getById).rejects.toThrow(`Meal with id ${mealId} not found`);
});

test("Query", async () => {
  let query = "meal";
  let result = await mealActions.QueryMeals(query);
  expect(result).toEqual(mockMeals);

  query = "no";
  result = await mealActions.QueryMeals(query);
  expect(result).toEqual([mealWithNoIngredients]);
});

test("Query - throws error when query string is empty", async () => {
  const query = () => mealActions.QueryMeals("");
  await expect(query).rejects.toThrow("Query string cannot be empty");
});

test("Import", async () => {
  const mealsToImport = mockMeals.slice(1);
  await mealActions.ImportMeals(mealsToImport);
  const result = await mealActions.GetAllMeals();
  expect(result).toEqual(mealsToImport);
});

test("Create", async () => {
  const newMeal = { name: "new meal", ingredients: [] };
  const result = await mealActions.CreateMeal(newMeal);
  expect(result).toEqual({ ...newMeal, id: expect.any(Number) });

  const allMeals = await mealActions.GetAllMeals();
  expect(allMeals).toContainEqual(result);
});

test.todo("Create - creates new ingredients for those that don't exist");

test("Create - throws error when name is empty", async () => {
  const newMeal = { name: "", ingredients: [] };
  const create = () => mealActions.CreateMeal(newMeal);
  await expect(create).rejects.toThrow("Meal name cannot be empty");
});

test("Rename", async () => {
  const newName = "renamed meal";
  const mealId = mockMeal.id;
  await mealActions.RenameMeal(mealId, newName);
  const result = await mealActions.GetMealById(mealId);
  expect(result.name).toBe(newName);
});

test("Rename - throws error when name is empty", async () => {
  const newName = "";
  const mealId = mockMeal.id;
  const rename = () => mealActions.RenameMeal(mealId, newName);
  await expect(rename).rejects.toThrow("Meal name cannot be empty");
});
