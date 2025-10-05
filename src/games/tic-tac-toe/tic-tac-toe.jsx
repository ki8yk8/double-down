import { useEffect, useState } from "react";
import Cell from "./cell";

import styles from "./tic-tac-toe.module.css";

// first always have x
function get_marker(first, current) {
	if (current === first) {
		return "x";
	} else {
		return "o";
	}
}

const WIN_CONDITIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

function is_game_over(grid) {
	// if win condition have same symbol then win
	const found_win_conditions = WIN_CONDITIONS.filter(([a, b, c]) => {
		if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
			return true;
		}

		return false;
	});
	if (found_win_conditions.length > 0) {
		return found_win_conditions[0];
	}

	// if all filled then draw
	if (grid.every((item) => item)) {
		return [0, 1, 2, 3, 4, 5, 6, 7, 8];
	}

	return [];
}

function get_random_move(arr, n = 1) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function compute_move(grid, bot_sign) {
	const opponent_sign = bot_sign === "x" ? "o" : "x";

	// if one step away from win conditions; both bot and themselves
	const possible_win_conditions = WIN_CONDITIONS.filter(([a, b, c]) => {
		if (
			(grid[a] && grid[a] === grid[b] && grid[c] === null) ||
			(grid[a] && grid[a] === grid[c] && grid[b] === null) ||
			(grid[b] && grid[b] === grid[c] && grid[a] === null)
		) {
			return true;
		}

		return false;
	});

	const possible_user_win_conditions = possible_win_conditions.filter(
		([a, b, c]) => ![grid[a], grid[b], grid[c]].includes(bot_sign)
	);
	const possible_bot_win_conditions = possible_win_conditions.filter(
		([a, b, c]) => ![grid[a], grid[b], grid[c]].includes(opponent_sign)
	);

	// if bot is going to win then, return win move 90% of the time
	if (Math.random() < 0.9 && possible_bot_win_conditions.length > 0) {
		return get_random_move(possible_bot_win_conditions).filter(
			(index) => grid[index] === null
		)[0];
	}

	// if user is going to win and bot cannot win in one move, then return block move 75% of the time
	if (Math.random() < 0.75 && possible_user_win_conditions.length > 0) {
		return get_random_move(possible_user_win_conditions).filter(
			(index) => grid[index] === null
		)[0];
	}

	// if there are no possible win conditions then first goal is center
	// do this only 20% of the time; to let user also win
	if (Math.random() < 0.2 && grid[4] === null) {
		return 4;
	}

	// then corners
	const corners = [0, 2, 6, 8];
	const available_corners = corners.filter((index) => grid[index] === null);

	// do this 30% of the time
	if (Math.random() < 0.3 && available_corners.length > 0) {
		return get_random_move(available_corners);
	}

	// then random
	const free_corners = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(
		(index) => grid[index] === null
	);
	return get_random_move(free_corners);
}

export default function TicTacToe() {
	const [game, set_game] = useState({
		grid: Array(9).fill(null),
		first: null,
		current: null,
		winner: undefined,
	});

	// at first set first and current same randomly
	useEffect(() => {
		// if random number is even then bot else user
		const rnd_number = Math.floor(Math.random() * 20);
		const rnd_first = rnd_number % 2 === 0 ? "bot" : "user";

		set_game((prev) => ({
			...prev,
			first: rnd_first,
			current: rnd_first,
		}));
	}, []);

	// if turn is of bot then do turn after say 1 second
	useEffect(() => {
		if (game.current !== "bot" || game.winner) return;

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
					current: "user",
					winner:
						is_game_over(updated_grid).length > 0
							? is_game_over(updated_grid).length === 9
								? "draw"
								: prev.current
							: undefined,
				};
			});
		}, 500);

		return () => clearTimeout(move_timeout);
	}, [game.current]);

	const handle_cell_clicked = (index) => {
		if (
			game.grid[index] ||
			typeof game.winner !== "undefined" ||
			game.current === "bot"
		)
			return;

		set_game((prev) => {
			// next turn
			const updated_current = game.current === "bot" ? "user" : "bot";

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
			};
		});
	};

	return (
		<>
			{!game.winner && (
				<p>
					{game.current} ({get_marker(game.first, game.current)})
				</p>
			)}
			{game.winner && is_game_over(game.grid).length !== 9 && (
				<p>Game over. Winner is {game.winner}</p>
			)}
			{game.winner && is_game_over(game.grid).length === 9 && (
				<p>Game over. Game draw</p>
			)}

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(3, 3rem)",
					gridTemplateRows: "repeat(3, 3rem)",
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
		</>
	);
}
