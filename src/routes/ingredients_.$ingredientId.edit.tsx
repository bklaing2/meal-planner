import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Dexie from "dexie";
import { type ChangeEvent, useState } from "react";
import ButtonLink from "@/components/ButtonLink";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import { fetchIngredient } from "@/lib/fetch";
import type { Id, Ingredient } from "@/lib/types";

export const Route = createFileRoute("/ingredients_/$ingredientId/edit")({
  component: RouteComponent,
  loader: ({ params }) =>
    fetchIngredient(params.ingredientId as Id<Ingredient> | "new"),
});

function RouteComponent() {
  const navigate = useNavigate();
  const ingredient = Route.useLoaderData();

  const [name, setName] = useState(ingredient.name);
  const updateName = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const [error, setError] = useState("");

  const isNew = ingredient.id === -1;

  return (
    <div>
      <h2>{isNew ? "New" : "Edit"} Ingredient</h2>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Ingredient name"
              value={name}
              onChange={updateName}
            />
            <FieldError>{error}</FieldError>
          </Field>
          <Field orientation="horizontal">
            <Button onClick={saveIngredient}>Save</Button>
            {!isNew && (
              <Button onClick={deleteIngredient} variant="destructive">
                Delete
              </Button>
            )}
            <ButtonLink
              to="/ingredients/$ingredientId"
              params={{ ingredientId: `${ingredient.id}` }}
              variant="outline"
            >
              Cancel
            </ButtonLink>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );

  async function saveIngredient() {
    try {
      isNew ? await addIngredient() : await updateIngredient();
    } catch (error: unknown) {
      if (error instanceof Dexie.ConstraintError)
        setError("An ingredient with this name already exists.");
    }
  }

  async function addIngredient() {
    await db.ingredients.add({ name });
    navigate({
      to: "/ingredients",
      search: { message: "Ingredient added" },
      replace: true,
    });
  }

  async function updateIngredient() {
    await db.ingredients.update(ingredient.id, { name });
    navigate({ to: "/ingredients", search: { message: "Ingredient updated" } });
  }

  async function deleteIngredient() {
    await db.ingredients.delete(ingredient.id);
    navigate({ to: "/ingredients", search: { message: "Ingredient deleted" } });
  }
}
