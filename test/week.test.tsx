import { afterEach, beforeEach, expect, test, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { STORAGE } from "@/lib/constants.ts";
import { Week } from "@/routes/week.tsx";
import { mockMeal, mockMeals } from "./mocks/meal";
import { renderWithProviders } from "./util.tsx";

let week = await renderWithProviders(<Week />);
let mealList: Locator;
let mealItems: Locator;

async function renderWeek() {
  await week.unmount();
  week = await renderWithProviders(<Week />);

  mealList = week.getByRole("list");
  mealItems = mealList.getByRole("listitem");
}

beforeEach(async () => {
  localStorage.removeItem(STORAGE.weekMeals);
  await renderWeek();
});

afterEach(async () => {
  await week.unmount();
  localStorage.removeItem(STORAGE.weekMeals);
});

test("Renders all components", async () => {
  expect(mealList).toBeInTheDocument();
});

test("Appends meal to week after adding it", async () => {
  expect(mealItems.length).toBe(0);

  await SimulateAddMeal(mockMeals[0]);
  expect(mealItems.length).toBe(1);
  expect(mealItems.last()).toHaveTextContent(mockMeals[0].name);

  await SimulateAddMeal(mockMeals[1]);
  expect(mealItems.length).toBe(2);
  expect(mealItems.last()).toHaveTextContent(mockMeals[1].name);
});

test("Removes meal from list after clicking remove button", async () => {
  await SimulateAddMeal(mockMeals[0]);
  await SimulateAddMeal(mockMeals[1]);
  await SimulateAddMeal(mockMeals[2]);
  expect(mealItems.length).toBe(3);

  await SimulateRemoveMeal(mealItems.nth(1));
  expect(mealItems.length).toBe(2);
  expect(mealItems.nth(1)).not.toHaveTextContent(mockMeals[1].name);
});

async function SimulateAddMeal(meal = mockMeal) {
  // Click "add ingredient to meal" button
  await week.getByTitle("add").click();

  // Wait for modal to open
  await vi.waitFor(() => expect(week.getByRole("dialog")).toBeVisible(), 500);

  // Click on the meal list item
  await week
    .getByRole("dialog")
    .getByRole("button", { name: meal.name })
    .click();

  await vi.waitFor(() => {
    expect(mealItems.last()).not.toHaveTextContent("Loading");
  }, 500);
}

async function SimulateRemoveMeal(mealListItem: Locator) {
  await mealListItem.getByTitle("remove").click();
}
