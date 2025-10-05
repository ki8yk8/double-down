import { useEffect, useRef, useState } from "react";

// const PARAGRAPH =
// 	"The toaster and I are in an ongoing feud. Every morning I politely request golden-brown perfection, and every morning it responds with charcoal. I’m convinced it has a grudge. Tomorrow I’m bringing in the air fryer as intimidation.";
const PARAGRAPH = "Hello";

function is_valid_char(char) {
	return /^[a-zA-Z0-9\p{P} ]$/u.test(char);
}

function get_color(index, typed, original) {
	if (index === typed.length) {
		return "var(--color-selective-yellow";
	} else if (index > typed.length) {
		return "var(--color-sky-blue)";
	} else if (typed[index] === original[index]) {
		return "var(--color-ut-orange)";
	} else {
		return "var(--color-red)";
	}
}

function compute_wpm(start_time, length) {
	const current_time = Date.now();

	const difference_in_minutes = (current_time - start_time) / (1000 * 60);
	const word_counts = length / 5;

	return Math.round(word_counts / difference_in_minutes);
}

function compute_mean(arr) {
	return Math.round(arr.reduce((sum, n) => sum + n, 0) / arr.length);
}

function get_accuracy(given, ref) {
	if (given.length === 0) return 0;

	const matched = given
		.split("")
		.filter(
			(item, index) => index < ref.length && item === ref.split("")[index]
		);

	return Math.round((matched.length / given.length) * 100);
}

export default function TypingGame() {
	const [game, set_game] = useState({
		stage: 1,
		typed_paragraph: "",
		cpms: [0],
	});
	const typed_paragraph_ref = useRef("");
	const start_time_ref = useRef(undefined);

	useEffect(() => {
		if (game.stage === 2) {
		}

		if (game.stage !== 1) return;
		window.addEventListener("keydown", handle_keydown);

		return () => window.removeEventListener("keydown", handle_keydown);
	}, [game.stage]);

	const handle_keydown = (event) => {
		event.preventDefault();

		if (!start_time_ref.current) {
			start_time_ref.current = Date.now();
		}

		if (!is_valid_char(event.key)) return;

		set_game((prev) => {
			typed_paragraph_ref.current = `${prev.typed_paragraph}${event.key}`;

			return {
				...prev,
				typed_paragraph: `${prev.typed_paragraph}${event.key}`,
				cpms: [
					...prev.cpms,
					compute_wpm(start_time_ref.current, prev.typed_paragraph.length + 1),
				],
			};
		});

		if (typed_paragraph_ref.current.length >= PARAGRAPH.length - 1) {
			set_game((prev) => ({ ...prev, stage: 2 }));
			window.removeEventListener("keydown", handle_keydown);
		}
	};

	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
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
						Type faster and accurate to win
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
									backgroundColor: get_color(
										index,
										game.typed_paragraph,
										PARAGRAPH
									),
								}}
							>
								{item}
							</span>
						))}
					</p>
				</main>

				<footer>
					<p>{compute_mean(game.cpms)} WPM</p>
					<p>{get_accuracy(game.typed_paragraph, PARAGRAPH)}% Accurate</p>
				</footer>
			</section>
		</div>
	);
}
