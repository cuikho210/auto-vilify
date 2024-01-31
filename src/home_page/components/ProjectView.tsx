import {CSSProperties } from "react";
import {useLiveQuery} from "dexie-react-hooks";
import { db } from "../../db";
import { Layout, Button, Flex, Space } from "antd";
import {
	ArrowLeftOutlined,
	PlayCircleOutlined,
} from "@ant-design/icons";
import CreateSentenceForm from "./CreateSentenceForm";
import { headerStyle } from "../HomePage";
import { initWindow } from "../../play_page/wm";
import type { Project, Sentence } from "../../db";

const { Header, Content } = Layout;

interface SentenceCardProps {
	sentence: Sentence,
}

interface ProjectViewProps {
	project: Project;
	setCurrentProject: (project: Project | null) => void;
}

const AppBar = (props: ProjectViewProps) => {
	return <>
		<Header style={headerStyle}>
			<Flex justify="space-between" align="center" gap="middle">
				<div>
					<Button
						icon={<ArrowLeftOutlined />}
						type="text"
						size="large"
						title="Back"
						onClick={() => props.setCurrentProject(null)}
					></Button>
					{props.project.name}
				</div>
				<Space>
					<Button
						type="primary"
						icon={<PlayCircleOutlined />}
						onClick={() => initWindow(props.project.id!)}
					>Play</Button>
				</Space>
			</Flex>
		</Header>

		<CreateSentenceForm
			project={props.project}
		/>
	</>
}

const styleSentenceCard: CSSProperties = {
	position: 'relative',
	display: 'block',
	padding: '.7rem',
	border: '1px solid #00000009',
	borderRadius: '8px',
};

const SentenceCard = (props: SentenceCardProps) => {
	async function deleteSentence() {
		if (props.sentence.id)
			await db.sentences.delete(props.sentence.id);
	}

	return <div style={styleSentenceCard}>
		<p style={{ marginBottom: '.5rem' }}>{props.sentence.value}</p>

		<Flex justify="flex-end">
			<Button
				type="text"
				style={{ color: '#ff3216' }}
				onClick={deleteSentence}
			>Delete</Button>
		</Flex>
	</div>
}

const ProjectView = (props: ProjectViewProps) => {
	const sentences = useLiveQuery(() => db.sentences
		.where('project_id')
		.equals(props.project.id || 0)
		.reverse()
		.toArray()
	);

	const list = sentences?.map(sentence =>
		<SentenceCard
			key={sentence.id}
			sentence={sentence}
		/>
	);

	return <>
		<AppBar
			project={props.project}
			setCurrentProject={props.setCurrentProject}
		/>
		<Content style={{ padding: "1rem" }}>
			<Space direction="vertical" style={{ width: '100%' }}>
				{list}
			</Space>
		</Content>
	</>
}

export default ProjectView;
