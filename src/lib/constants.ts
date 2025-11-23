import { atomWithStorage } from "jotai/utils";
// import { queryOptions } from "@tanstack/react-query";
import type { MassUnit, VolumeUnit } from "@/lib/unit";

export const STORAGE = {
	weekMeals: "weekMeals",
} as const;

export const QUERY_OPTIONS = {
	// get weekMeals() {
	//   return queryOptions({
	//     queryKey: ["weekMeals"],
	//     queryFn: async () => {
	//       console.log(await fetchWeekMeals());
	//       return await fetchWeekMeals();
	//     },
	//     initialData: [],
	//   });
	// },
	// get weekIngredients() {
	//   return queryOptions({
	//     queryKey: ["weekIngredients"],
	//     queryFn: () => fetchWeekIngredients(),
	//     initialData: [],
	//   });
	// },
};

export const massUnitAtom = atomWithStorage<MassUnit>("massUnit", "pound");
export const volumeUnitAtom = atomWithStorage<VolumeUnit>("volumeUnit", "cup");
