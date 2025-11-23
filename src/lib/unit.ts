import type { Quantity, Unit, UnitType } from "@/lib/types";

// Multipliers
const BASE = 1 as const;

//// Mass
const GRAM = BASE;
const MILLIGRAM = GRAM / 1000;
const KILOGRAM = GRAM * 1000;

const OUNCE = BASE * 28.34952;
const POUND = OUNCE * 16;

//// Volume
const LITER = BASE;
const MILLILITER = LITER / 1000;

const GALLON = BASE * 3.78541;
const QUART = GALLON / 4;
const PINT = GALLON / 8;
const CUP = GALLON / 16;
const FLUID_OUNCE = GALLON / 128;
const TABLESPOON = FLUID_OUNCE / 2;
const TEASPOON = FLUID_OUNCE / 6;

// Units

//// Mass (Base = gram)
const MASS_UNITS = {
	milligram: { type: "mass", id: "mg", mult: MILLIGRAM },
	gram: { type: "mass", id: "g", mult: GRAM },
	kilogram: { type: "mass", id: "kg", mult: KILOGRAM },

	ounce: { type: "mass", id: "oz", mult: OUNCE },
	pound: { type: "mass", id: "lb", mult: POUND },
} as const satisfies Record<string, Unit>;

//// Volume (Base = liter)
const VOLUME_UNITS = {
	milliliter: { type: "volume", id: "ml", mult: MILLILITER },
	liter: { type: "volume", id: "l", mult: LITER },

	teaspoon: { type: "volume", id: "tsp", mult: TEASPOON },
	tablespoon: { type: "volume", id: "tbsp", mult: TABLESPOON },
	fluidOunce: { type: "volume", id: "fl oz", mult: FLUID_OUNCE },
	cup: { type: "volume", id: "cup", mult: CUP },
	pint: { type: "volume", id: "pt", mult: PINT },
	quart: { type: "volume", id: "qt", mult: QUART },
	gallon: { type: "volume", id: "gal", mult: GALLON },
} as const satisfies Record<string, Unit>;

export const UNITS = {
	...MASS_UNITS,
	...VOLUME_UNITS,
} as const;

export type MassUnit = keyof typeof MASS_UNITS;
export type VolumeUnit = keyof typeof VOLUME_UNITS;

export const UNITS_ARRAY = Object.entries(UNITS).map(([key, value]) => ({
	key,
	...value,
}));

export function simplify(quantities: Quantity[]): Quantity[] {
	const total: Record<UnitType, number> = { mass: 0, volume: 0 };

	// Sum quantities in base units
	quantities.forEach((quantity) => {
		const unit =
			quantity.unit in UNITS
				? UNITS[quantity.unit as keyof typeof UNITS]
				: ({
						type: quantity.unit,
						id: quantity.unit,
						mult: 1,
					} satisfies Unit);

		if (!(unit.type in total)) total[unit.type] = 0;
		total[unit.type] += quantity.amount * unit.mult;
	});

	// Convert totals to nearest appropriate units
	if (total.mass > 0) {
		const massUnit = getNearestUnit(MASS_UNITS, total.mass);
		total[massUnit] = total.mass / UNITS[massUnit as keyof typeof UNITS].mult;
		delete total.mass;
	}
	if (total.volume > 0) {
		const volumeUnit = getNearestUnit(VOLUME_UNITS, total.volume);
		total[volumeUnit] =
			total.volume / UNITS[volumeUnit as keyof typeof UNITS].mult;
		delete total.volume;
	}

	// Return as array
	return Object.entries(total)
		.filter(([_, amount]) => amount !== 0)
		.map(([unit, amount]) => ({ amount, unit })) satisfies Quantity[];
}

function getNearestUnit(units: Record<string, Unit>, amount: number) {
	let nearestUnit = Object.keys(units)[0];

	Object.entries(units)
		.sort(([, a], [, b]) => a.mult - b.mult)
		.forEach(([unitKey, unit]) => {
			if (unit.mult > amount) return;
			nearestUnit = unitKey;
		});

	return nearestUnit;
}
