import { getChatboxPosition, setIgnoreWindowBgMouseEvent } from "./wm";
import { invoke } from "@tauri-apps/api";
import type { Sentence } from "../db";

export enum ShortMode {
	Asc, Desc,
}

export interface Config {
	isLoop: boolean,
	isRandom: boolean,
	staticInterval: number,
	additionalInterval: number,
	short: ShortMode,
	sentences: Sentence[],
	stopCallback: () => any,
}

let currentConfig: Config | null = null;
let isPlaying = false;
let currentIndex = 0;

export function play(config: Config) {
	isPlaying = true;
	currentIndex = 0;
	currentConfig = config;
	currentConfig.sentences = [...config.sentences];
	setIgnoreWindowBgMouseEvent(true);

	if (config.short === ShortMode.Asc) {
		currentConfig.sentences = currentConfig.sentences.reverse();
	}

	if (config.isRandom) {
		currentConfig.sentences = shuffle(currentConfig.sentences);
	}

	loop();
}

export function stop() {
	isPlaying = false;
	setIgnoreWindowBgMouseEvent(false);
	currentConfig?.stopCallback();
	currentConfig = null;
}

function loop() {
	if (!currentConfig || !isPlaying) return stop();

	if (currentIndex >= currentConfig.sentences.length) {
		if (currentConfig.isLoop) currentIndex = 0;
		else return stop();
	}

	const intervalDuration = (
		currentConfig.staticInterval +
		Math.floor(Math.random() * currentConfig.additionalInterval)
	) * 1000;

	const sentenceValue = currentConfig.sentences[currentIndex].value;

	const chatboxPosition = getChatboxPosition();
	if (!chatboxPosition) return console.error("Cannot get chatbox position");

	invoke("paste", {
		x: chatboxPosition[0] + 128,
		y: chatboxPosition[1] + 16,
		text: sentenceValue,
	});

	currentIndex += 1;
	setTimeout(() => loop(), intervalDuration);
}

function shuffle(arr: any[]) {
	let currentIndex = arr.length, randomIndex;

	while (currentIndex > 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
	}

	return arr;
}

export {};
