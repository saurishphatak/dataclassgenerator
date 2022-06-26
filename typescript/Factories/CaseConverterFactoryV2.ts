import { ICaseConvertor } from "../Interfaces/ICaseConvertor";
import { ConfigRetrieverV2 } from "../Utils/ConfigRetrieverV2";
import { Logger } from "../Utils/Logger";

@Logger.log
export class CaseConverterFactoryV2 {
    @Logger.call()
    public static getInstance(className = "defaultcaseconverter"): ICaseConvertor {
        // Get the class name
        const result = ConfigRetrieverV2.retrieve("caseconverters", className);

        // Return a new instance of the class
        return new result.result() as ICaseConvertor;
    }
}

// let instance = CaseConverterFactoryV2.getInstance();
// console.log(instance);