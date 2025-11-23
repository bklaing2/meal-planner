import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type ChangeEvent, useMemo, useState } from "react";
import {
	createIngredient,
	createMeal,
	fetchIngredient,
	fetchIngredients,
	fetchMeal,
	fetchMeals,
} from "@/lib/fetch";
import type { Fn, Id, Ingredient, Meal, NoId, On, Where } from "@/lib/types";

// Sates
type ArrayActions<T> = {
	set: React.Dispatch<React.SetStateAction<T[]>>;
	add: (item: T) => void;
	remove: (where: Where<T>) => void;
	update: (where: Where<T>, to: Fn<T, T>) => void;
};

export function useArrayState<T>(initialValue: T[] = []) {
	const [array, set] = useState(initialValue);

	const actions = useMemo(
		() =>
			({
				set,
				add: (item) => set((arr) => [...arr, item]),
				remove: (where) => set((arr) => arr.filter((b) => !where(b))),
				update: (where, to) =>
					set((arr) => arr.map((b) => (where(b) ? to(b) : b))),
			}) as ArrayActions<T>,
		[],
	);

	return [array, actions] as const;
}

export function useInputState(initialValue = "") {
	const [value, setValue] = useState(initialValue);
	const changeValue = (e: ChangeEvent<HTMLInputElement>) =>
		setValue(e.target.value);

	return [value, changeValue] as const;
}

// Queries & Mutations
const useQueryKeyFn = <T, R>(
	queryKey: unknown[],
	queryFn: (...args: T[]) => Promise<R>,
	...queryFnArgs: T[]
) =>
	useQuery({
		queryKey,
		queryFn: () => queryFn(...queryFnArgs),
	});

export const useIngredients = (query?: string) =>
	useQueryKeyFn(["ingredients", query], fetchIngredients, query);

export const useIngredient = (id: Id<Ingredient>) =>
	useQueryKeyFn(["ingredients", id], fetchIngredient, id);

export function useCreateIngredient() {
	const queryClient = useQueryClient();

	const ingredients = useMutation({
		mutationFn: createIngredient,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["ingredients"] }),
	});

	return function mutate(
		ingredient: NoId<Ingredient>,
		onSuccess?: On<Ingredient>,
	) {
		ingredients.mutate(ingredient, { onSuccess });
	};
}

export const useMeals = (query?: string | Id<Meal>[]) =>
	useQueryKeyFn(["meals", query], fetchMeals, query);

export const useMeal = (id: Id<Meal>) =>
	useQueryKeyFn(["meals", id], fetchMeal, id);

export function useCreateMeal() {
	const queryClient = useQueryClient();

	const meals = useMutation({
		mutationFn: createMeal,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["meals"] }),
	});

	return function mutate(meal: NoId<Meal>, onSuccess?: On<Meal>) {
		meals.mutate(meal, { onSuccess });
	};
}
