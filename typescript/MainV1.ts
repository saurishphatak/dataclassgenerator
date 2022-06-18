import { ReaderFactory } from "./Factories/ReaderFactory";
import { IClassDescriptionV1 } from "./Interfaces/IClassDescriptionV1";
import { GeneratorFactoryV1 } from "./Factories/GeneratorFactoryV1";
import { CaseConverterFactory } from "./Factories/CaseConverterFactory";
import { ConfigRetriever } from "./Utils/ConfigRetriever";
import fs from "fs/promises";
import path from "path";
import { Logger } from "./Utils/Logger";

Logger.log
export class MainV1 {
    protected _filePath!: string;
    protected _fileType!: string;

    public set classDescriptionFilePath(filePath: string) {
        this._filePath = filePath;
    }

    public set classDescriptionFileType(fileType: string) {
        this._fileType = fileType;
    }

    @Logger.call()
    public async generate() {
        // Get appropriate reader for the fileType
        const fileReader = ReaderFactory.getInstance(this._fileType);

        // Read the file and store the result
        fileReader.filePath = this._filePath;
        const result: IClassDescriptionV1[] = (await fileReader.read()).result;

        // Go over each description
        for (const classDescription of result) {
            try {
                // Get the appropriate generator for the class
                const dataClassGenerator = GeneratorFactoryV1.getInstance(classDescription.language);

                // Get the case converter 
                const caseConverter = CaseConverterFactory.getInstance();

                // Set the caseConverter in the generator
                dataClassGenerator.caseConverter = caseConverter;

                // Set the metadata
                dataClassGenerator.classDescription = classDescription;

                // Generate
                const generatedClassCode = dataClassGenerator.generate();

                // Get the file extension for the current language
                const fileExtension = ConfigRetriever.retrieve("fileextensions", classDescription.language);

                console.log(fileExtension);

                // Create a new File 
                await fs.writeFile(
                    path.resolve(classDescription.classFilePath) +
                    `/${classDescription.className}.${fileExtension}`,
                    generatedClassCode
                );

            } catch (exception: any) {
                Logger.error(exception.message, []);
            }
        }

    }
}

// const dataClassGenerator = new MainV1();
// dataClassGenerator.classDescriptionFilePath = "./ClassDescription.json";
// dataClassGenerator.classDescriptionFileType = "json";
// dataClassGenerator.generate();