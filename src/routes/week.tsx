import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { STORAGE } from "@/lib/constants";
import { useCreateMeal, useInputState, useMeal, useMeals } from "@/lib/hooks";
import type { Id, Meal, NoId, On } from "@/lib/types";

export const weekMealsAtom = atomWithStorage(STORAGE.weekMeals, [] as Id<Meal>[]);

function useWeekMeals() {
  const [weekMeals, setWeekMeals] = useAtom(weekMealsAtom);
  const add = (meal: Meal) => setWeekMeals((ids) => [...ids, meal.id]);
  const remove = (meal: Meal) =>
    setWeekMeals((ids) => ids.filter((id) => id !== meal.id));

  return [weekMeals, add, remove] as const
}

export const Route = createFileRoute("/week")({
  component: RouteComponent,
});

function RouteComponent() {
  const [weekMeals, add, remove] = useWeekMeals();

  return (
    <div
      className="grid grid-cols-[1fr_min-content] auto-rows-min size-full
    overflow-y-scroll"
    >
      <h2>Meals for the Week</h2>
      <AddMeal onSelect={add} />
      <ItemGroup>
        {weekMeals.map((m) => (
          <MealItem id={m} onRemove={remove} key={m} />
        ))}
      </ItemGroup>
    </div>
  );
}

function MealItem(props: { id: Id<Meal>; onRemove: On<Meal> }) {
  const { isPending, isError, data: meal, error } = useMeal(props.id);

  if (isPending) return "Loading...";
  if (isError) return `Error: ${error}`;

  return (
    <Item key={meal.id}>
      <ItemContent className="gap-1">
        <ItemTitle>{meal.name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Button
          value={meal}
          onClick={props.onRemove}
          variant="ghost"
          className="text-destructive-foreground"
        >
          <Trash2 />
        </Button>
      </ItemActions>
    </Item>
  );
}

function AddMeal(props: { onSelect: On<Meal> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <SelectMeal onSelect={props.onSelect} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SelectMeal(props: { onSelect: On<Meal> }) {
  const [query, changeQuery] = useInputState();

  return (
    <>
      <DialogHeader>
        <DialogTitle>Select Meal</DialogTitle>
      </DialogHeader>
      <Input value={query} onChange={changeQuery} placeholder="Search Meals" />
      <div className="h-60 overflow-y-auto">
        <Meals query={query} onSelect={props.onSelect} />
      </div>
    </>
  );
}

function Meals(props: { query: string; onSelect: On<Meal> }) {
  const query = props.query.trim();

  const { isPending, isError, data: meals = [], error } = useMeals(query);

  if (isPending) return "Loading...";
  if (isError) return `Error: ${error}`;

  const mealExists = meals.some(
    (meal) => meal.name.toLowerCase() === query.toLowerCase(),
  );

  return (
    <ButtonGroup orientation="vertical" className="h-fit w-full">
      {!mealExists && <CreateNewMeal name={query} onSelect={props.onSelect} />}
      {meals.map((ing) => (
        <DialogClose asChild key={ing.id}>
          <Button
            value={ing}
            onClick={props.onSelect}
            variant="outline"
            className="w-full"
          >
            {ing.name}
          </Button>
        </DialogClose>
      ))}
    </ButtonGroup>
  );
}

function CreateNewMeal(props: { name: string; onSelect: On<Meal> }) {
  const meal: NoId<Meal> = { name: props.name, ingredients: [] };
  const createMeal = useCreateMeal();
  const onCreateMeal = () => createMeal(meal, props.onSelect);

  if (!props.name.trim()) return null;

  return (
    <DialogClose asChild>
      <Button onClick={onCreateMeal} className="w-full">
        Create New Meal: {props.name}
      </Button>
    </DialogClose>
  );
}
