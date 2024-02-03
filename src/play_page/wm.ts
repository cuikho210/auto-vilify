import { LogicalPosition, WebviewWindow } from "@tauri-apps/api/window";

const windowControlLabel = "window-play-control";
const windowBgLabel = "window-bg-control";
const chatboxConfigKey = "chatbox_position";

export async function initWindow(project_id: number): Promise<boolean> {
	if (await closeWindow()) {
		return false;
	}

	const windowControl = new WebviewWindow(windowControlLabel, {
		url: "/play/" + project_id,
		title: "Player Control Panel",
		alwaysOnTop: true,
		resizable: false,
		maximizable: false,
		minimizable: false,
		width: 360,
		height: 256,
	});

	const windowBg = new WebviewWindow(windowBgLabel, {
		url: "/play-bg",
		alwaysOnTop: true,
		decorations: false,
		resizable: false,
		minimizable: false,
		skipTaskbar: true,
		transparent: true,
		width: 256,
		height: 32,
	});

	windowControl.onCloseRequested(event => {
		event.preventDefault();
		closeWindow();
	});

	windowBg.onMoved(event => {
		const position = [
			event.payload.x,
			event.payload.y,
		];

		setChatboxPosition(position);
	});

	windowBg.once("tauri://created", async () => {
		const position = getChatboxPosition();
		if (position) {
			windowBg.setPosition(new LogicalPosition(position[0], position[1]));
		} else {
			setChatboxPosition([0, 0]);
			windowBg.setPosition(new LogicalPosition(0, 0));
		}
	});

	return true;
}

export async function setIgnoreWindowBgMouseEvent(isIgnore: boolean) {
	let windowBg = WebviewWindow.getByLabel(windowBgLabel);
	if (windowBg) {
		await windowBg.setIgnoreCursorEvents(isIgnore);
		return true;
	}
	return false;
}

export function setChatboxPosition(position: number[]) {
	localStorage.setItem(chatboxConfigKey, JSON.stringify(position));
}

export function getChatboxPosition(): number[] | null {
	const data = localStorage.getItem(chatboxConfigKey);
	if (data) return JSON.parse(data);
	return null;
}

export async function closeWindow(): Promise<boolean> {
	try {
		return await closeWindowBg() && await closeWindowControl();
	} catch(e) {
		console.error(e);
		return false;
	}
}

export async function closeWindowBg() {
	let windowBg = WebviewWindow.getByLabel(windowBgLabel);
	if (windowBg) {
		await windowBg.close();
		return true;
	}
	return false;
}

export async function closeWindowControl() {
	let windowControl = WebviewWindow.getByLabel(windowControlLabel);
	if (windowControl) {
		await windowControl.close();
		return true;
	}
	return false;
}
