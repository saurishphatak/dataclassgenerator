import { environment } from "../environment";
import { ActionFailure } from "./ActionResult";
import { Logger } from "./Logger";

// environment.production ? Logger.toggleDebug() : () => { };
@Logger.log
export class ConfigRetriever {
    protected static className = "ConfigRetriever";

    protected static _rootConfig = new Map<string, any>(Object.entries(require("../../RootConfig.json")));

    @Logger.call()
    public static retrieve(componentKey: string, className: string): string {
        let functionName = "retrieve()";

        // debug(`${this.className}::${functionName}`, { componentKey, className });

        // Get the map for the given component key
        if (this._rootConfig.has(componentKey)) {
            // Get the language map
            const languageMap = new Map<string, string>(Object.entries(this._rootConfig.get(componentKey)));

            Logger.debug(`${this.className}::${functionName}`, { languageMap });

            // Get the classPath for the given className
            if (languageMap?.has(className)) {
                const classPath = languageMap.get(className) as string;

                Logger.debug(`${this.className}::${functionName}`, { classPath });

                return classPath;
            }

            throw new ActionFailure(undefined, `${ConfigRetriever.className}::${functionName} ==> No implementation of the given className : ${className} exists!`);
        }

        throw new ActionFailure(undefined, `${ConfigRetriever.className}::${functionName} ==> Invalid component key : ${className}`);
    }
}
