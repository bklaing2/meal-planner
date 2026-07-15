import { expect, test } from "vitest";
import { MealList } from "@/routes/meals";
import { mockMeals } from "./mocks/meal";
import { renderWithProviders } from "./util.tsx";

test("MealList", async () => {
  const { getByRole } = await renderWithProviders(
    <MealList meals={mockMeals} />,
  );
  const mealLinks = getByRole("link").elements();
  expect(mealLinks.length).toBe(mockMeals.length);
  expect(mealLinks[0]).toHaveTextContent(mockMeals[0].name);
  expect(mealLinks[2]).toHaveTextContent(mockMeals[2].name);
});
