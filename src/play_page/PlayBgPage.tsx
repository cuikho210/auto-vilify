import { useRef, useEffect } from "react";

const PlayBgPage = () => {
	return <div data-tauri-drag-region style={{
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		position: 'fixed',
		backgroundColor: '#ff907faa',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}}>
		<div style={{
			width: '8px',
			height: '8px',
			backgroundColor: '#ff907f',
			border: '1px solid #000',
		}}></div>
	</div>;
}

export default PlayBgPage;
