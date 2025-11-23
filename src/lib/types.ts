import type { useInputState } from "@/lib/hooks";

export type UnitType = Custom<"mass" | "volume">;
export type Unit = { type: UnitType; id: string; mult: number };
export type Quantity = { amount: number; unit: UnitType };

export type Ingredient = {
	id: number;
	name: string;
};

export type MealIngredient = Quantity & {
	id: Id<Ingredient>;
};

export type Meal = {
	id: number;
	name: string;
	ingredients: MealIngredient[];
};

export type Storage = {
	weekMeals: Id<Meal>[];
};

export type OneOf<T extends unknown[]> = T[number];
export type Optional<T> = T | undefined;
export type Custom<U extends T, T = string> = U | (T & {});
export type NoId<T> = Omit<T, "id">;
export type Id<T extends { id: unknown }> = T["id"];
export type Fn<A = never, R = unknown> = (...args: A[]) => R;
export type Where<T> = Fn<T, boolean>;
export type On<T> = (value: T) => void;
export type Filter<A = unknown, B = unknown> = (a: A, b: B) => boolean;

export type ChangeValue = ReturnType<typeof useInputState>[1];
