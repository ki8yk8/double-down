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

export default function TicTacToe() {
	// bot = 0 and user = 1
	const [game, set_game] = useState({
		grid: Array(9).fill(null),
		first: null,
		current: null,
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
		if (game.grid[index]) return;

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
			};
		});
	};

	return (
		<>
		<p>{game.current}</p>
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
