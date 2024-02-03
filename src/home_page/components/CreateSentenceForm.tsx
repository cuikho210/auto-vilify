import {useState} from "react";
import { Project, db } from "../../db";
import { Input, Space, Button } from "antd";

interface CreateSentenceFormProps {
	project: Project,
}

const CreateSentenceForm = (props: CreateSentenceFormProps) => {
	const [value, setValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function createSentence() {
		if (!props.project.id || isLoading || !value.trim().length) return;
		setIsLoading(true);

		try {
			await db.sentences.add({
				project_id: props.project.id,
				value,
			});

			setValue("");
		} catch(e) {
			console.error(e);
		}

		setIsLoading(false);
	}

	return <Space.Compact style={{ width: '100%', padding: '1rem', }}>
		<Input
			placeholder="Dmm vai lon dao hoa dao"
			value={value}
			onChange={(e) => setValue(e.currentTarget.value)}
			onPressEnter={createSentence}
			spellCheck={false}
			showCount
			maxLength={100}
		/>
		<Button
			onClick={createSentence}
			loading={isLoading}
		>Add</Button>
	</Space.Compact>
}

export default CreateSentenceForm;
