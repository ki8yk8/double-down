import { BsXCircle, BsCircle } from "react-icons/bs";

export default function Cell({ type = "x", highlight = false, onClick }) {
	const Component = type === null ? null : type === "x" ? BsXCircle : BsCircle;

	return (
		<button
			style={{
				background: highlight ? "var(--color-ut-orange)" : "var(--color-white)",
				padding: "0.5rem",
			}}
			onClick={() => onClick?.()}
		>
			{type && <Component size="2rem" color="var(--color-prussian-blue)" />}
		</button>
	);
}
