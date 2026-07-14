import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { type Locator, userEvent } from "vitest/browser";
import { NEW_MEAL } from "@/lib/constants";
import { GetAllMeals, GetMealById } from "@/lib/meal";
import type { Meal, Quantity } from "@/lib/types.ts";
import { EditMeal } from "@/routes/meals_.$mealId.edit";
import { mockIngredient, mockIngredients } from "./mocks/ingredient.ts";
import { mockMeal, mockMeals } from "./mocks/meal.ts";
import { renderWithProviders } from "./util.tsx";

let editMeal = await renderWithProviders(<EditMeal meal={mockMeal} />);
let nameInput: Locator;
let ingredientList: Locator;
let ingredientItems: Locator;
let saveButton: Locator;
let deleteButton: Locator;
let cancelButton: Locator;

async function renderEditMeal(meal = mockMeal) {
  await editMeal.unmount();
  editMeal = await renderWithProviders(<EditMeal meal={meal} />);

  nameInput = editMeal.getByLabelText("Name");
  ingredientList = editMeal.getByRole("list");
  ingredientItems = ingredientList.getByRole("listitem");
  saveButton = editMeal.getByRole("button", { name: /Save|Create/ });
  deleteButton = editMeal.getByRole("button", { name: "Delete" });
  cancelButton = editMeal.getByRole("link", { name: "Cancel" });
}

beforeEach(async () => {
  await renderEditMeal();
});

afterEach(async () => {
  await editMeal.unmount();
});

test("Renders all components", async () => {
  expect(nameInput).toBeInTheDocument();
  expect(ingredientList).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();
  expect(deleteButton).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();
});

describe("Ingredient list", () => {
  beforeEach(async () => {
    await vi.waitFor(() => {
      for (const item of ingredientItems.elements())
        expect(item).not.toHaveTextContent("Loading");
    }, 100);
  });

  test("Displays all ingredients for the meal", async () => {
    expect(ingredientItems.length).toBe(mockMeal.ingredients.length);
    expect(ingredientItems.nth(0)).toHaveTextContent(mockIngredients[1].name);
    expect(ingredientItems.nth(0)).toHaveTextContent("1 pound");
    expect(ingredientItems.nth(1)).toHaveTextContent(mockIngredients[2].name);
    expect(ingredientItems.nth(1)).toHaveTextContent("3 tablespoons");
    expect(ingredientItems.nth(2)).toHaveTextContent(mockIngredients[3].name);
    expect(ingredientItems.nth(2)).toHaveTextContent("3");
  });

  test("Appends ingredient to the list after adding it to the meal", async () => {
    const expectedIngredient = mockIngredients[5];
    const expectedQuantity: Quantity = { amount: 2, unit: "kilogram" };

    await SimulateAddIngredient(expectedIngredient, expectedQuantity);

    expect(ingredientItems.length).toBe(mockMeal.ingredients.length + 1);
    expect(ingredientItems.last()).toHaveTextContent(expectedIngredient.name);
    expect(ingredientItems.last()).toHaveTextContent(
      `${expectedQuantity.amount} ${expectedQuantity.unit}s`,
    );
  });

  test("Reflects updates to an ingredient after editing it", async () => {
    const expectedQuantity = { amount: 2, unit: "kilogram" };
    const ingredientItem = ingredientItems.first();

    await SimulateEditIngredient(ingredientItem, expectedQuantity);

    expect(ingredientItems.length).toBe(mockMeal.ingredients.length);
    expect(ingredientItem).toHaveTextContent(mockIngredients[1].name);
    expect(ingredientItem).toHaveTextContent(
      `${expectedQuantity.amount} ${expectedQuantity.unit}s`,
    );
  });

  test("Removes ingredient from the list after clicking the remove button", async () => {
    const ingredientItem = ingredientItems.first();
    await SimulateDeleteIngredient(ingredientItem);
    expect(ingredientItems.length).toBe(mockMeal.ingredients.length - 1);
    expect(ingredientItem).not.toHaveTextContent(mockIngredients[1].name);
  });
});

test.each([
  [mockMeal, "Save"],
  [NEW_MEAL, "Create"],
])("Save/Create button shows correct text: $1", async (meal, expectedText) => {
  await renderEditMeal(meal);
  expect(saveButton).toHaveTextContent(expectedText);
});

test("Create button creates a new meal when clicked", async () => {
  const newName = "new meal name";

  await renderEditMeal(NEW_MEAL);
  await nameInput.fill(newName);

  await SimulateAddIngredient(mockIngredients[4], {
    amount: 2,
    unit: "pound",
  });
  await SimulateAddIngredient(mockIngredients[5], { amount: 3 });
  await saveButton.click();

  const allMeals = await GetAllMeals();
  expect(allMeals.length).toBe(mockMeals.length + 1);
  expect(allMeals[allMeals.length - 1]).toEqual({
    id: expect.any(Number),
    name: newName,
    ingredients: [
      { id: mockIngredients[4].id, amount: 2, unit: "pound" },
      { id: mockIngredients[5].id, amount: 3 },
    ],
  } satisfies Meal);
});

test("Save button updates the meal when clicked", async () => {
  const updatedName = "updated meal name";

  await nameInput.fill(updatedName);

  await SimulateDeleteIngredient(ingredientItems.first());
  await SimulateEditIngredient(ingredientItems.nth(0), { amount: 4 });
  await SimulateEditIngredient(ingredientItems.nth(1), {
    amount: 3,
    unit: "pound",
  });
  await SimulateAddIngredient(mockIngredients[4], { amount: 2, unit: "pound" });
  await SimulateAddIngredient(mockIngredients[5], { amount: 3 });

  await saveButton.click();

  const allMeals = await GetAllMeals();
  expect(allMeals.length).toBe(mockMeals.length);
  expect(allMeals[allMeals.length - 1]).toEqual({
    id: expect.any(Number),
    name: updatedName,
    ingredients: [
      { id: mockIngredients[2].id, amount: 4 },
      { id: mockIngredients[3].id, amount: 3, unit: "pound" },
      { id: mockIngredients[4].id, amount: 2, unit: "pound" },
      { id: mockIngredients[5].id, amount: 3 },
    ],
  } satisfies Meal);
});

test("Delete button deletes the meal when clicked", async () => {
  await deleteButton.click();
  await expect(GetMealById(mockMeal.id)).rejects.toThrow(
    `Meal with id ${mockMeal.id} not found`,
  );
});

test("Cancel button doesn't save changes when clicked", async () => {
  await nameInput.fill("Updated Meal Name");
  await cancelButton.click();
  await expect(GetMealById(mockMeal.id)).resolves.toEqual(mockMeal);
});

async function SimulateAddIngredient(
  expectedIngredient = mockIngredient,
  expectedQuantity: Quantity = { amount: 1 },
) {
  // Click "add ingredient to meal" button
  await editMeal.getByTitle("add ingredient to meal").click();

  // Wait for modal to open
  await vi.waitFor(
    () => expect(editMeal.getByRole("dialog")).toBeVisible(),
    500,
  );

  // Click on the ingredient list item
  await editMeal
    .getByRole("button", {
      name: expectedIngredient.name,
    })
    .click();

  await SimulateQuantityInput(expectedQuantity);

  // Click "Save" button
  await editMeal
    .getByRole("dialog")
    .getByRole("button", { name: "Save" })
    .click();

  await vi.waitFor(() => {
    expect(ingredientItems.last()).not.toHaveTextContent("Loading");
  }, 500);
}

async function SimulateEditIngredient(
  ingredientListItem = ingredientItems.first(),
  expectedQuantity: Quantity = { amount: 1 },
) {
  // Click "edit ingredient" button
  await ingredientListItem.getByTitle("edit").click();

  // Wait for modal to open
  await vi.waitFor(
    () => expect(editMeal.getByRole("dialog")).toBeVisible(),
    500,
  );

  await SimulateQuantityInput(expectedQuantity);

  // Click "Save" button
  await editMeal
    .getByRole("dialog")
    .getByRole("button", { name: "Save" })
    .click();
}

async function SimulateDeleteIngredient(ingredientListItem: Locator) {
  await ingredientListItem.getByTitle("remove").click();
}

async function SimulateQuantityInput(quantity: Quantity) {
  // Fill in the quantity amount
  await editMeal
    .getByLabelText("quantity amount")
    .fill(quantity.amount.toString());

  // Select the quantity unit from the combobox
  await editMeal.getByLabelText("quantity unit combobox trigger").click();
  const unitSearchInput = editMeal.getByPlaceholder("search units");
  await unitSearchInput.clear();
  await userEvent.type(unitSearchInput, `${quantity.unit ?? ""}{enter}`);
}
