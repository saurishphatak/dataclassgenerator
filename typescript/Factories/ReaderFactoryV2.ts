import { IReader } from "../Interfaces/IReader";
import { ConfigRetrieverV2 } from "../Utils/ConfigRetrieverV2";
import { Logger } from "../Utils/Logger";

@Logger.log
export class ReaderFactoryV2 {
    protected _className = "ReaderFactoryV2";
    @Logger.call()
    public static getInstance(className: string): IReader {
        // Get the class reference
        const classRef = ConfigRetrieverV2.retrieve("readers", className);

        return new (classRef.result)() as IReader;
    }
}
