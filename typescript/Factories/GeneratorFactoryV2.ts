import { ConfigRetriever } from "../Utils/ConfigRetriever";
import { GeneratorFactoryV1 } from "./GeneratorFactoryV1";
import path from "path";
import { IGeneratorV2 } from "../Interfaces/IGeneratorV2";

export class GeneratorFactoryV2 extends GeneratorFactoryV1 {
    public static getInstance(className: string): IGeneratorV2 {
        // Get the class path of the given className
        const classPath = ConfigRetriever.retrieve("generators", className);

        // Create new instance of the className
        return new (require(path.resolve(classPath)).default)() as IGeneratorV2;
    }
}