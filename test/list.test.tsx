import { afterEach, beforeEach, expect, test } from "vitest";
import type { Locator } from "vitest/browser";
import { Groceries } from "@/routes/list.tsx";
import { renderWithProviders } from "./util.tsx";

let groceries = await renderWithProviders(<Groceries weekIngredients={[]} />);
let groceryList: Locator;

async function renderGroceries() {
  await groceries.unmount();
  groceries = await renderWithProviders(<Groceries weekIngredients={[]} />);

  groceryList = groceries.getByRole("list");
}

beforeEach(async () => {
  await renderGroceries();
});

afterEach(async () => {
  await groceries.unmount();
});

test("Renders all components", async () => {
  expect(groceryList).toBeInTheDocument();
});
