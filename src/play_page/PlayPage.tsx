import { db } from "../db";
import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { play, stop } from "./player";
import { Button, Divider, Flex, InputNumber, Space, Switch } from "antd";
import { PlayCircleOutlined, BorderOutlined } from "@ant-design/icons";
import type { Project } from "../db";

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

	return <>
		<Flex align="center" justify="space-between" data-tauri-drag-region>
			<p style={{ padding: '0 .5rem' }}>{props.project.name}</p>
			{PlayButton}
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
}

const OtherConfig = (props: OtherConfigProps) => {
	return <div style={{ padding: "0 .5rem" }}>
		<Divider>Other</Divider>
		<Space>
			<p>Random: </p>
			<Switch value={props.isRandom} onChange={props.setIsRandom} />

			<p style={{ marginLeft: '3rem' }}>Loop: </p>
			<Switch value={props.isLoop} onChange={props.setIsLoop} />
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
	const [staticInterval, setStaticInterval] = useState(60);
	const [additionalInterval, setAdditionalInterval] = useState(30);
	const [isRandom, setIsRandom] = useState(true);
	const [isLoop, setIsLoop] = useState(false);

	function togglePlay() {
		if (isPlaying) {
			setIsPlaying(false);
			stop();
		} else {
			if (!sentences) return console.error("Cannot get sentences");

			setIsPlaying(true);
			play({
				isLoop, isRandom,
				staticInterval, additionalInterval,
				sentences,
				stopCallback: () => setIsPlaying(false),
			});
		}
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
		/>
	</>;
}

export default PlayPage;
