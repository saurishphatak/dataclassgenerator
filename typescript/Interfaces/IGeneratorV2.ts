import { IClassDescription } from "./IClassDescription";
import { IGeneratorV1 } from "./IGeneratorV1";

export interface IGeneratorV2 extends IGeneratorV1 {
    set classDescription(metadata: IClassDescription);
}
