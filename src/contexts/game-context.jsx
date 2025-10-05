import { createContext, useState } from "react";

const GameContext = createContext({
	coins: 0,
});

export function GameContextProvider({ children }) {
	const [game_ctx, set_game_ctx] = useState({
		coins: 8,
	});

	const value = { game_ctx, set_game_ctx };

	return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export default GameContext;
