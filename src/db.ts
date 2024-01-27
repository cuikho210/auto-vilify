import Dexie, { Table } from "dexie";

export interface Project {
	id?: number,
	name: string,
}

export interface Sentence {
	id?: number,
	project_id: number,
	value: string,
}

export class DB extends Dexie {
	projects!: Table<Project>;
	sentences!: Table<Sentence>;

	constructor() {
		super("project_db");

		this.version(1).stores({
			projects: "++id",
			sentences: "++id, project_id",
		});
	}
}

export const db = new DB();
