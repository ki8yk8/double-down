import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app.jsx";
import { GameContextProvider } from "./contexts/game-context";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<GameContextProvider>
			<App />
		</GameContextProvider>
	</StrictMode>
);
