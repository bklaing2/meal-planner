import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { db } from "@/lib/db";
import { GetAllIngredients } from "@/lib/ingredient";
import { GetAllMeals } from "@/lib/meal";
import { wait } from "@/lib/utils";
import {
  CopyDataToClipboardButton,
  ImportDataFromClipboardButton,
} from "@/routes/settings";
import { mockIngredients } from "./mocks/ingredient";
import { mockMeals } from "./mocks/meal";

const dataJson = JSON.stringify({
  ingredients: mockIngredients,
  meals: mockMeals,
});

test("CopyDataToClipboardButton", async () => {
  const writeToClipboard = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue();
  const { getByText } = await render(
    <CopyDataToClipboardButton json={dataJson} />,
  );
  const copyDataToClipboardButton = getByText("Copy data to clipboard");
  await copyDataToClipboardButton.click();

  expect(writeToClipboard).toHaveBeenCalledOnce();
  expect(writeToClipboard).toHaveBeenLastCalledWith(dataJson);
});

test("ImportDataFromClipboardButton", async () => {
  await db.ingredients.clear();
  await db.meals.clear();

  const readFromClipboard = vi
    .spyOn(navigator.clipboard, "readText")
    .mockResolvedValue(dataJson);
  const { getByText } = await render(<ImportDataFromClipboardButton />);
  const importDataFromClipboardButton = getByText(
    "Import data from clipboard ",
  );
  await importDataFromClipboardButton.click();

  await wait(0.1);

  expect(readFromClipboard).toHaveBeenCalledOnce();
  expect(await GetAllIngredients()).toEqual(mockIngredients);
  expect(await GetAllMeals()).toEqual(mockMeals);
});
