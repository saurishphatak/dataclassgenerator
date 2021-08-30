import { ConfigRetriever } from "../Utils/ConfigRetriever";
import path from "path";
import { IReader } from "../Interfaces/IReader";

export class ReaderFactory {
	public static getInstance(className: string): IReader {
		// Get the classPath for the given className
		const classPath = ConfigRetriever.getClassPath("readers", className);

		// Instantiate an object and return
		return new (require(path.resolve(classPath)).default)() as IReader;
	}
}