import { environment } from "./environment";
import { CaseConverterFactory } from "./Factories/CaseConverterFactory";
import { CaseConverterFactoryV2 } from "./Factories/CaseConverterFactoryV2";
import { GeneratorFactoryV3 } from "./Factories/GeneratorFactoryV3";
import { GeneratorFactoryV4 } from "./Factories/GeneratorFactoryV4";
import { IAPIMainV1 } from "./Interfaces/IAPIMainV1";
import { ActionFailure, ActionResult, ActionSuccess } from "./Utils/ActionResult";
import { ConfigRetriever } from "./Utils/ConfigRetriever";
import { ConfigRetrieverV2 } from "./Utils/ConfigRetrieverV2";
import { Logger } from "./Utils/Logger";

// let debug = !environment.production ? console.log : () => { };

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
                Logger.debug(`${this.className}::${functionName}`, [classDescription]);
                for (const field of classDescription.fields) {
                    console.log(field);
                }

                let dataClassGenerator = GeneratorFactoryV4.getInstance(classDescription.language);

                // Get the case converter and set it in the generator
                let caseConverter = CaseConverterFactoryV2.getInstance();

                dataClassGenerator.caseConverter = caseConverter;
                dataClassGenerator.classDescription = classDescription;

                // Get the file extension
                let fileExtension = ConfigRetrieverV2.retrieve("fileextensions", classDescription.language).result;

                Logger.debug(`${this.className}::${functionName}`, { fileExtension });
                // console.log("FILE EXTENSIONS", fileExtension);

                let generatedClassCode = await dataClassGenerator.generate();

                let dataClassFileName = `${classDescription.name}.${fileExtension}`;

                // Return the Action Success object
                result = new ActionSuccess({
                    fileName: dataClassFileName,
                    data: generatedClassCode
                });
            }
        } catch (e: any) {
            // Logger.error(`${this.className}::${functionName}`, [{ message: e.message }]);
            console.log(e);

            throw new ActionFailure(undefined, e.message, -1);
        }
        return result;
    }
}

