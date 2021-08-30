import { IClassDescription } from "./IClassDescription";

export interface IGenerator {
	_metadata: IClassDescription[];

	set classDescription(metadata: IClassDescription[]);
}