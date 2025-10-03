import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app.jsx";
import gameContext from "./contexts/game-context";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<gameContext.Provider
			value={{
				coins: 0,
			}}
		>
			<App />
		</gameContext.Provider>
	</StrictMode>
);
