import { environment } from "../environment";
import { IGeneratorV3 } from "../Interfaces/IGeneratorV3";
import { ConfigRetrieverV2 } from "../Utils/ConfigRetrieverV2";
import { Logger } from "../Utils/Logger";
import { GeneratorFactoryV3 } from "./GeneratorFactoryV3";

@Logger.log
export class GeneratorFactoryV4 extends GeneratorFactoryV3 {
    @Logger.call()
    public static getInstance(className: string): IGeneratorV3 {
        let functionName = "getInstance()";

        // Get the class ref
        const classRef = ConfigRetrieverV2.retrieve("generators", className);

        // Logger.debug(`${GeneratorFactoryV4._className}::${functionName}`, { classRef });
        console.log(classRef.result);

        // Create a new instance and return
        return new (classRef.result)() as IGeneratorV3;
    }
}