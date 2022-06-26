import { CsharpAPIMainV1 } from "./CsharpAPIMainV1";
import CsharpDataClassGeneratorV1 from "./Generators/CsharpDataClassGeneratorV1";
import JavaDataClassGenerator from "./Generators/JavaDataClassGenerator";
import TypescriptDataClassGeneratorV2 from "./Generators/TypescriptDataClassGeneratorV2";
import JSONReader from "./Readers/JSONReader";
import DefaultCaseConverter from "./Utils/DefaultCaseConverter";

export const RootConfig = {
    generators: {
        "java": JavaDataClassGenerator,
        "typescript": TypescriptDataClassGeneratorV2,
        "csharp": CsharpDataClassGeneratorV1
    },
    readers: {
        "json": JSONReader
    },
    caseconverters: {
        "defaultcaseconverter": DefaultCaseConverter
    },
    fileextensions: {
        "java": "java",
        "typescript": "ts",
        "javascript": "js",
        "csharp": "cs"
    }
};