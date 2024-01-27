import Dexie, { Table } from "dexie";

export interface Project {
	id?: number;
	name: string;
}

export class DB extends Dexie {
	projects!: Table<Project>;

	constructor() {
		super("project_db");

		this.version(1).stores({
			projects: "++id, name",
		});
	}
}

export const db = new DB();
