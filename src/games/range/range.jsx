import { useState } from "react";
import { Range } from "react-range";

export default function RangeGame() {
	// [winner, min guess, max guess]
	const [range_values, set_range_values] = useState([0, 10, 90]);
	// stage: 0 = initial, 1 = user is selecting, 2 = winner is happening, 3 = winner announced
	const [game, set_game] = useState({
		stage: 0,
	});

	return (
		<section>
			<header>
				<h3>Range Game</h3>
			</header>
			<main>
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
			</main>
			<p>{range_values}</p>
		</section>
	);
}
