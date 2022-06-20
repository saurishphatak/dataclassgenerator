import fs from "fs";
import path from "path";
import { environment } from "./environment";
import { CaseConverterFactory } from "./Factories/CaseConverterFactory";
import { GeneratorFactoryV3 } from "./Factories/GeneratorFactoryV3";
import { IAPIMainV1 } from "./Interfaces/IAPIMainV1";
import { ActionFailure, ActionResult, ActionSuccess } from "./Utils/ActionResult";
import { ConfigRetriever } from "./Utils/ConfigRetriever";
import { Logger } from "./Utils/Logger";

let debug = !environment.production ? console.log : () => { };

@Logger.log
export class CsharpAPIMainV1 implements IAPIMainV1 {
    protected className = "CsharpAPIMainV1";

    protected _classDescriptions: any[] = [];

    set classDescriptions(classDescriptions: any[]) {
        this._classDescriptions = classDescriptions;
    }

    @Logger.call()
    async generate(): Promise<ActionResult> {
        let functionName = "generate()";

        let result!: ActionResult;
        try {

            for (const classDescription of this._classDescriptions) {
                // debug(`${this.className}::${functionName}`, [classDescription]);
                for (const field of classDescription.fields) {
                    console.log(field);
                }

                let dataClassGenerator = GeneratorFactoryV3.getInstance(classDescription.language);

                // Get the case converter and set it in the generator
                let caseConverter = CaseConverterFactory.getInstance();

                dataClassGenerator.caseConverter = caseConverter;
                dataClassGenerator.classDescription = classDescription;

                // Get the file extension
                let fileExtension = ConfigRetriever.retrieve("fileextensions", classDescription.language);

                let generatedClassCode = await dataClassGenerator.generate();

                //! Temprorily generate a file
                await fs.writeFile(
                    path.resolve("./Test/") + `TestCSClass.cs`, generatedClassCode, () => { }
                );

                // Return the Action Success object
                result = new ActionSuccess(generatedClassCode, "", 1);
            }
        } catch (e: any) {
            // Logger.error(`${this.className}::${functionName}`, [{ message: e.message }]);
            console.log(e);

            throw new ActionFailure(undefined, e.message, -1);
        }
        return result;
    }
}

