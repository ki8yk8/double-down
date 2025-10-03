import { useContext } from "react";
import "./app.css";
import gameContext from "./contexts/game-context";

function App() {
	const game_context = useContext(gameContext);

	return <p>{game_context?.coins}</p>;
}

export default App;
