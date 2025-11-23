import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Optional } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pluralize(
  count: Optional<string | number>,
  singular: string,
  plural?: string,
) {
  if (Number(count) === 1) return singular;
  return plural || `${singular}s`;
}
