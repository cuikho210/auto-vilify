import { useState } from "react";
import { db } from "./db";
import { Layout } from "antd";
import AppBar from "./components/AppBar";
import ProjectList from "./components/ProjectList";
import ProjectView from "./components/ProjectView";
import type { Project } from "./db";
import type { CSSProperties } from "react";
import {useLiveQuery} from "dexie-react-hooks";

const { Header, Content } = Layout;

export const headerStyle: CSSProperties = {
	backgroundColor: '#fff',
	borderBottom: '1px solid #00000009',
	padding: '0 1rem',
};

const App = () => {
	const [currentProject, setCurrentProject] = useState<Project | null>(null);
	const projects = useLiveQuery(() => db.projects.toArray());

	const HomeView = <>
		<Header style={headerStyle}>
			<AppBar />
		</Header>
		<Content style={{ padding: '1rem' }}>
			{projects && <ProjectList
				projects={projects}
				setCurrentProject={setCurrentProject}
			/>}
		</Content>
	</>;

	return <>
		{
			currentProject == null ?
			HomeView :
			<ProjectView
				project={currentProject}
				setCurrentProject={setCurrentProject}
			/>
		}
	</>
};

export default App;
