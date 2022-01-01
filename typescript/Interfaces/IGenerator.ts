import { IClassDescription } from "./IClassDescription";
import { IGeneratorV1 } from "./IGeneratorV1";

export interface IGenerator extends IGeneratorV1 {
    set classDescription(metadata: IClassDescription);
}