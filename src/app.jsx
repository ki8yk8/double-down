import { useContext, useState } from "react";
import { GiTwoCoins } from "react-icons/gi";

import "./app.css";
import GameContext from "./contexts/game-context";
import Modal from "./components/modal/modal";
import TicTacToe from "./games/tic-tac-toe/tic-tac-toe";
import RangeGame from "./games/range/range";
import TypingGame from "./games/typing/type";

function App() {
	const { game_ctx, set_game_ctx } = useContext(GameContext);
	const [show_tic_tac, set_show_tic_tac] = useState(false);
	const [show_range, set_show_range] = useState(false);
	const [show_typing, set_show_typing] = useState(false);

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
				<header
					style={{ width: "60vw", margin: "0 auto", textAlign: "center" }}
				>
					<h1>Welcome to Double Down. The ultimate gamble game.</h1>
					<p>
						Complete mini games to earn your coins. Once you have 10 coins, go
						to typing game to show off your typing skills.
					</p>
				</header>

				<section style={{ marginTop: "2rem", display: "flex", gap: "2rem" }}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							flexGrow: 1,
							backgroundColor: "var(--color-blue-green)",
							padding: "1rem 1.4rem",
						}}
					>
						<h3 style={{ marginBottom: "1rem" }}>Mini Games</h3>
						<button
							className="u-link"
							onClick={() => set_show_tic_tac(true)}
							style={{
								border: "2px dashed var(--color-white)",
								marginBottom: "1rem",
								padding: "1rem",
								width: "100%",
								fontSize: "1.25rem",
								fontWeight: 600,
								color: "var(--color-white)",
							}}
						>
							<p>TicTacToe</p>
							<p
								style={{
									fontSize: "0.8rem",
									fontWeight: 400,
									marginTop: "0.25rem",
								}}
							>
								Easy game but less rewardy.
							</p>
						</button>
						<button
							className="u-link"
							onClick={() => set_show_range(true)}
							style={{
								border: "2px dashed var(--color-white)",
								marginBottom: "1rem",
								padding: "1rem",
								width: "100%",
								fontSize: "1.25rem",
								fontWeight: 600,
								color: "var(--color-white)",
							}}
						>
							<p>Range Game</p>
							<p
								style={{
									fontSize: "0.8rem",
									fontWeight: 400,
									marginTop: "0.25rem",
								}}
							>
								The ultimate gambler game. High Risk = High Reward
							</p>
						</button>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							flexGrow: 1,
							backgroundColor: "var(--color-ut-orange)",
							padding: "1rem 1.4rem",
							position: "relative"
						}}
					>
						<h3 style={{ marginBottom: "1rem" }}>Ultimate Game</h3>
						<button
							className="u-link"
							onClick={() => set_show_typing(true)}
							style={{
								border: "2px dashed var(--color-white)",
								marginBottom: "1rem",
								padding: "1rem",
								width: "100%",
								height: "100%",
								fontSize: "1.25rem",
								fontWeight: 600,
								color: "var(--color-white)",
							}}
						>
							<p>Typing Master</p>
							<p
								style={{
									fontSize: "0.9rem",
									fontWeight: 400,
									marginTop: "0.25rem",
								}}
							>
								Have greater than 10 coins? Show off you skills with the typing game.
							</p>
						</button>
					</div>
				</section>
			</main>

			<Modal isOpen={show_tic_tac} onClose={() => set_show_tic_tac(false)}>
				<TicTacToe />
			</Modal>

			<Modal isOpen={show_range} onClose={() => set_show_range(false)}>
				<RangeGame />
			</Modal>

			{show_typing && <TypingGame onClose={() => set_show_typing(false)} />}
		</>
	);
}

export default App;
