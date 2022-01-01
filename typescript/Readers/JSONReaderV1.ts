import path from "path";
import { IClassDescriptionV1 } from "../Interfaces/IClassDescriptionV1";
import { IReader } from "../Interfaces/IReader";
import { ActionFailure, ActionResult, ActionSuccess } from "../Utils/ActionResult";
import { Logger } from "../Utils/Logger";

@Logger.log
export default class JSONReaderV1 implements IReader {
    protected _filePath!: string;

    public set filePath(classDescriptionFilePath: string) {
        this._filePath = path.resolve(classDescriptionFilePath);
    }

    @Logger.call()
    public read(): Promise<ActionResult> {
        return new Promise<ActionResult>((resolve, reject) => {
            try {
                // Load the JSON
                const classDescription: IClassDescriptionV1[] = require(this._filePath);

                classDescription.forEach((rawObject) => {
                    const fieldMap = new Map<string, string>(Object.entries(rawObject["fields"]));
                    rawObject.fields = fieldMap;
                });

                resolve(new ActionSuccess(classDescription));
            } catch (exception: any) {
                reject(new ActionFailure(undefined, exception.message));
            }
        });
    }
}

