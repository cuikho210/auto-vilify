import { useRef, useEffect } from "react";

const PlayBgPage = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return console.error("Canvas is null");

		const ctx = canvas.getContext("2d");
		if (!ctx) return console.error("Cannot get context");

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.backgroundColor = "#ff907f88";
	});

	return <canvas
		ref={canvasRef}
		data-tauri-drag-region
	></canvas>;
}

export default PlayBgPage;
