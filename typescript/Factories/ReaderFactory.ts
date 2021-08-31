import { ConfigRetriever } from "../Utils/ConfigRetriever";
import path from "path";
import { IReader } from "../Interfaces/IReader";
import { Logger } from "../Utils/Logger";

@Logger.log
export class ReaderFactory {

	@Logger.call()
	public static getInstance(className: string): IReader {
		// Get the classPath for the given className
		const classPath = ConfigRetriever.retrieve("readers", className);

		// Instantiate an object and return
		// return new (require(path.resolve(classPath)).default)() as IReader;
		return new (require(path.resolve(classPath)).default)() as IReader;
	}
}