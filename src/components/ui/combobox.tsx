"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { On } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
	placeholderButton: string;
	placeholderSearch?: string;
	placeholderNoResults?: React.ReactNode;
	options: { value: string; label: string }[];
	open: boolean;
	value: string;
	setOpen: (open: boolean) => void;
	setValue: (value: string) => void;
	onSubmitEmpty?: On<string>;
	className?: string;
}

export function Combobox({
	placeholderSearch = "Search...",
	placeholderNoResults = "No results found.",
	...props
}: Props) {
	const [value, setValue] = useState(props.value);

	function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key !== "Enter" || !props.onSubmitEmpty) return;
		event.preventDefault();

		props.setOpen(false);
		props.onSubmitEmpty(value);
	}

	return (
		<Popover open={props.open} onOpenChange={props.setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={props.open}
					className={cn("w-[200px] justify-between", props.className)}
				>
					{props.value
						? props.options.find((option) => option.value === props.value)
								?.label || props.value
						: props.placeholderButton}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						value={value}
						onValueChange={setValue}
						placeholder={placeholderSearch}
						className="h-9"
						onKeyDown={onKeyDown}
					/>
					<CommandList>
						<CommandEmpty>{placeholderNoResults}</CommandEmpty>
						<CommandGroup>
							{props.options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(currentValue) => {
										props.setValue(
											currentValue === props.value ? "" : currentValue,
										);
										props.setOpen(false);
									}}
								>
									{option.label}
									<Check
										className={cn(
											"ml-auto",
											props.value === option.value
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
