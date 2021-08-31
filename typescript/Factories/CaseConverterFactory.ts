import path from "path";
import { ICaseConvertor } from "../Interfaces/ICaseConvertor";
import { ConfigRetriever } from "../Utils/ConfigRetriever";
import { Logger } from "../Utils/Logger";

@Logger.log
export class CaseConverterFactory {

	@Logger.call()
	public static getInstance(className = "defaultcaseconverter"): ICaseConvertor {
		// Get the classPath from the ConfigRetriever
		const classPath = ConfigRetriever.retrieve("caseconverters", className);

		// Create a new instance and return 
		return new (require(path.resolve(classPath)).default)();
	}
}