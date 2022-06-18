import { ICsharpProperty } from "./CsharpProperty";

export class CsharpField implements ICsharpField {

    public name: string;
    public dataType = "";
    public defaultValue = "";
    public comment = "";
    public fieldAttributes = "";
    public property: ICsharpProperty;
    public isConstructorParam: boolean = true;
    public accessModifier = "public";

    protected static _lastID = 0;

    public id = ++CsharpField._lastID;

    public constructor(
        initialValues: ICsharpField
    ) {
        this.name = initialValues.name;
        this.dataType = initialValues.dataType;
        this.comment = initialValues.comment;
        this.fieldAttributes = initialValues.fieldAttributes;
        this.property = initialValues.property;
        this.isConstructorParam = initialValues.isConstructorParam;
        this.accessModifier = initialValues.accessModifier;
    }
}

export interface ICsharpField {
    name: string;
    dataType: string;
    accessModifier: string;
    defaultValue: string;
    comment: string;
    fieldAttributes: string;
    property: ICsharpProperty;
    isConstructorParam: boolean;
}
