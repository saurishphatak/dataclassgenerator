import { RootConfig } from "../RootConfig";
import { ActionFailure, ActionResult, ActionSuccess } from "./ActionResult";
import { Logger } from "./Logger";

export class ConfigRetrieverV2 {
    protected static _className = "ConfigRetrieverV2";

    protected static _rootConfig = new Map<string, any>(Object.entries(RootConfig));

    public static retrieve(componentKey: string, className: string): ActionResult {
        let functionName = "retrieve()";

        if (this._rootConfig.has(componentKey)) {
            // Get the config map for the given component key
            const componentMap = new Map<string, any>(Object.entries(this._rootConfig.get(componentKey)));

            Logger.debug(`${this._className}::${functionName}`, { componentMap });

            // Get the class for the given className
            if (componentMap?.has(className)) {
                const classRef = componentMap.get(className);

                Logger.debug(`${this._className}::${functionName}`, { className: classRef });

                return new ActionSuccess(classRef, `${classRef} found`, 1);
            }

            throw new ActionFailure(undefined, `${ConfigRetrieverV2._className}::${functionName} ==> No implementation of the given className : ${className} exists!`)
        }

        throw new ActionFailure(undefined, `${ConfigRetrieverV2._className}::${functionName} ==> Invalid component key : ${className}`);
    }
}