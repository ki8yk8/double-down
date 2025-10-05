import { useContext, useEffect, useRef, useState } from "react";
import { GiKeyboard } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import GameContext from "../../contexts/game-context";

const PARAGRAPH =
	"The toaster and I are in an ongoing feud. Every morning I politely request golden-brown perfection, and every morning it responds with charcoal. I’m convinced it has a grudge. Tomorrow I’m bringing in the air fryer as intimidation.";

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

function compute_score(WPM, accuracy) {
	return (WPM * 10 * accuracy) / 100;
}

export default function TypingGame({ onClose }) {
	const { game_ctx, set_game_ctx } = useContext(GameContext);
	const [game, set_game] = useState({
		stage: 0,
		typed_paragraph: "",
		cpms: [0],
		brought: 0,
	});
	const typed_paragraph_ref = useRef("");
	const start_time_ref = useRef(undefined);

	useEffect(() => {
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

	const handle_typing_start = () => {
		if (game_ctx.coins < 10) {
			return;
		}

		set_game((prev) => ({ ...prev, stage: 1 }));
		set_game_ctx((prev) => ({ ...prev, coins: prev.coins - 10 }));
	};

	const handle_offer_clicked = (accepted) => {
		if (accepted) {
			set_game_ctx((prev) => ({ ...prev, coins: 0 }));
			set_game((prev) => ({ ...prev, stage: 3, brought: game_ctx.coins * 10 }));
		} else {
			set_game((prev) => ({ ...prev, stage: 3 }));
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
				className="u-flex u-flex-column"
				style={{
					position: "absolute",
					width: "min(95vw, 80rem)",
					height: "min(90vh, 80vh)",
					backgroundColor: "var(--color-white)",
					border: "10px solid var(--color-blue-green)",
					outline: "1px solid var(--color-white)",
					bottom: "0",
					left: "50%",
					transform: "translateX(-50%)",
					borderRadius: "10px 10px 0 0",
					borderBottom: "none",
					padding: "min(30px, 5vw)",
				}}
			>
				<header>
					<h3 style={{ textAlign: "center", fontSize: "1.5rem" }}>
						Typing Contest
					</h3>
					<p style={{ textAlign: "center", fontSize: "0.8rem" }}>
						Type faster and accurate to win
					</p>
					<button
						style={{ position: "absolute", right: "10px", top: "10px" }}
						onClick={onClose}
					>
						<MdClose size="1.25rem" color="var(--color-prussian-blue)" />
					</button>
				</header>

				<main className="u-flex-grow">
					{[3, 2].includes(game.stage) && (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "2rem",
								marginTop: "2rem",
							}}
						>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: "0.4rem",
								}}
							>
								<p>
									⚡ Speed:{" "}
									<span className="u-medium">
										{compute_mean(game.cpms)} WPM
									</span>
								</p>
								<p>
									🎯 Accuracy:{" "}
									<span className="u-medium">
										{get_accuracy(game.typed_paragraph, PARAGRAPH)}%
									</span>
								</p>
								<p>
									🏆 Final Score:{" "}
									<span className="u-medium">
										{compute_score(
											compute_mean(game.cpms),
											get_accuracy(game.typed_paragraph, PARAGRAPH) +
												game.brought
										)}
									</span>
								</p>
							</div>

							{game.stage === 2 && (
								<>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: "0.4rem",
										}}
									>
										<p>🤑🤑 Got Coins? Bribe the score system!</p>
										<p>10 coins = +100 points</p>
										<p>(We don't believe in fair play)</p>
									</div>

									<div
										className="u-flex u-gap-1 u-mobile-stack"
										style={{ flexWrap: "nowrap" }}
									>
										<button
											className="u-primary"
											onClick={handle_offer_clicked.bind(null, true)}
										>
											Spend {game_ctx.coins} Coins → +{game_ctx.coins * 10}{" "}
											Score
										</button>
										<button
											className="u-secondary"
											onClick={handle_offer_clicked.bind(null, false)}
										>
											Nahh. I am okay.
										</button>
									</div>
								</>
							)}
						</div>
					)}

					{game.stage === 0 && (
						<>
							<p
								style={{
									textAlign: "center",
									padding: "0 10%",
									marginTop: "3rem",
								}}
							>
								Test your typing skills. Each try costs you 10 coins but, with
								those coins you get chance to compete for the leaderboard. Click
								start button and the time starts when you type first character.
							</p>
							<button
								className="u-primary"
								style={{
									display: "block",
									margin: "0 auto",
									marginTop: "2rem",
								}}
								onClick={handle_typing_start}
								disabled={game_ctx.coins <= 10}
							>
								<p
									style={{
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
									}}
								>
									Start typing <GiKeyboard size="1.5rem" />
								</p>
								<span style={{ display: "block", fontSize: "0.7rem" }}>
									(-10 coin)
								</span>
							</button>
						</>
					)}
					{game.stage === 1 && (
						<p
							style={{
								fontSize: "min(1.4rem, 4vw)",
								lineHeight: "min(2rem, 5vw)",
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
					)}
				</main>

				{game.stage === 1 && (
					<footer className="u-flex u-gap-2 u-mobile-gap-1 u-mobile-text-sm">
						<p>{compute_mean(game.cpms)} WPM</p>
						<p>{get_accuracy(game.typed_paragraph, PARAGRAPH)}% Accurate</p>
					</footer>
				)}
			</section>
		</div>
	);
}
