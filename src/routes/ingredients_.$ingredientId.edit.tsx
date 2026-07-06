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
import { NEW_INGREDIENT } from "@/lib/constants";
import { db } from "@/lib/db";
import { fetchIngredient } from "@/lib/fetch";
import type { Id, Ingredient } from "@/lib/types";

const IsNew = (ingredient: Ingredient) => ingredient.id === NEW_INGREDIENT.id;

export const Route = createFileRoute("/ingredients_/$ingredientId/edit")({
  component: RouteComponent,
  loader: ({ params }) =>
    fetchIngredient(params.ingredientId as Id<Ingredient> | "new"),
});

function RouteComponent() {
  const ingredient = Route.useLoaderData();

  const navigate = useNavigate();
  const navigateToIngredients = (message: string) => () =>
    navigate({
      to: "/ingredients",
      search: { message },
      replace: true,
    });

  return (
    <EditIngredient
      ingredient={ingredient}
      afterSave={navigateToIngredients(
        IsNew(ingredient) ? "Ingredient added" : "Ingredient updated",
      )}
      afterDelete={navigateToIngredients("Ingredient deleted")}
    />
  );
}

export function EditIngredient(props: {
  ingredient: Ingredient;
  afterSave?: () => void;
  afterDelete?: () => void;
}) {
  const [name, setName] = useState(props.ingredient.name);
  const updateName = (e: ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const [error, setError] = useState("");

  const isNew = IsNew(props.ingredient);

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
            <Button onClick={saveIngredient}>
              {isNew ? "Create" : "Save"}
            </Button>
            {!isNew && (
              <Button onClick={deleteIngredient} variant="destructive">
                Delete
              </Button>
            )}
            <ButtonLink
              to="/ingredients/$ingredientId"
              params={{ ingredientId: `${props.ingredient.id}` }}
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
      props.afterSave?.();
    } catch (error: unknown) {
      if (error instanceof Dexie.ConstraintError)
        setError("An ingredient with this name already exists.");
    }
  }

  async function addIngredient() {
    await db.ingredients.add({ name });
  }

  async function updateIngredient() {
    await db.ingredients.update(props.ingredient.id, { name });
  }

  async function deleteIngredient() {
    await db.ingredients.delete(props.ingredient.id);
    props.afterDelete?.();
  }
}
