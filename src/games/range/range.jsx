import { useContext, useEffect, useRef, useState } from "react";
import { Range } from "react-range";
import { LuSwords } from "react-icons/lu";
import GameContext from "../../contexts/game-context";

function get_instruction(stage) {
	switch (stage) {
		case 0:
			return "Pick a number range. Smaller range = bigger multiplier. Miss it and you lose it all!";
			break;
		case 1:
			return "Lock in your range wisely. Skinny range = fat rewards.";
			break;
		case 2:
			return "Rolling the number...";
			break;
		case 3:
			return "And the number is...";
			break;
	}
}

function get_coin(max, min) {
	const diff = max - min;
	const reward = Math.round(1 + 14 * Math.pow((100 - diff) / 99, 2));

	return reward;
}

export default function RangeGame() {
	const { game_ctx, set_game_ctx } = useContext(GameContext);

	// [winner, min guess, max guess]
	const [range_values, set_range_values] = useState([0, 10, 90]);
	const p0_val_ref = useRef(0);

	// stage: 0 = initial, 1 = user is selecting, 2 = winner is happening, 3 = winner announced
	const [game, set_game] = useState({
		stage: 0,
		random_number: undefined,
	});

	const handle_game_btn_clicked = () => {
		if (game.stage === 0) {
			set_game_ctx((prev) => ({ ...prev, coins: prev.coins - 5 }));
		}

		set_game((prev) => ({
			...prev,
			stage: prev.stage + 1,
		}));

		if (game.stage === 1) {
			set_game((prev) => ({
				...prev,
				random_number: Math.floor(Math.random() * 100),
			}));
		}
	};

	useEffect(() => {
		if (game.stage === 3) {
			if (
				range_values[1] <= game.random_number &&
				game.random_number <= range_values[2]
			) {
				set_game_ctx((prev) => ({
					...prev,
					coins: prev.coins + get_coin(range_values[2], range_values[1]),
				}));
			}
			return;
		}

		if (game.stage !== 2 && typeof game.random_number === "undefined") return;

		const animate_interval = setInterval(() => {
			if (p0_val_ref.current >= game.random_number) {
				clearInterval(animate_interval);

				set_game((prev) => ({ ...prev, stage: prev.stage + 1 }));
			}

			p0_val_ref.current += 1;
			set_range_values((prev) => [p0_val_ref.current, prev[1], prev[2]]);
		}, 200);

		return () => clearInterval(animate_interval);
	}, [game.stage]);

	return (
		<section style={{}}>
			<header>
				<h3>Range Game</h3>
				<p
					style={{
						fontSize: "0.8rem",
						lineHeight: "1rem",
						textAlign: "center",
						marginTop: "0.5rem",
					}}
				>
					{get_instruction(game.stage)}
				</p>
			</header>
			<main style={{ marginTop: "2rem" }}>
				<div style={{ width: "calc(100% - 2 * 10px)", margin: "0 auto" }}>
					<Range
						values={range_values}
						step={1}
						min={0}
						max={100}
						allowOverlap={[2, 3].includes(game.stage)}
						onChange={(values) => {
							const [p0, p1, p2] = range_values;
							let [q0, q1, q2] = values;

							if ([0, 2].includes(game.stage)) {
								set_range_values([q0, p1, p2]);
								return;
							}
							if (game.stage === 3) {
								set_range_values([p0, p1, p2]);
								return;
							}

							// the difference between p1 and p2 must be at least 1;
							if (p1 !== q1) {
								// p1 has moved so,
								if (q1 > p2 - 1) q1 = p2 - 1;
							} else if (p2 !== q2) {
								// p2 has moved so,
								if (q2 < p1 + 1) q2 = p1 + 1;
							}

							set_range_values([q0, q1, q2]);
						}}
						renderTrack={({ props, children }) => {
							const [p0, p1, p2] = range_values;

							return (
								<>
									<div
										{...props}
										style={{
											...props.style,
											height: "15px",
											width: "100%",
											background: "var(--color-sky-blue)",
											borderRadius: "7.5px",
											position: "relative",
										}}
									>
										{/*Between P1 and P2*/}
										<div
											style={{
												position: "absolute",
												left: `${p1}%`,
												width: `${p2 - p1}%`,
												height: "100%",
												background: "var(--color-selective-yellow)",
											}}
										/>
										{children}
									</div>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											width: "calc(100% + 14px)",
											marginLeft: "-3px",
											marginTop: "0.3rem",
										}}
									>
										{Array(11)
											.fill(0)
											.map((_, index) => (
												<div
													key={index}
													style={{
														display: "flex",
														flexDirection: "column",
														alignItems: "center",
													}}
												>
													<div
														style={{
															width: "2px",
															height: "5px",
															background: "var(--color-sky-blue)",
														}}
													/>
													<span style={{ fontSize: "0.7rem" }}>
														{(index + 1) * 10 - 10}
													</span>
												</div>
											))}
									</div>
								</>
							);
						}}
						renderThumb={({ props, index }) => {
							const { key, ...rest_props } = props;

							return (
								<div
									key={key}
									{...rest_props}
									style={{
										...rest_props.style,
										height: "30px",
										width: "20px",
										borderRadius: "3px",
										background: index === 0 ? "var(--color-ut-orange)" : "var(--color-prussian-blue)",
										display:
											index === 0 && [0, 1].includes(game.stage)
												? "none"
												: "block",
										zIndex: index === 0 ? 10 : 5,
									}}
								/>
							);
						}}
					/>
				</div>
			</main>
			<footer style={{ marginTop: "1.5rem" }}>
				{[1, 2].includes(game.stage) && (
					<>
						<p style={{ fontSize: "0.8rem" }}>
							Range locked:{" "}
							<span className="u-medium">
								{range_values[1]} to {range_values[2]}
							</span>
						</p>
						<p style={{ fontSize: "0.85rem" }}>
							Reward on hit{" "}
							<span className="u-medium">
								+{get_coin(range_values[2], range_values[1])} coins
							</span>
						</p>
					</>
				)}

				{game.stage === 3 && (
					<>
						<p style={{ fontSize: "0.8rem" }}>
							Range locked:{" "}
							<span className="u-medium">
								{range_values[1]} to {range_values[2]}
							</span>
						</p>
						<p style={{ fontSize: "0.85rem" }}>
							Number drawn:{" "}
							<span className="u-medium">{game.random_number}</span>
						</p>
						<p
							style={{
								fontSize: "0.9rem",
								marginTop: "1rem",
								paddingTop: "0.5rem",
								borderTop: "2px dashed var(--color-blue-green)",
								textAlign: "center",
								color: "var(--color-ut-orange)",
							}}
						>
							You earned
							<span className="u-medium">
								+
								{range_values[1] <= game.random_number &&
								game.random_number <= range_values[2] 
									? get_coin(range_values[2], range_values[1])
									: 0}{" "}
								coins.
							</span>
						</p>
					</>
				)}

				{game.stage == 2 && (
					<p
						style={{
							fontSize: "0.9rem",
							marginTop: "1rem",
							textAlign: "center",
						}}
						className="u-animate-scale"
					>
						Drawing number{" "}
						<span className="u-medium">{p0_val_ref.current}</span>...
					</p>
				)}

				{[0, 1].includes(game.stage) && (
					<button
						className="u-primary"
						style={{ display: "block", margin: "0 auto", marginTop: "1rem" }}
						onClick={handle_game_btn_clicked}
					>
						{game.stage === 0 && (
							<>
								Gamble <LuSwords />
								<span style={{ display: "block", fontSize: "0.7rem" }}>
									(-5 coins)
								</span>
							</>
						)}

						{game.stage === 1 && <>Confirm and roll</>}
					</button>
				)}
			</footer>
		</section>
	);
}
