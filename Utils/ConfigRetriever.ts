import { ActionFailure } from "./ActionResult";

export class ConfigRetriever {
	public static _rootConfig = new Map<string, any>(Object.entries(require("../RootConfig.json")));

	public static getClassPath(componentKey: string, className: string): string {
		// Get the map for the given component key
		if (this._rootConfig.has(componentKey)) {
			// Get the language map
			const languageMap = new Map<string, string>(Object.entries(this._rootConfig.get(componentKey)));

			// Get the classPath for the given className
			if (languageMap?.has(className)) {
				const classPath = languageMap.get(className) as string;

				return classPath;
			}

			throw new ActionFailure(undefined, `No implementation of the given className : ${className} exists!`);
		}

		throw new ActionFailure(undefined, `Invalid component key : ${className}`);
	}
}
