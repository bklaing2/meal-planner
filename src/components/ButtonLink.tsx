import { Link, type LinkProps } from "@tanstack/react-router";
import { Button, type ButtonProps } from "./ui/button";

type Props<T> = Pick<ButtonProps<T>, "variant" | "className" | "size"> &
	LinkProps;

export default function ButtonLink<T>(props: Props<T>) {
	const { variant, className, size, ...linkProps } = props;
	const buttonProps = { variant, className, size };

	return (
		<Button {...buttonProps} asChild>
			<Link {...linkProps} />
		</Button>
	);
}
