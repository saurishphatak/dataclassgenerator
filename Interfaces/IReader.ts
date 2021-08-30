import { ActionResult } from "../Utils/ActionResult";

export interface IReader {
	_filePath: string;

	set filePath(classDescriptionFilePath: string);

	read(): Promise<ActionResult>;
}