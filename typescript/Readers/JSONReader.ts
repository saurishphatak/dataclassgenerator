import { IClassDescription } from "../Interfaces/IClassDescription";
import { ActionFailure, ActionResult, ActionSuccess } from "../Utils/ActionResult";
import { Logger } from "../Utils/Logger";
import JSONReaderV1 from "./JSONReaderV1";

@Logger.log
export default class JSONReader extends JSONReaderV1 {
    @Logger.call()
    public read(): Promise<ActionResult> {
        return new Promise<ActionResult>((resolve, reject) => {
            try {
                // Load the JSON
                const classDescriptions: {}[] = require(this._filePath);

                // Convert each classDescription to appropriate structure
                var result: IClassDescription[] = classDescriptions.map(classDescription => (this.convertObjectToMap(classDescription)) as IClassDescription);

                // console.log(result);
                resolve(new ActionSuccess(result));
            } catch (exception: any) {
                reject(new ActionFailure(undefined, exception.message));
            }
        });
    }

    // Converts an Object to Map<string, any>
    protected convertObjectToMap(outerObject: object): {} {

        const newObject: any = {};

        for (const [key, value] of Object.entries(outerObject)) {
            // Start recursively converting any object to Map<string, any>
            if (value.constructor.name == "Object") {
                newObject[key] = this.recurse(value);
            }
            else
                newObject[key] = value;
        }

        return newObject;
    }

    protected recurse = (targetObject: object): Map<string, any> => {
        var objectMap = new Map<string, any>();

        // Go over each entry and recursively convert 
        // them to map
        for (const [key, value] of Object.entries(targetObject)) {
            // If the entry's value is of Object type
            // Recurse and convert the lower levels to map
            if (value.constructor.name == "Object") {
                objectMap.set(key, this.recurse(value));
            }
            else
                objectMap.set(key, value);
        }

        return objectMap;
    }

}

// var testObject = [
//     {
//         "language": "typescript",
//         "className": "Customer",
//         "classFilePath": "./Test",
//         "fields": {
//             "name": {
//                 "type": "string",
//                 "getter": true,
//                 "setter": true,
//                 "decorators": [],
//                 "comment": "",
//                 "modifier": "protected",
//                 "defaultValue": ""
//             }
//         },
//         "extends": [],
//         "decorators": [],
//         "comment": []
//     }
// ];

const reader = new JSONReader();
reader.filePath = "./ClassDescription.json";
reader.read().then(result => {
    const res = result.result as IClassDescription[];

    res.forEach(resu => console.log(resu.fields));
});



