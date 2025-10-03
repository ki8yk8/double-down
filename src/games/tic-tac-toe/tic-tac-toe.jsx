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

function is_game_over(grid) {
	// if all horizontal same
	const horizontal_same = [0, 1, 2].map((row) => {
		const a = grid[3 * row],
			b = grid[3 * row + 1],
			c = grid[3 * row + 2];
		return a != null && a === b && a === c;
	});
	if (horizontal_same.some(Boolean)) {
		return true;
	}

	// if all vertical same
	const vertical_same = [0, 1, 2].map((col) => {
		const a = grid[col],
			b = grid[3 + col],
			c = grid[6 + col];
		return a != null && a === b && a === c;
	});
	if (vertical_same.some(Boolean)) {
		return true;
	}

	// if diagonal same
	if (
		(grid[0] !== null && grid[0] === grid[4] && grid[0] === grid[8]) ||
		(grid[2] !== null && grid[2] === grid[4] && grid[4] === grid[6])
	) {
		return true;
	}

	return false;
}

export default function TicTacToe() {
	// bot = 0 and user = 1
	const [game, set_game] = useState({
		grid: Array(9).fill(null),
		first: null,
		current: null,
		active: true,
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

	const handle_cell_clicked = (index) => {
		if (game.grid[index] || !game.active) return;

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
				active: !is_game_over(updated),
			};
		});
	};

	return (
		<>
			{game.active && <p>{game.current}</p>}
			{!game.active && <p>Game over</p>}

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
					/>
				))}
			</div>
		</>
	);
}
