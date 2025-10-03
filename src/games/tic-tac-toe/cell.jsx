import { BsXCircle, BsCircle } from "react-icons/bs";

export default function Cell({ type = "x", onClick }) {
	const Component = type === null ? null : type === "x" ? BsXCircle : BsCircle;

	return (
		<button
			style={{ background: "var(--color-white)", padding: "0.5rem" }}
			onClick={() => onClick?.()}
		>
			{type && <Component size="2rem" color="var(--color-prussian-blue)" />}
		</button>
	);
}
