import { IClassDescriptionV1 } from "./IClassDescriptionV1";

export interface IClassDescription extends IClassDescriptionV1 {
    fields: Map<string, any>;
    decorator: string[];
    extends: string[];
    comment?: string;
}