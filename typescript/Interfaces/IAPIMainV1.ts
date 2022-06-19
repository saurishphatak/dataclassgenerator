import { ActionResult } from "../Utils/ActionResult";

export interface IAPIMainV1 {
    generate(): Promise<ActionResult>;
    set classDescriptions(classDescriptions: any[]);
}