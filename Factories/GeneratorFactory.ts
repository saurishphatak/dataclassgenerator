import { IGenerator } from "../Interfaces/IGenerator";
import { ConfigRetriever } from "../Utils/ConfigRetriever";
import path from "path";

export class GeneratorFactory {
	public static getInstance(className: string): IGenerator {
		// Get the class path of the given className
		const classPath = ConfigRetriever.getClassPath("generators", className);

		// Create a new instance of the className
		return new (require(path.resolve(classPath)).default)() as IGenerator;
	}
}
