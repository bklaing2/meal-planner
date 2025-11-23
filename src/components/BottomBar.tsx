import type { LinkProps } from "@tanstack/react-router";
import ButtonLink from "./ButtonLink";

export default function BottomBar() {
	return (
		<footer className="w-full h-16 bg-card grid auto-cols-fr grid-flow-col place-items-center">
			<Link to="/ingredients">Ingredients</Link>
			<Link to="/meals">Meals</Link>
			<Link to="/week">Week</Link>
			<Link to="/list">List</Link>
		</footer>
	);
}

function Link(props: LinkProps) {
	return <ButtonLink className="size-full" variant="ghost" {...props} />;
}
