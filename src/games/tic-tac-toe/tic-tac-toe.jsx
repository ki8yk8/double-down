import { useContext, useEffect, useState } from "react";
import { LuSwords } from "react-icons/lu";
import { BsXCircle, BsCircle } from "react-icons/bs";

import Cell from "./cell";
import { compute_move, get_marker, is_game_over } from "./utils.js";

import styles from "./tic-tac-toe.module.css";
import gameContext from "../../contexts/game-context.jsx";

export default function TicTacToe() {
	const { game_ctx, set_game_ctx } = useContext(gameContext);

	const [game, set_game] = useState({
		grid: Array(9).fill(null),
		first: null,
		current: null,
		winner: undefined,
		active: false,
	});

	// at first set first and current same randomly
	useEffect(() => {
		if (!game.active) return;

		// if random number is even then bot else user
		const rnd_number = Math.floor(Math.random() * 20);
		const rnd_first = rnd_number % 2 === 0 ? "bot" : "you";

		set_game((prev) => ({
			...prev,
			first: rnd_first,
			current: rnd_first,
		}));
	}, [game.active]);

	// if turn is of bot then do turn after say 1 second
	useEffect(() => {
		if (game.current !== "bot" || !game.active) return;

		const move_timeout = setTimeout(() => {
			set_game((prev) => {
				const move_index = compute_move(
					prev.grid,
					game.first === "bot" ? "x" : "o"
				);

				const updated_grid = [...prev.grid];
				updated_grid[move_index] = get_marker(prev.first, prev.current);

				return {
					...prev,
					grid: updated_grid,
					current: "you",
					winner:
						is_game_over(updated_grid).length > 0
							? is_game_over(updated_grid).length === 9
								? "draw"
								: prev.current
							: undefined,
					active: ![3, 9].includes(is_game_over(updated_grid).length),
				};
			});
		}, 500);

		return () => clearTimeout(move_timeout);
	}, [game.current]);

	useEffect(() => {
		if (game.winner === "you") {
			set_game_ctx((prev) => ({ ...prev, coins: prev.coins + 3 }));
		}
	}, [game.winner]);

	const handle_cell_clicked = (index) => {
		if (game.grid[index] || !game.active || game.current === "bot") return;

		set_game((prev) => {
			// next turn
			const updated_current = game.current === "bot" ? "you" : "bot";

			// update the grid
			const updated = [...prev.grid];
			updated[index] = get_marker(prev.first, prev.current);

			return {
				...prev,
				grid: updated,
				current: updated_current,
				winner:
					is_game_over(updated).length > 0
						? is_game_over(updated).length === 9
							? "draw"
							: prev.current
						: undefined,
				active: ![3, 9].includes(is_game_over(updated).length),
			};
		});
	};

	const handle_game_start = () => {
		set_game((prev) => ({ ...prev, active: true }));

		// reduce coin by 1
		set_game_ctx((prev) => ({ ...prev, coins: prev.coins - 1 }));
	};

	return (
		<section>
			<header>
				<h3 style={{ color: "var(--color-blue-green)" }}>Tic Tac Toe</h3>
				{game.active === false && typeof game.winner === "undefined" && (
					<p style={{ fontSize: "0.85rem", width: "80%" }}>
						1 coin to enter. Get 3 coins if you win else return home with
						nothing.
					</p>
				)}
			</header>
			{game.active && (
				<p
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.25rem",
						justifyContent: "center",
						marginTop: "1.25rem",
					}}
				>
					{game.current === "you" ? "Your" : "Bot's"}
					{get_marker(game.first, game.current) === "o" ? (
						<BsCircle size="1.25rem" />
					) : (
						<BsXCircle size="1.25rem" />
					)}{" "}
					turn.
				</p>
			)}
			{game.winner && is_game_over(game.grid).length !== 9 && (
				<p style={{ textAlign: "center", marginTop: "1.25rem" }}>
					Game over.{" "}
					<span style={{ textTransform: "capitalize" }}>{game.winner}</span> won
				</p>
			)}
			{game.winner && is_game_over(game.grid).length === 9 && (
				<p style={{ textAlign: "center", marginTop: "1.25rem" }}>Game draw</p>
			)}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(3, 3rem)",
					gridTemplateRows: "repeat(3, 3rem)",
					justifyContent: "center",
					marginTop: "1rem",
				}}
				className={styles["grid"]}
			>
				{game.grid.map((item, index) => (
					<Cell
						key={index}
						type={item}
						onClick={handle_cell_clicked.bind(null, index)}
						highlight={
							typeof game.winner !== "undefined" &&
							is_game_over(game.grid).length !== 9 &&
							is_game_over(game.grid).includes(index)
						}
					/>
				))}
			</div>
			{game.active === false && typeof game.winner === "undefined" && (
				<button
					className="u-primary"
					style={{ display: "block", margin: "0 auto", marginTop: "1rem" }}
					onClick={handle_game_start}
				>
					Gamble <LuSwords />
					<span style={{ display: "block", fontSize: "0.7rem" }}>
						(-1 coin)
					</span>
				</button>
			)}
		</section>
	);
}
