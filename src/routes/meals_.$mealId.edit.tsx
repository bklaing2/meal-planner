import { DialogDescription } from "@radix-ui/react-dialog";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import Dexie from "dexie";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithReset, RESET } from "jotai/utils";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { type ChangeEvent, useState } from "react";
import ButtonLink from "@/components/ButtonLink";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
	type CarouselProps,
} from "@/components/ui/carousel";
import { Combobox } from "@/components/ui/combobox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import {
	useArrayState,
	useCreateIngredient,
	useIngredient,
	useIngredients,
	useInputState,
} from "@/lib/hooks";
import type {
	Ingredient,
	Meal,
	MealIngredient,
	NoId,
	On,
	Optional,
	Quantity,
} from "@/lib/types";
import { UNITS_ARRAY } from "@/lib/unit";
import { pluralize } from "@/lib/utils";

const ingredientAtom = atomWithReset<Optional<Ingredient>>(undefined);
const quantityAtom = atomWithReset<Optional<Partial<Quantity>>>(undefined);
const mealIngredientAtom = atom((get) => {
	const ingredient = get(ingredientAtom);
	const quantity = get(quantityAtom);

	if (!ingredient || !quantity) return null;
	if (!quantity.amount || !quantity.unit) return null;

	return {
		...(quantity as Quantity),
		id: ingredient.id,
	};
});

export const Route = createFileRoute("/meals_/$mealId/edit")({
	component: RouteComponent,
	loader: ({ params }) => fetchMeal(params.mealId),
});

function RouteComponent() {
	const navigate = useNavigate();
	const meal = Route.useLoaderData();

	const [name, setName] = useState(meal.name);
	const [error, setError] = useState("");
	const updateName = (e: ChangeEvent<HTMLInputElement>) =>
		setName(e.target.value);

	const [ingredients, mutateIngredients] = useArrayState(meal.ingredients);

	const isNew = meal.id === -1;

	//  grid-cols-[max-content_1fr_max-content_max-content] items-baseline gap-y-2
	return (
		<div className="min-h-0 h-full max-h-full grid grid-rows-[min-content_1fr]">
			<h2>{isNew ? "New" : "Edit"} Meal</h2>
			<FieldSet className="min-h-0 h-full max-h-full">
				<FieldGroup className="min-h-0 h-full max-h-full">
					<Field className="min-h-0 h-full max-h-full grid grid-rows-[repeat(3,min-content)_1fr] grid-cols-[max-content_1fr_min-content_min-content] items-baseline gap-x-0">
						<FieldLabel htmlFor="name" className="col-span-full">
							Name
						</FieldLabel>
						<Input
							id="name"
							type="text"
							placeholder="Meal name"
							value={name}
							onChange={updateName}
							className="col-span-full"
						/>
						{/* <FieldError className="col-span-full">{error}</FieldError> */}
						<h3 className="col-start-1 -col-end-2">Ingredients</h3>
						<AddIngredient onSave={mutateIngredients.add} />
						<MealIngredients
							ingredients={ingredients}
							onEdit={(ing) =>
								mutateIngredients.update(
									(b) => b.id === ing.id,
									(b) => ({ ...b, ...ing }),
								)
							}
							onRemove={(ing) =>
								mutateIngredients.remove((b) => b.id === ing.id)
							}
						/>
					</Field>
					<Field
						className="grid grid-rows-min-2 gap-1"
						orientation="horizontal"
					>
						<Button onClick={saveMeal}>Save</Button>
						{!isNew && (
							<Button onClick={deleteMeal} variant="destructive">
								Delete
							</Button>
						)}
						<ButtonLink
							to="/meals/$mealId"
							params={{ mealId: `${meal.id}` }}
							variant="outline"
							className="col-span-full"
						>
							Cancel
						</ButtonLink>
					</Field>
				</FieldGroup>
			</FieldSet>
		</div>
	);

	async function saveMeal() {
		try {
			isNew ? await addMeal() : await updateMeal();
		} catch (error: unknown) {
			if (error instanceof Dexie.ConstraintError)
				setError("A meal with this name already exists.");
		}
	}

	async function addMeal() {
		await db.meals.add({ name, ingredients });
		navigate({
			to: "/meals",
			search: { message: "Meal added" },
			replace: true,
		});
	}

	async function updateMeal() {
		await db.meals.update(meal.id, { name, ingredients });
		navigate({
			to: "..",
			params: { mealId: `${meal.id}` },
			search: { message: "Meal updated" },
		});
	}

	async function deleteMeal() {
		await db.meals.delete(meal.id);
		navigate({ to: "/meals", search: { message: "Meal deleted" } });
	}
}

function MealIngredients(props: {
	ingredients: Meal["ingredients"];
	onEdit: On<MealIngredient>;
	onRemove: On<MealIngredient>;
}) {
	return (
		<div className="min-h-0 h-full max-h-full overflow-y-auto col-span-full grid auto-rows-min grid-cols-subgrid">
			{props.ingredients.map((ing) => (
				<MealIngredientItem
					ingredient={ing}
					onEdit={props.onEdit}
					onRemove={props.onRemove}
					key={ing.id}
				/>
			))}
		</div>
	);
}

function MealIngredientItem(props: {
	ingredient: MealIngredient;
	onEdit: On<MealIngredient>;
	onRemove: On<MealIngredient>;
}) {
	const {
		isPending,
		isError,
		data: ingredient,
		error,
	} = useIngredient(props.ingredient.id);

	if (isPending) return "Loading...";
	if (isError) return `Error: ${error}`;

	const amount = props.ingredient.amount;
	const unit = props.ingredient.unit;

	return (
		<>
			<span className="text-foreground">{ingredient.name}</span>
			<span className="text-muted-foreground text-sm ml-6">
				{amount} {pluralize(amount, unit)}
			</span>
			<EditIngredient
				ingredient={ingredient}
				quantity={props.ingredient}
				onSave={props.onEdit}
			/>
			<Button
				value={props.ingredient}
				onClick={props.onRemove}
				variant="ghost"
				className="text-destructive-foreground"
			>
				<Trash2 />
			</Button>
		</>
	);
}

function EditIngredient(props: {
	ingredient: Ingredient;
	quantity: Quantity;
	onSave: On<MealIngredient>;
}) {
	const [quantity, setQuantity] = useState<Optional<Partial<Quantity>>>(
		props.quantity,
	);
	const valid = !!quantity && !!quantity.amount && !!quantity.unit;
	const mealIngredient: MealIngredient = {
		...(quantity as Quantity),
		id: props.ingredient.id,
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" className="text-muted-foreground">
					<Pencil />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<SetQuantity
					ingredient={props.ingredient}
					quantity={quantity}
					setQuantity={setQuantity}
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							value={mealIngredient}
							onClick={props.onSave}
							disabled={!valid}
						>
							Save
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function AddIngredient(props: { onSave: On<MealIngredient> }) {
	const [api, setApi] = React.useState<CarouselApi>();
	const next = () => api?.scrollNext();

	const ingredient = useAtomValue(ingredientAtom);
	const setIngredient = useSetAtom(ingredientAtom);
	const [quantity, setQuantity] = useAtom(quantityAtom);
	const mealIngredient = useAtomValue(mealIngredientAtom);

	function onSave() {
		if (!mealIngredient) throw new Error("Meal ingredient is not set");
		props.onSave(mealIngredient);

		setIngredient(RESET);
		setQuantity(RESET);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost">
					<Plus />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<StepsCarousel setApi={setApi}>
					<SelectIngredient onSelect={next} />
					<SetQuantity
						ingredient={ingredient}
						quantity={quantity}
						setQuantity={setQuantity}
					/>
				</StepsCarousel>
				<DialogFooter>
					<DialogClose asChild>
						<Button onClick={onSave} disabled={!mealIngredient}>
							Save
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function StepsCarousel({ children, ...props }: CarouselProps) {
	const CarouselItems = () =>
		React.Children.toArray(children).map((c, i) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: OK for static content
			<CarouselItem className="flex flex-col gap-6" key={i}>
				{c}
			</CarouselItem>
		));

	return (
		<Carousel {...props}>
			<CarouselContent>
				<CarouselItems />
			</CarouselContent>
		</Carousel>
	);
}

function SelectIngredient(props: { onSelect: On<Ingredient> }) {
	const [query, changeQuery] = useInputState();

	return (
		<>
			<DialogHeader>
				<DialogTitle>Add Ingredient</DialogTitle>
			</DialogHeader>
			<Input
				value={query}
				onChange={changeQuery}
				placeholder="Search Ingredients"
			/>
			<div className="h-60 overflow-y-auto">
				<Ingredients query={query} onSelect={props.onSelect} />
			</div>
		</>
	);
}

function SetQuantity(props: {
	ingredient: Optional<Ingredient>;
	quantity: Optional<Partial<Quantity>>;
	setQuantity: On<Partial<Quantity>>;
}) {
	const [open, setOpen] = useState(false);

	const setAmount = (e: ChangeEvent<HTMLInputElement>) =>
		props.setQuantity({ ...props.quantity, amount: Number(e.target.value) });

	const setUnit = (unit: Quantity["unit"]) =>
		props.setQuantity({ ...props.quantity, unit });

	if (!props.ingredient) return null;

	return (
		<>
			<DialogHeader>
				<DialogTitle>Quantity</DialogTitle>
				<DialogDescription>{props.ingredient.name}</DialogDescription>
			</DialogHeader>
			<div className="h-60 overflow-y-auto grid grid-cols-[5rem_1fr] gap-2">
				<Input
					value={props.quantity?.amount ?? ""}
					onChange={setAmount}
					type="number"
					min={0}
				/>
				<Combobox
					placeholderButton="Unit"
					placeholderNoResults="No units found, press enter to use custom unit"
					options={UNITS_ARRAY.map((u) => ({ value: u.key, label: u.key }))}
					open={open}
					setOpen={setOpen}
					value={props.quantity?.unit ?? ""}
					setValue={setUnit}
					className="w-full"
					onSubmitEmpty={setUnit}
				/>
			</div>
		</>
	);
}

function Ingredients(props: { query: string; onSelect: On<Ingredient> }) {
	const query = props.query.trim();
	const setSelectedIngredient = useSetAtom(ingredientAtom);

	const {
		isPending,
		isError,
		data: ingredients = [],
		error,
	} = useIngredients(query);

	if (isPending) return "Loading...";
	if (isError) return `Error: ${error}`;

	function onSelectIngredient(ingredient: Ingredient) {
		setSelectedIngredient(ingredient);
		props.onSelect(ingredient);
	}

	const ingredientExists = ingredients.some(
		(ing) => ing.name.toLowerCase() === query.toLowerCase(),
	);

	return (
		<ButtonGroup orientation="vertical" className="h-fit w-full">
			{!ingredientExists && (
				<CreateNewIngredient name={query} onSelect={onSelectIngredient} />
			)}
			{ingredients.map((ing) => (
				<Button
					value={ing}
					onClick={onSelectIngredient}
					variant="outline"
					className="w-full"
					key={ing.id}
				>
					{ing.name}
				</Button>
			))}
		</ButtonGroup>
	);
}

function CreateNewIngredient(props: {
	name: string;
	onSelect: On<Ingredient>;
}) {
	const ingredient: NoId<Ingredient> = { name: props.name };
	const createIngredient = useCreateIngredient();
	const onCreateIngredient = () => createIngredient(ingredient, props.onSelect);

	if (!props.name.trim()) return null;

	return (
		<Button onClick={onCreateIngredient} className="w-full">
			Create New Ingredient: {props.name}
		</Button>
	);
}

async function fetchMeal(mealId: string): Promise<Meal> {
	if (!mealId)
		throw redirect({
			to: "/meals",
			search: { error: "Meal not found" },
		});

	if (mealId === "new") return { id: -1, name: "", ingredients: [] };

	const meals = await db.meals
		.where("id")
		.equals(Number(mealId))
		.limit(1)
		.toArray();

	if (meals.length === 0)
		throw redirect({
			to: "/meals",
			search: { error: "Meal not found" },
		});

	return meals[0];
}
