import { db } from "../db";
import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { WebviewWindow, LogicalPosition } from "@tauri-apps/api/window";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { play, stop, ShortMode } from "./player";
import { windowBgLabel, setChatboxPosition, initWindow } from "./wm";
import { Button, Divider, Flex, InputNumber, Space, Switch } from "antd";
import { PlayCircleOutlined, BorderOutlined } from "@ant-design/icons";
import type { Project } from "../db";
import type { Config } from "./player";

interface HeaderProps {
	project: Project,
	isPlaying: boolean,
	togglePlay: () => any,
}

const shortcut = "Shift+Space";

const Header = (props: HeaderProps) => {
	let PlayButton = <Button
		type="primary"
		icon={<PlayCircleOutlined />}
		onClick={props.togglePlay}
	>Play</Button>;

	if (props.isPlaying) {
		PlayButton = <Button
			type="primary"
			icon={<BorderOutlined />}
			onClick={props.togglePlay}
		>Stop</Button>;
	}

	let ResetButton = <Button
		onClick={resetChatboxPosition}
	>Reset</Button>

	function resetChatboxPosition() {
		setChatboxPosition([0, 0]);

		let windowBg = WebviewWindow.getByLabel(windowBgLabel);
		if (windowBg) {
			windowBg.setPosition(new LogicalPosition(0, 0));
		} else {
			initWindow(props.project.id || 0);
		}
	}

	return <>
		<Flex align="center" justify="space-between" data-tauri-drag-region>
			<p style={{ padding: '0 .5rem' }}>{props.project.name}</p>
			<div>
				{ResetButton}
				{PlayButton}
			</div>
		</Flex>
		<p style={{ padding: '0 .5rem', fontStyle: 'italic' }}>
			Use {shortcut} to toggle play
		</p>
	</>
}

interface DurationConfigProps {
	staticInterval: number,
	setStaticInterval: (value: number) => any,
	additionalInterval: number,
	setAdditionalInterval: (value: number) => any,
}

const DurationConfig = (props: DurationConfigProps) => {
	return <div style={{ padding: '0 .5rem' }}>
		<Divider>Interval Duration</Divider>
		<Space>
			<p>Static:</p>
			<InputNumber
				value={props.staticInterval}
				onChange={val => props.setStaticInterval(Number(val))}
			/>
			<i>Seconds</i>
		</Space>
		<Space>
			<p>Additional random:</p>
			<InputNumber
				value={props.additionalInterval}
				onChange={val => props.setAdditionalInterval(Number(val))}
			/>
			<i>Seconds</i>
		</Space>
	</div>
}

interface OtherConfigProps {
	isRandom: boolean,
	setIsRandom: (value: boolean) => any,
	isLoop: boolean,
	setIsLoop: (value: boolean) => any,
	isDescending:boolean,
	setIsDescending: (value: boolean) => any,
}

const OtherConfig = (props: OtherConfigProps) => {
	return <div style={{ padding: "0 .5rem" }}>
		<Divider>Other</Divider>
		<Space>
			<p>Random: </p>
			<Switch value={props.isRandom} onChange={props.setIsRandom} />

			<p>Loop: </p>
			<Switch value={props.isLoop} onChange={props.setIsLoop} />

			<p>Descending: </p>
			<Switch value={props.isDescending} onChange={props.setIsDescending} />
		</Space>
	</div>
}

const PlayPage = () => {
	const params = useParams();
	const projectId = Number(params.projectId);
	const project = useLiveQuery(() => db.projects.get(projectId));

	const sentences = useLiveQuery(() => db.sentences
		.where('project_id')
		.equals(projectId)
		.reverse()
		.toArray()
	);

	const [isPlaying, setIsPlaying] = useState(false);
	const [staticInterval, setStaticInterval] = useState(10);
	const [additionalInterval, setAdditionalInterval] = useState(0);
	const [isRandom, setIsRandom] = useState(true);
	const [isLoop, setIsLoop] = useState(false);
	const [isDescending, setIsDescending] = useState(true);

	function togglePlay() {
		if (isPlaying) {
			setIsPlaying(false);
			stop();
		} else {
			setIsPlaying(true);
			play(getConfig());
		}
	}

	function getConfig(): Config {
		return {
			isLoop, isRandom,
			staticInterval, additionalInterval,
			short: isDescending ? ShortMode.Desc : ShortMode.Asc,
			sentences: sentences || [],
			stopCallback: () => setIsPlaying(false),
		};
	}

	(async function registerTogglePlayShortcut() {
		await unregister(shortcut);

		await register(shortcut, () => {
			togglePlay();
		});
	})();

	if (!project) return <p>Cannot get project</p>;
	return <>
		<Header
			project={project}
			isPlaying={isPlaying}
			togglePlay={togglePlay}
		/>
		<DurationConfig
			staticInterval={staticInterval}
			setStaticInterval={setStaticInterval}
			additionalInterval={additionalInterval}
			setAdditionalInterval={setAdditionalInterval}
		/>
		<OtherConfig
			isRandom={isRandom}
			setIsRandom={setIsRandom}
			isLoop={isLoop}
			setIsLoop={setIsLoop}
			isDescending={isDescending}
			setIsDescending={setIsDescending}
		/>
	</>;
}

export default PlayPage;
