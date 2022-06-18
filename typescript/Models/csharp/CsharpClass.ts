import { CsharpField, ICsharpField } from "./CsharpField";

export class CsharpClass implements ICharpClass {
    public name: string;
    public namespace = '';
    public classAttributes = '';
    public comment = '';

    public fields: ICsharpField[];

    public constructor(
        initialValues: ICharpClass
    ) {
        this.name = initialValues.name;
        this.namespace = initialValues.namespace;
        this.classAttributes = initialValues.classAttributes;
        this.comment = initialValues.comment;

        this.fields = initialValues.fields;
    }
}


export interface ICharpClass {
    name: string;
    namespace: string;
    classAttributes: string;
    comment: string;

    fields: ICsharpField[];
}