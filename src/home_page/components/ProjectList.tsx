import { db } from "../../db";
import { Button, Modal, Space } from "antd";
import {
	EditOutlined,
	PlayCircleOutlined,
	DeleteOutlined,
} from "@ant-design/icons";
import type { Project } from "../../db";
import type { CSSProperties } from "react";

interface ProjectCardProps {
	project: Project;
	setCurrentProject: (project: Project) => void;
}

interface ProjectListProps {
	projects: Project[];
	setCurrentProject: (project: Project) => void;
}

const styleCard: CSSProperties = {
	position: 'relative',
	padding: '.4rem .7rem',
	border: '1px solid #00000009',
	borderRadius: '8px',
	boxShadow: '2px 2px 4px #00000004',
};

const styleCardTitle: CSSProperties = {
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	margin: 0,
	marginTop: '.2rem',
	marginBottom: '.4rem',
};

const styleList: CSSProperties = {
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
	gap: '.8rem',
};

const ProjectCard = (props: ProjectCardProps) => {
	function confirmDelete() {
		return Modal.confirm({
			title: 'Confirm',
			content: 'Are you sure? x32?',
			onOk: async () => {
				if (props.project.id) {
					await db.projects.delete(props.project.id);
					await db.sentences
						.where('project_id')
						.equals(props.project.id)
						.delete();
				}
			},
		});
	}

	return <div style={styleCard}>
		<p style={styleCardTitle}>
			{props.project.name}
		</p>
		<Space>
			<Button
				icon={<EditOutlined />}
				onClick={() => props.setCurrentProject(props.project)}
			>Edit</Button>

			<Button icon={<PlayCircleOutlined />}>Play</Button>

			<Button
				icon={<DeleteOutlined />}
				onClick={confirmDelete}
			>Delete</Button>
		</Space>
	</div>
}

const ProjectList = (props: ProjectListProps) => {
	const list = props.projects.map(project =>
		<ProjectCard
			key={project.id}
			project={project}
			setCurrentProject={props.setCurrentProject}
		/>
	);

	return <div style={styleList}>
		{list}
	</div>
}

export default ProjectList;
