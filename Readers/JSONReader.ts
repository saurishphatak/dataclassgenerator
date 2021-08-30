import path from "path";
import { IClassDescription } from "../Interfaces/IClassDescription";
import { IReader } from "../Interfaces/IReader";
import { ActionResult, ActionSuccess } from "../Utils/ActionResult";

export default class JSONReader implements IReader {
	protected _filePath!: string;

	public set filePath(classDescriptionFilePath: string) {
		this._filePath = path.resolve(classDescriptionFilePath);
	}

	public read(): Promise<ActionResult> {
		return new Promise<ActionResult>((resolve, reject) => {
			// Load the JSON
			const classDescription: IClassDescription[] = require(this._filePath + "/s");

			// Resolve now
			resolve(new ActionSuccess(classDescription));
		});
	}
}

const reader = new JSONReader();
reader.filePath = "./ClassDescription.json";
reader.read().then(result => console.log(result.result));