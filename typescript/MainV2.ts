import fs from "fs";
import { CaseConverterFactory } from "./Factories/CaseConverterFactory";
import { GeneratorFactoryV2 } from "./Factories/GeneratorFactoryV2";
import path from "path";
import { ReaderFactory } from "./Factories/ReaderFactory";
import { MainV1 } from "./MainV1";
import { ConfigRetriever } from "./Utils/ConfigRetriever";
import { Logger } from "./Utils/Logger";
import { IClassDescription } from "./Interfaces/IClassDescription";

@Logger.log
export class MainV2 extends MainV1 {
    // Override the generate method
    @Logger.call()
    public async generate() {
        // Get the file config file reader 
        const fileReader = ReaderFactory.getInstance(this._fileType);

        // Read the file and store the result
        fileReader.filePath = this._filePath;
        const result: IClassDescription[] = (await fileReader.read()).result;

        // console.log(result);
        // Logger.info(`result : ${result}`, []);

        // Go over each description now
        for (const classDescription of result) {
            try {
                // Get the generator
                const dataClassLanguage = classDescription.language;
                const dataClassGenerator = GeneratorFactoryV2.getInstance(dataClassLanguage);

                // Set the metadata
                const caseConverter = CaseConverterFactory.getInstance();
                dataClassGenerator.caseConverter = caseConverter;
                Logger.info("caseConverter : ", [caseConverter]);

                dataClassGenerator.classDescription = classDescription;

                Logger.info("classDescription", [classDescription]);

                // Generate
                const generatedClassCode = dataClassGenerator.generate();

                // Get the file extension for the current language
                const fileExtension = ConfigRetriever.retrieve("fileextensions", dataClassLanguage);

                // Create the new File
                const classFilePath = classDescription.classFilePath;
                const className = classDescription.className;

                await fs.writeFile(
                    path.resolve(classFilePath) +
                    `/${className}.${fileExtension}`,
                    generatedClassCode, () => { }
                );
            } catch (exception: any) { Logger.error(exception.message, []); }
        }

    }
}

// const runner = new MainV2();
// runner.classDescriptionFilePath = "./ClassDescription.json";
// runner.classDescriptionFileType = "json";
// runner.generate();