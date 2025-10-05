// first always have x
export function get_marker(first, current) {
	if (current === first) {
		return "x";
	} else {
		return "o";
	}
}

export const WIN_CONDITIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

export function is_game_over(grid) {
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

export function get_random_move(arr, n = 1) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export function compute_move(grid, bot_sign) {
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