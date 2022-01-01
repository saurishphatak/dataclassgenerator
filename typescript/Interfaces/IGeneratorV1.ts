import { ActionResult } from "../Utils/ActionResult";
import { ICaseConvertor } from "./ICaseConvertor";
import { IClassDescriptionV1 } from "./IClassDescriptionV1";

export interface IGeneratorV1 {
    set classDescription(metadata: IClassDescriptionV1);
    set caseConverter(caseConverter: ICaseConvertor);
    generate(): string;
}