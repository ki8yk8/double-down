import { useState } from "react";
import { Range } from "react-range";

function get_instruction(stage) {
	switch (stage) {
		case 0:
			return "Pick a number range. Smaller range = bigger multiplier. Miss it and you lose it all!";
		case 1:
			return "Lock in your range wisely. Skinny range = fat rewards.";
		case 2:
			return "Rolling the number...";
		case 3:
			return "And the number is...";
	}
}

function get_coin(max, min) {
	const diff = max - min;
	const reward = Math.round(1 + 14 * Math.pow((100 - diff) / 99, 2));

	return reward;
}

export default function RangeGame() {
	// [winner, min guess, max guess]
	const [range_values, set_range_values] = useState([0, 10, 90]);
	// stage: 0 = initial, 1 = user is selecting, 2 = winner is happening, 3 = winner announced
	const [game, set_game] = useState({
		stage: 1,
		instruction: get_instruction(0),
	});

	return (
		<section>
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
					{game.instruction}
				</p>
			</header>
			<main style={{ marginTop: "2rem" }}>
				<div style={{ width: "calc(100% - 2 * 10px)", margin: "0 auto" }}>
					<Range
						values={range_values}
						step={1}
						min={0}
						max={100}
						allowOverlap={game.stage === 2}
						onChange={(values) => {
							const [p0, p1, p2] = range_values;
							let [q0, q1, q2] = values;

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
											height: "6px",
											width: "100%",
											background: "red",
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
												background: "green",
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
															background: "black",
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
										height: "16px",
										width: "16px",
										borderRadius: "50%",
										background: index === 0 ? "black" : "grey",
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
			{game.stage === 1 && (
				<footer style={{ marginTop: "1.5rem" }}>
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
				</footer>
			)}
		</section>
	);
}
