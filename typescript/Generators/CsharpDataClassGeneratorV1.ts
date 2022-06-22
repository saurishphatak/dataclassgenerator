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

    protected fieldsWithSetters = new Set<ICsharpField>();

    @Logger.call()
    generate(): string {
        let functionName = "generate()";

        let {
            classAttributes,
            comment,
            fields,
            name,
            namespace
        } = this._classDescription;

        let classCode = ``;

        // Add class namespace if any
        if (namespace.length > 0) {
            classCode += `namespace ${namespace}${this.N1}{${this.N1}`;
        }

        // Add class comment if any
        if (comment.length > 0) {
            classCode += `${comment}${this.N1}`;
        }

        // Add class attributes
        let classAttributesList = classAttributes.split('\n');
        let classAttributesCode = ``;
        for (const attribute of classAttributesList) {
            classAttributesCode += `[${attribute}]${this.N1}`;
        }

        classCode += classAttributesCode;

        // Add the class name
        // All classes will be abstract
        classCode += `public abstract class ${name}Abstract${this.N1}`;
        classCode += `{${this.N1}`;

        // Add all the fields
        let fieldsCode = ``;

        for (const field of fields) {
            let fieldCode = ``;

            let {
                name: fieldName,
                accessModifier,
                comment: fieldComment,
                dataType,
                defaultValue,
                fieldAttributes,
                isConstructorParam,
            } = field;

            if (field.comment.length > 0)
                fieldCode += `${this.T1}// ${fieldComment + this.N1}`;

            let fieldAttributesList = fieldAttributes.split("\n");

            let fieldAttributesCode = ``;
            for (const attribute of fieldAttributesList) {
                Logger.debug("FIELD ATTRIBUTE :", attribute);

                if (attribute?.length > 0)
                    fieldAttributesCode += `${this.T1}[${attribute}]${this.N1}`;
            }

            fieldCode += fieldAttributesCode;

            // Generate the field
            fieldCode += `${this.T1}${accessModifier} ${dataType} ${accessModifier == 'public' ? fieldName : "_" + fieldName}`;

            // Append the default initial value
            if (field.defaultValue?.length > 0) {
                fieldCode += ` = ${defaultValue}`;
            }

            fieldCode += `;${this.N1}`;

            // Generate property if needed
            let propertyCode = this.generatePropertyCode(field);
            Logger.debug(`${this.className}::${functionName} ${fieldName}`, propertyCode);

            fieldCode += propertyCode;

            fieldsCode += (fieldCode + `${this.N1}`);
        }

        // Add the fields and property code
        classCode += fieldsCode;

        // Add the constructor code
        classCode += this.generateParameterisedConstructor();

        // End the classcode with brace
        classCode += `}${this.N1}`;

        // Close the namespace
        if (namespace.length > 0) {
            classCode += `}${this.N1}`;
        }

        return classCode;
    }

    generatePropertyCode(field: ICsharpField): string {
        let functionName = "generatePropertyCode()";

        let {
            propertyName,
            accessors,
            propertyAccessModifier,
            propertyAttributes,
            propertyType
        } = field.property;

        let fieldDataType = field.dataType;

        let propertyCode = ``;
        if (propertyName?.length > 0) {

            // Add the property attributes if any
            let propertyAttributesList = propertyAttributes.split("\n");

            let propertyAttributesCode = ``;
            for (const attribute of propertyAttributesList) {
                if (attribute.trim().length > 0)
                    propertyAttributesCode += `${this.T1}[${attribute}]${this.N1}`;
            }

            propertyCode += propertyAttributesCode;

            // Create the property
            propertyCode += `${this.T1 + propertyAccessModifier} ${propertyType} ${fieldDataType} ${propertyName}`;

            // Opening of property body
            propertyCode += `${this.N1 + this.T1}{${this.N1}`;

            let accessorCode = this.generateAccessorCode(field);

            // Property code finished
            propertyCode += accessorCode;

            // Closing of property body
            propertyCode += `${this.T1}}${this.N1}`;
        }

        Logger.debug(`${this.className}::${functionName} ${propertyName}`, { propertyCode });
        return propertyCode;
    }

    generateAccessorCode(field: ICsharpField) {
        let functionName = "generateAccessorCode";

        let getterCode = ``;

        // field.accessors is an object and needs to be converted to Map<string, any>
        field.property.accessors = new Map<string, any>(Object.entries(field.property.accessors));
        let accessors = field.property.accessors;

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

            // Add the field to fields with setter lists
            this.fieldsWithSetters.add(field);

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

    generateParameterisedConstructor() {
        let functionName = "generateParameterisedConstructor()";

        let { name, fields } = this._classDescription;

        let constructorCode = `${this.T1}public ${name}(${this.N1}`;

        // Add the fields to the list of parameters in the constructor
        for (const field of fields) {
            constructorCode += `${this.T2}${field.dataType} ${field.name},${this.N1}`
        }

        // Remove the last comma
        constructorCode = constructorCode.substring(0, constructorCode.length - 2);

        // Close the constructor param list
        constructorCode += `${this.N1 + this.T1})${this.N1}${this.T1}{${this.N1}`;

        // Add the constructor body
        // Setters of fields will be used to assign values to the field
        // else the field will be initialized directly
        for (const field of this.fieldsWithSetters) {

            // If the field is to be initialized in the constructor
            if (field.isConstructorParam)
                constructorCode += `${this.T2}this.${field.property.propertyName} = ${field.name};${this.N1}`;
        }

        // Add the fields that need to be initalized directly and 
        // those that are not in the fieldWithSetters
        for (const field of fields) {
            let fieldName = `${field.accessModifier == "public" ? field.name : "_" + field.name}`;

            if (field.isConstructorParam && !this.fieldsWithSetters.has(field)) {
                Logger.debug(`${this.className}::${functionName} DIRECTLY INITIALIZE FIELD : `, field);
                constructorCode += `${this.T2}this.${fieldName} = ${field.name};${this.N1}`;
            }

        }

        // Close the constructor body
        constructorCode += `${this.N1}}${this.N1}`;

        return constructorCode;
    }
}