import { IClassDescriptionV1 } from "./IClassDescriptionV1";

export interface IClassDescription extends IClassDescriptionV1 {
    fields: Map<string, any>;
    decorators: string[];
    comment: string[];
    constructors: Map<string, any>
}