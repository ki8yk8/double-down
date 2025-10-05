import { useContext, useState } from "react";
import { GiTwoCoins } from "react-icons/gi";

import "./app.css";
import GameContext from "./contexts/game-context";
import Modal from "./components/modal/modal";
import TicTacToe from "./games/tic-tac-toe/tic-tac-toe";

function App() {
	const {game_ctx, set_game_ctx} = useContext(GameContext);
	const [show_tic_tac, set_show_tic_tac] = useState(true);

	return (
		<>
			<header
				style={{
					padding: "1rem 0",
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.25rem",
						fontSize: "1.2rem",
						fontWeight: 500,
					}}
				>
					<GiTwoCoins size="2rem" color="var(--color-selective-yellow)" />
					<span style={{ color: "var(--color-ut-orange)", fontWeight: 600 }}>
						Coins:
					</span>
					{game_ctx?.coins}
				</div>
			</header>

			<main>
				<button className="u-link" onClick={() => set_show_tic_tac(true)}>
					TicTacToe
				</button>
				<button className="u-link">Range Select Game</button>
			</main>

			<Modal isOpen={show_tic_tac} onClose={() => set_show_tic_tac(false)}>
				<TicTacToe />
			</Modal>
		</>
	);
}

export default App;
