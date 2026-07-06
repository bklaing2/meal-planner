import { afterEach, beforeEach, describe, expect, test } from "vitest";
import type { Locator } from "vitest/browser";
import { type RenderResult, render } from "vitest-browser-react";
import { NEW_INGREDIENT } from "@/lib/constants";
import { GetAllIngredients, GetIngredientById } from "@/lib/ingredient";
import { IngredientList } from "@/routes/ingredients";
import { EditIngredient } from "@/routes/ingredients_.$ingredientId.edit";
import { mockIngredient, mockIngredients } from "./mocks/ingredient";

test("IngredientList", async () => {
  const { getByRole } = await render(
    <IngredientList ingredients={mockIngredients} />,
  );
  const ingredientLinks = getByRole("link").elements();
  expect(ingredientLinks.length).toBe(mockIngredients.length);
  expect(ingredientLinks[0]).toHaveTextContent(mockIngredients[0].name);
  expect(ingredientLinks[5]).toHaveTextContent(mockIngredients[5].name);
});

describe("EditIngredient", async () => {
  let editIngredient: RenderResult | null = null;
  let nameInput: Locator;
  let saveButton: Locator;
  let deleteButton: Locator;
  let cancelButton: Locator;

  async function renderEditIngredient(ingredient = mockIngredient) {
    if (!editIngredient)
      editIngredient = await render(<EditIngredient ingredient={ingredient} />);
    else
      await editIngredient.rerender(<EditIngredient ingredient={ingredient} />);

    nameInput = editIngredient.getByLabelText("Name");
    saveButton = editIngredient.getByRole("button", { name: /Save|Create/ });
    deleteButton = editIngredient.getByRole("button", { name: "Delete" });
    cancelButton = editIngredient.getByRole("link", { name: "Cancel" });
  }

  beforeEach(async () => {
    await renderEditIngredient();
  });

  afterEach(async () => {
    editIngredient = null;
  });

  test("Renders all components", async () => {
    expect(nameInput).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  test.each([
    [mockIngredient, "Save"],
    [NEW_INGREDIENT, "Create"],
  ])("Save button shows correct text: $1", async (ingredient, expectedText) => {
    await renderEditIngredient(ingredient);
    expect(saveButton).toHaveTextContent(expectedText);
  });

  test("Save button creates a new ingredient when clicked", async () => {
    await renderEditIngredient(NEW_INGREDIENT);
    const newName = "new ingredient name";
    await nameInput.fill(newName);
    await saveButton.click();

    const allIngredients = await GetAllIngredients();
    expect(allIngredients.length).toBe(mockIngredients.length + 1);
    expect(allIngredients[allIngredients.length - 1]).toEqual({
      id: expect.any(Number),
      name: newName,
    });
  });

  test("Save button updates the ingredient when clicked", async () => {
    const newName = "updated ingredient name";
    await nameInput.fill(newName);
    await saveButton.click();
    await expect(GetIngredientById(mockIngredient.id)).resolves.toEqual({
      ...mockIngredient,
      name: newName,
    });
  });

  test("Delete button deletes the ingredient when clicked", async () => {
    await deleteButton.click();
    await expect(GetIngredientById(mockIngredient.id)).rejects.toThrow(
      `Ingredient with id ${mockIngredient.id} not found`,
    );
  });

  test("Cancel button doesn't save changes when clicked", async () => {
    await nameInput.fill("Updated Ingredient Name");
    await cancelButton.click();
    await expect(GetIngredientById(mockIngredient.id)).resolves.toEqual(
      mockIngredient,
    );
  });
});
