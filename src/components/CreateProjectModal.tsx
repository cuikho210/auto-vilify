import { Modal, Input } from "antd";
import { useState } from "react";
import { db } from "../db";

interface Props {
	isOpen: boolean
	onClose: () => void
}

const CreateProjectModal = (props: Props) => {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("");

	async function create() {
		setLoading(true);

		try {
			if (name.trim().length === 0) throw new Error("Name cannot be empty");

			await db.projects.add({ name })

			setName("");
			setStatus("");
			setLoading(false);

			close();
		} catch(e) {
			setStatus((e as Error).message);
			setLoading(false);
		}
	}

	function close() {
		if (!loading) props.onClose();
	}

	return <>
		<Modal
			title="New Project"
			confirmLoading={loading}
			open={props.isOpen}
			onCancel={close}
			onOk={create}
		>
			<Input
				style={{ marginTop: '.5rem' }}
				value={name}
				onChange={e => setName(e.currentTarget.value)}
				placeholder="Name"
			/>

			<p style={{ color: 'red' }}>{status}</p>
		</Modal>
	</>;
}

export default CreateProjectModal;
