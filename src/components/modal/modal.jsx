import ReactDOM from "react-dom";
import { MdClose } from "react-icons/md";

export default function Modal({ isOpen, onClose, children }) {
	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<section
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				width: "100vw",
				position: "absolute",
				top: 0,
				left: 0,
				backdropFilter: "blur(1px)",
			}}
		>
			<main
				style={{
					backgroundColor: "var(--color-white)",
					border: "2px solid var(--color-blue-green)",
					minWidth: "50vw",
					minHeight: "60vh",
					borderRadius: "8px",
					padding: "1.5rem"
				}}
			>
				<header
					style={{
						display: "flex",
						justifyContent: "flex-end",
					}}
				>
					<button onClick={onClose}>
						<MdClose size="1.3rem"/>
					</button>
				</header>
				{children}
			</main>
		</section>,

		document.getElementById("modal-root")
	);
}
