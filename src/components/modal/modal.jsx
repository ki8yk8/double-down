import ReactDOM from "react-dom";
import { MdClose } from "react-icons/md";

export default function Modal({ isOpen, onClose, children }) {
	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<section
			className="u-flex u-align-center u-justify-center"
			style={{
				height: "100vh",
				width: "100vw",
				position: "absolute",
				top: 0,
				left: 0,
				backdropFilter: "blur(1px)",
			}}
		>
			<main
				className="u-relative"
				style={{
					backgroundColor: "var(--color-white)",
					border: "2px solid var(--color-blue-green)",
					width: "min(90vw, 40rem)",
					maxHeight: "90vh",
					overflowY: "auto",
					borderRadius: "8px",
					padding: "1rem",
					outline: "1px solid var(--color-white)",
				}}
			>
				<header style={{ position: "absolute", top: "10px", right: "10px" }}>
					<button onClick={onClose}>
						<MdClose size="1.3rem" />
					</button>
				</header>
				{children}
			</main>
		</section>,

		document.getElementById("modal-root")
	);
}
