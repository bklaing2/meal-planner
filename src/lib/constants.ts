// import { queryOptions } from "@tanstack/react-query";

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

export const EXISTS = (o: unknown) => !!o;
