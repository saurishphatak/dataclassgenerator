import { IClassDescription } from "../Interfaces/IClassDescription";
import { IGenerator } from "../Interfaces/IGenerator";
import { ActionResult } from "../Utils/ActionResult";

export default class JavaDataClassGenerator implements IGenerator {
	protected _metadata!: IClassDescription[];

	set classDescription(metadata: IClassDescription[]) {
		this._metadata = metadata;
	}

	public generate(): Promise<ActionResult> {
		throw new Error("Method not implemented.");
	}

}