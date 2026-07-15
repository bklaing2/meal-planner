import { expect, test } from "vitest";
import * as ingredientActions from "@/lib/ingredient";
import { mockIngredients } from "./mocks/ingredient";

test("GetAll", async () => {
  const result = await ingredientActions.GetAllIngredients();
  expect(result).toEqual(mockIngredients);
});

test("GetByIds", async () => {
  const result = await ingredientActions.GetIngredientsByIds([
    mockIngredients[0].id,
    mockIngredients[2].id,
  ]);
  expect(result).toEqual([mockIngredients[0], mockIngredients[2]]);
});

test("GetById", async () => {
  const result = await ingredientActions.GetIngredientById(
    mockIngredients[1].id,
  );
  expect(result).toEqual(mockIngredients[1]);
});

test("GetById - throws error when no ingredient found", async () => {
  const ingredientId = -1;
  const getById = () => ingredientActions.GetIngredientById(ingredientId);
  await expect(getById).rejects.toThrow(
    `Ingredient with id ${ingredientId} not found`,
  );
});

test("Query", async () => {
  let query = "ingredient";
  let result = await ingredientActions.QueryIngredients(query);
  expect(result).toEqual(mockIngredients);

  query = "1";
  result = await ingredientActions.QueryIngredients(query);
  expect(result).toEqual([mockIngredients[0], mockIngredients[9]]);
});

test("Query - throws error when query string is empty", async () => {
  const query = () => ingredientActions.QueryIngredients("");
  await expect(query).rejects.toThrow("Query string cannot be empty");
});

test("Import", async () => {
  const ingredientsToImport = mockIngredients.slice(5);
  await ingredientActions.ImportIngredients(ingredientsToImport);
  const result = await ingredientActions.GetAllIngredients();
  expect(result).toEqual(ingredientsToImport);
});

test("Create", async () => {
  const newIngredient = { name: "new ingredient" };
  const result = await ingredientActions.CreateIngredient(newIngredient);
  expect(result).toEqual({ ...newIngredient, id: expect.any(Number) });

  const allIngredients = await ingredientActions.GetAllIngredients();
  expect(allIngredients).toContainEqual(result);
});

test("Create - throws error when name is empty", async () => {
  const newIngredient = { name: "" };
  const create = () => ingredientActions.CreateIngredient(newIngredient);
  await expect(create).rejects.toThrow("Ingredient name cannot be empty");
});

test("Rename", async () => {
  const newName = "renamed ingredient";
  const ingredientId = mockIngredients[0].id;
  await ingredientActions.RenameIngredient(ingredientId, newName);
  const result = await ingredientActions.GetIngredientById(ingredientId);
  expect(result.name).toBe(newName);
});

test("Rename - throws error when name is empty", async () => {
  const newName = "";
  const ingredientId = mockIngredients[0].id;
  const rename = () =>
    ingredientActions.RenameIngredient(ingredientId, newName);
  await expect(rename).rejects.toThrow("Ingredient name cannot be empty");
});
