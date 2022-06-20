import { environment } from "../environment";
import { ICaseConvertor } from "../Interfaces/ICaseConvertor";
import { IGeneratorV3 } from "../Interfaces/IGeneratorV3";
import { ICharpClass } from "../Models/csharp/CsharpClass";
import { ICsharpField } from "../Models/csharp/CsharpField";
import { Logger } from "../Utils/Logger";

let debug = !environment.production ? console.log : () => { };

@Logger.log
export default class CsharpDataClassGeneratorV1 implements IGeneratorV3 {
    protected className = "CsharpDataClassGeneratorV1";

    protected T1 = "\t";
    protected T2 = "\t\t";
    protected T3 = "\t\t\t";
    protected N1 = "\n";

    protected _classDescription!: ICharpClass;
    protected _caseConverter!: ICaseConvertor;

    set classDescription(metadata: any) {
        this._classDescription = metadata as ICharpClass;
    }

    set caseConverter(converter: ICaseConvertor) {
        this._caseConverter = converter;
    }

    @Logger.call()
    generate(): string {
        let functionName = "generate()";

        let namespace = this._classDescription.namespace;

        let classCode = ``;

        if (namespace.length > 0) {
            classCode += `namespace ${namespace} {${this.N1}`;
        }

        // Add the class name
        // All classes will be abstract
        classCode += `public abstract class ${this._classDescription.name}Abstract${this.N1}`;
        classCode += `{${this.N1}`;

        // Add all the fields
        let fields = ``;

        for (const field of this._classDescription.fields) {
            let fieldCode = ``;

            let {
                name,
                accessModifier,
                comment,
                dataType,
                defaultValue,
                fieldAttributes,
                isConstructorParam,
            } = field;

            if (field.comment.length > 0)
                fieldCode += `${this.T1}// ${comment + this.N1}`;

            let fieldAttributesList = fieldAttributes.split("\n");

            let fieldAttributesCode = ``;
            for (const attribute of fieldAttributesList) {
                Logger.debug("FIELD ATTRIBUTE :", attribute);

                if (attribute?.length > 0)
                    fieldAttributesCode += `${this.T1}[${attribute}]${this.N1}`;
            }

            fieldCode += fieldAttributesCode;

            // Generate the field
            fieldCode += `${this.T1}${accessModifier} ${dataType} ${accessModifier == 'public' ? name : "_" + name}`;

            // Append the default initial value
            if (field.defaultValue?.length > 0) {
                fieldCode += ` = ${defaultValue}`;
            }

            fieldCode += `;${this.N1}`;

            // Generate property if needed
            let propertyCode = this.generatePropertyCode(field);

            Logger.debug("PROPERTY CODE :", { propertyCode });

            fieldCode += propertyCode;

            fields += (fieldCode + `${this.N1}`);

            Logger.debug(`${this.className}::${functionName}`, { fieldCode });
        }

        Logger.debug(`${this.className}::${functionName}`, { classCode });

        return classCode + fields + `}${this.T1}`;

    }

    generatePropertyCode(field: ICsharpField): string {
        let {
            propertyName,
            accessors,
            propertyAccessModifier,
            propertyAttributes,
            propertyType
        } = field.property;

        let fieldDataType = field.dataType;

        let propertyCode = ``;
        if (field.property.propertyName?.length > 0) {
            propertyCode += `${this.T1 + propertyAccessModifier} ${propertyType} ${fieldDataType} ${propertyName}`;

            // Opening of property body
            propertyCode += `${this.N1 + this.T1}{${this.N1}`;

            let accessorCode = this.generateAccessorCode(field);

            Logger.debug("ACCESSOR CODE :", { accessorCode });

            // Property code finished
            propertyCode += accessorCode;

            // Closing of property body
            propertyCode += `${this.T1}}${this.N1}`;
        }

        return propertyCode;
    }

    generateAccessorCode(field: ICsharpField) {
        let functionName = "generateAccessorCode";

        let getterCode = ``;

        // field.accessors is an object and needs to be converted to Map<string, any>
        field.property.accessors = new Map<string, any>(Object.entries(field.property.accessors));
        let accessors = field.property.accessors;

        Logger.debug(`${this.className}::${functionName}`, field);

        let fieldName = field.accessModifier == "public" ? field.name : "_" + field.name;

        if (accessors.has("getter")) {
            let getterAttributesList: string[] = accessors.get("getter")?.getterAttributes?.split("\n") ?? [];

            let attributesCode = ``;

            for (const attribute of getterAttributesList) {
                attributesCode += `${this.T2}[${attribute}]${this.N1}`;
            }

            getterCode += attributesCode;
            getterCode += `${this.T2}get`;

            // If the getter is of virtual type, add expression body
            if (field.property.propertyType == 'virtual') {
                getterCode += ` => ${fieldName}`;
            }

            getterCode += `;${this.N1}`;
        }

        let setterCode = ``;
        if (accessors.has("setter")) {
            let setterAttributesList: string[] = accessors.get("setter")?.setterAttributes?.split("\n") ?? [];

            let attributesCode = ``;

            for (const attribute of setterAttributesList) {
                attributesCode += `${this.T2}[${attribute}]${this.N1}`;
            }

            setterCode += attributesCode;
            setterCode += `${this.T2}set`;

            if (field.property.propertyType == 'virtual') {
                setterCode += ` => ${fieldName} = value`;
            }

            setterCode += `;${this.N1}`;
        }

        let initializerCode = ``;
        if (accessors.has("initializer")) {
            let initializerAttributesList: string[] = accessors.get("initializer")?.initializerAttributes?.split("\n") ?? [];

            let attributesCode = ``;

            for (const attribute of initializerAttributesList) {
                attributesCode += `${this.T2}[${attribute}]${this.N1}`;

                initializerCode += attributesCode;
                initializerCode += `${this.T2}init`;

                if (field.property.propertyType == 'virtual') {
                    initializerCode += ` => ${fieldName} = value`;
                }

                initializerCode += `;${this.N1}`;
            }
        }

        return getterCode + setterCode + initializerCode;
    }
}