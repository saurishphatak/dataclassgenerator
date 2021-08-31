import { ActionResult } from "../Utils/ActionResult";

export interface IReader {
	set filePath(classDescriptionFilePath: string);

	read(): Promise<ActionResult>;
}