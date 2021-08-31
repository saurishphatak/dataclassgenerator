import { ActionResult } from "../Utils/ActionResult";
import { ICaseConvertor } from "./ICaseConvertor";
import { IClassDescription } from "./IClassDescription";

export interface IGenerator {
	set classDescription(metadata: IClassDescription);
	set caseConverter(caseConverter: ICaseConvertor);
	generate(): string;
}