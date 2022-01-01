import { IGenerator } from "../Interfaces/IGenerator";
import { IGeneratorV1 } from "../Interfaces/IGeneratorV1";
import { ConfigRetriever } from "../Utils/ConfigRetriever";
import { GeneratorFactoryV1 } from "./GeneratorFactoryV1";
import path from "path";

export class GeneratorFactory extends GeneratorFactoryV1 {
    public static getInstance(className: string): IGenerator {
        // Get the class path of the given className
        const classPath = ConfigRetriever.retrieve("generators", className);

        // Create new instance of the className
        return new (require(path.resolve(classPath)).default)() as IGenerator;
    }
}