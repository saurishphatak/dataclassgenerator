export class CsharpProperty implements ICsharpProperty {
    public propertyName: string;
    public propertyType: string;
    public propertyAccessModifier = 'public';
    public accessors: Map<string, any>;
    public propertyAttributes: string;

    public constructor(
        initialValues: ICsharpProperty
    ) {
        this.propertyName = initialValues.propertyName;
        this.propertyType = initialValues.propertyType;
        this.accessors = initialValues.accessors;
        this.propertyAttributes = initialValues.propertyAttributes;
        this.propertyAccessModifier = initialValues.propertyAccessModifier;
    }

}

export interface ICsharpProperty {
    propertyName: string;
    propertyType: string;
    propertyAccessModifier: string;
    accessors: Map<string, any>;
    propertyAttributes: string;
}
