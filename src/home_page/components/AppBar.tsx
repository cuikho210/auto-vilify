import { useState } from "react";
import { Flex, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateProjectModal from "./CreateProjectModal";

interface ActionsProps {
	onNewProjectClick: () => void
}

const Title = () => (
	<i>Auto Vilify</i>
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

	return <>
		<Flex justify="space-between" align="center" gap="middle">
			<Title />
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
