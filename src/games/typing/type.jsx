import { useEffect, useRef, useState } from "react";

const PARAGRAPH =
	"The toaster and I are in an ongoing feud. Every morning I politely request golden-brown perfection, and every morning it responds with charcoal. I’m convinced it has a grudge. Tomorrow I’m bringing in the air fryer as intimidation.";

function is_valid_char(char) {
	return /^[a-zA-Z0-9\p{P} ]$/u.test(char);
}

function compute_wpm(start_time, length) {
	return 0;
}

export default function TypingGame() {
	const [game, set_game] = useState({
		stage: 1,
		typed_paragraph: "",
		cpm: 0,
	});
	const start_time_ref = useRef(undefined);

	useEffect(() => {
		window.addEventListener("keydown", handle_keydown);

		return () => window.removeEventListener("keydown", handle_keydown);
	}, []);

	const handle_keydown = (event) => {
		event.preventDefault();

		if (!start_time_ref.current) {
			start_time_ref.current = Date.now();
		}

		if (!is_valid_char(event.key)) return;

		set_game((prev) => ({
			...prev,
			typed_paragraph: `${prev.typed_paragraph}${event.key}`,
			cpm:
				(Date.now() - start_time_ref.current) / prev.typed_paragraph.length + 1,
		}));
	};

	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				// backgroundColor: "var(--color-white)",
				backdropFilter: "blur(1px)",
			}}
		>
			<section
				style={{
					position: "absolute",
					width: "80vw",
					height: "80vh",
					backgroundColor: "var(--color-white)",
					border: "10px solid var(--color-blue-green)",
					bottom: "0",
					left: "10vw",
					borderRadius: "10px 10px 0 0",
					borderBottom: "none",
					padding: "30px",
				}}
			>
				<header>
					<h3 style={{ textAlign: "center", fontSize: "1.5rem" }}>
						Typing Contest
					</h3>
					<p style={{ textAlign: "center", fontSize: "0.8rem" }}>
						Type faster to score more.
					</p>
				</header>

				<main>
					<p
						style={{
							fontSize: "1.4rem",
							lineHeight: "2rem",
							textAlign: "center",
							marginTop: "2rem",
						}}
					>
						{PARAGRAPH.split("").map((item, index) => (
							<span
								key={index}
								style={{
									backgroundColor:
										index === game.typed_paragraph.length
											? "var(--color-selective-yellow)"
											: "var(--color-sky-blue)",
								}}
							>
								{item}
							</span>
						))}
					</p>
				</main>

				<footer>CPM: {game.cpm}</footer>
			</section>
		</div>
	);
}
