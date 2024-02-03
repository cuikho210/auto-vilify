import { useState } from "react";
import { getVersion } from "@tauri-apps/api/app";
import { Flex, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateProjectModal from "./CreateProjectModal";

interface ActionsProps {
	onNewProjectClick: () => void
}

const Title = (props: { version: string }) => (
	<i>Auto Vilify {props.version}</i>
);

const Actions = (props: ActionsProps) => (<>
	<Button
		type="dashed"
		icon={<PlusOutlined />}
		onClick={props.onNewProjectClick}
	> New Project </Button>
</>);

const AppBar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [version, setVersion] = useState("");

	getVersion().then(version => setVersion(version));

	return <>
		<Flex justify="space-between" align="center" gap="middle">
			<Title version={version} />
			<Actions
				onNewProjectClick={() => setIsOpen(true)}
			/>
		</Flex>

		<CreateProjectModal
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
		/>
	</>;
}

export default AppBar;
