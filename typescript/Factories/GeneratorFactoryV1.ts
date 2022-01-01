import { IGeneratorV1 } from "../Interfaces/IGeneratorV1";
import { ConfigRetriever } from "../Utils/ConfigRetriever";
import path from "path";
import { Logger } from "../Utils/Logger";

@Logger.log
export class GeneratorFactoryV1 {

    @Logger.call()
    public static getInstance(className: string): IGeneratorV1 {
        // Get the class path of the given className
        const classPath = ConfigRetriever.retrieve("generators", className);

        // Create a new instance of the className
        return new (require(path.resolve(classPath)).default)() as IGeneratorV1;
    }
}
