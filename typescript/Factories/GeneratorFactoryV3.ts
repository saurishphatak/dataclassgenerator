import path from "path";
import { environment } from "../environment";
import { IGeneratorV2 } from "../Interfaces/IGeneratorV2";
import { IGeneratorV3 } from "../Interfaces/IGeneratorV3";
import { ConfigRetriever } from "../Utils/ConfigRetriever";
import { Logger } from "../Utils/Logger";
import { GeneratorFactoryV2 } from "./GeneratorFactoryV2";

let debug = !environment.production ? console.log : () => { };

@Logger.log
export class GeneratorFactoryV3 extends GeneratorFactoryV2 {
    protected static className = "GeneratorFactoryV3";

    @Logger.call()
    public static getInstance(className: string): IGeneratorV3 {
        let functionName = "getInstance()";

        // debug(`${GeneratorFactoryV3.className}::${functionName}`, { className });

        // Get the class path 
        const classPath = ConfigRetriever.retrieve("generators", className);

        Logger.debug(`${GeneratorFactoryV3.className}::${functionName}`, { classPath });

        // Create a new instance of the className and return
        return new (require(path.resolve(classPath)).default)() as IGeneratorV3;
    }
}   