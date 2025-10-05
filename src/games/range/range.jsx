import { useState } from "react";
import { Range } from "react-range";

export default function RangeGame() {
	// [winner, min guess, max guess]
	const [range_values, set_range_values] = useState([0, 10, 90]);
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
					allowOverlap
					onChange={(values) => {
						let [p0, p1, p2] = values;

						if (p1 > p2) p1 = p2;
						if (p2 < p1) p2 = p1;
						set_range_values([p0, p1, p2]);
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
