import { ActionResult } from "../Utils/ActionResult";
import { IClassDescription } from "./IClassDescription";

export interface IGenerator {
	set classDescription(metadata: IClassDescription[]);

	generate(): Promise<ActionResult>;
}