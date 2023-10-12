import { environment } from "../environment";
import { ICaseConvertor } from "../Interfaces/ICaseConvertor";
import { IGeneratorV3 } from "../Interfaces/IGeneratorV3";
import { ICharpClass } from "../Models/csharp/CsharpClass";
import { ICsharpField } from "../Models/csharp/CsharpField";
import { Logger } from "../Utils/Logger";

// !environment.production ? Logger.toggleDebug() : () => { };

@Logger.log
export default class CsharpDataClassGeneratorV1 implements IGeneratorV3 {
    protected className = "CsharpDataClassGeneratorV1";

    protected tabOffset = ``;
    protected T1 = `\t`;
    protected T2 = `\t\t`;
    protected T3 = `\t\t\t`;
    protected N1 = "\n";

    protected _classDescription!: ICharpClass;
    protected _caseConverter!: ICaseConvertor;

    set classDescription(metadata: any) {
        this._classDescription = metadata as ICharpClass;
    }

    set caseConverter(converter: ICaseConvertor) {
        this._caseConverter = converter;
    }

    protected fieldsWithSettersOrInit = new Set<ICsharpField>();

    @Logger.call()
    public generate(): string {
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
        if (namespace.trim().length > 0) {
            classCode += `namespace ${namespace}${this.N1}{${this.N1}`;

            this.tabOffset = `\t`;
            this.T1 = `${this.tabOffset}${this.T1}`;
            this.T2 = `${this.tabOffset}${this.T2}`;
            this.T3 = `${this.tabOffset}${this.T3}`;
        }

        // Add class comment if any
        if (comment.trim().length > 0) {
            classCode += `${this.tabOffset}// ${comment.trim()}${this.N1}`;
        }

        // Add class attributes
        let classAttributesList = classAttributes.split('\n');
        let classAttributesCode = ``;
        for (const attribute of classAttributesList) {
            if (attribute?.trim().length > 0)
                classAttributesCode += `[${attribute}]${this.N1}`;
        }

        classCode += classAttributesCode;

        // Add the class name
        // All classes will be abstract
        classCode += `${this.tabOffset}public abstract class ${name.trim()}Abstract${this.N1}`;
        classCode += `${this.tabOffset}{${this.N1}`;

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

            name = name?.trim();
            accessModifier = accessModifier?.trim();
            comment = comment?.trim();
            dataType = dataType?.trim();
            defaultValue = defaultValue?.trim();
            fieldAttributes = fieldAttributes?.trim();

            if (field.comment?.trim().length > 0)
                fieldCode += `${this.T1}// ${fieldComment + this.N1}`;

            let fieldAttributesList = fieldAttributes.split("\n");

            let fieldAttributesCode = ``;
            for (const attribute of fieldAttributesList) {
                Logger.debug("FIELD ATTRIBUTE :", attribute);

                if (attribute?.length > 0)
                    fieldAttributesCode += `${this.T1}[${attribute?.trim()}]${this.N1}`;
            }

            fieldCode += fieldAttributesCode;

            // Generate the field
            fieldCode += `${this.T1}${accessModifier} ${dataType} ${accessModifier == 'public' ? fieldName : "_" + fieldName}`;

            // Append the default initial value
            if (field.defaultValue?.length > 0) {
                fieldCode += ` = ${defaultValue}`;
            }

            fieldCode += `;${this.N1 + this.N1}`;

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
        classCode += `${this.tabOffset}}${this.N1}`;

        // Close the namespace
        if (namespace.length > 0) {
            classCode += `}${this.N1}`;
        }

        return this.generateHeaderComment() + classCode;
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

        propertyName = propertyName?.trim();
        propertyAttributes = propertyAttributes?.trim();
        propertyType = propertyType?.trim();

        let fieldDataType = field.dataType?.trim();

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

        let { propertyType } = field.property;
        propertyType = propertyType?.trim();


        let getterCode = ``;

        // field.accessors is an object and needs to be converted to Map<string, any>
        field.property.accessors = new Map<string, any>(Object.entries(field.property.accessors));
        let accessors = field.property.accessors;

        let fieldName = field.accessModifier == "public" ? field.name?.trim() : "_" + field.name?.trim();

        if (accessors.has("getter")) {
            let getterAttributesList: string[] = accessors.get("getter")?.getterAttributes?.trim()?.split("\n") ?? [];

            let attributesCode = ``;

            for (const attribute of getterAttributesList) {
                if (attribute?.trim()?.length > 0)
                    attributesCode += `${this.T2}[${attribute}]${this.N1}`;
            }

            getterCode += attributesCode;
            getterCode += `${this.T2}get`;

            // If the getter is of virtual type, add expression body
            if (propertyType == 'virtual') {
                getterCode += ` => ${fieldName}`;
            }

            getterCode += `;${this.N1 + this.N1}`;
        }

        let setterCode = ``;
        if (accessors.has("setter")) {
            let setterAttributesList: string[] = accessors.get("setter")?.setterAttributes?.trim()?.split("\n") ?? [];

            let attributesCode = ``;

            for (const attribute of setterAttributesList) {
                if (attribute?.trim()?.length > 0)
                    attributesCode += `${this.T2}[${attribute}]${this.N1}`;
            }

            setterCode += attributesCode;
            setterCode += `${this.T2}set`;

            if (propertyType == 'virtual') {
                setterCode += ` => ${fieldName} = value`;
            }

            // Add the field to fields with setter list
            this.fieldsWithSettersOrInit.add(field);

            setterCode += `;${this.N1 + this.N1}`;
        }

        let initializerCode = ``;
        if (accessors.has("initializer")) {
            let initializerAttributesList: string[] = accessors.get("initializer")?.initializerAttributes?.trim()?.split("\n") ?? [];

            let attributesCode = ``;

            for (const attribute of initializerAttributesList) {
                if (attribute?.trim()?.length > 0)
                    attributesCode += `${this.T2}[${attribute}]${this.N1}`;
            }

            initializerCode += attributesCode;
            initializerCode += `${this.T2}init`;

            if (propertyType == 'virtual') {
                initializerCode += ` => ${fieldName} = value`;
            }

            // Add the field to fields with init list
            this.fieldsWithSettersOrInit.add(field);

            initializerCode += `;${this.N1 + this.N1}`;
        }

        return getterCode + setterCode + initializerCode;
    }

    generateParameterisedConstructor() {
        let functionName = "generateParameterisedConstructor()";

        let { name, fields } = this._classDescription;
        name = name.trim();

        let isconstructorParamPresent = fields.some(f => f.isConstructorParam === true);

        let constructorCode = `${this.T1}public ${name}Abstract(${isconstructorParamPresent ? `${this.N1} ` : ``}`;

        // Add the fields to the list of parameters in the constructor
        // only if they are to be initialized in the constructor
        for (const field of fields) {
            if (field.isConstructorParam) {
                constructorCode += `${this.T2}${field.dataType?.trim()} ${field.name?.trim()},${this.N1}`;
            }
        }

        // Remove the last comma only if there were any parameters passed
        // to the constructor
        if (isconstructorParamPresent) {
            constructorCode = constructorCode.substring(0, constructorCode.length - 2);
        }

        // Close the parantheses on the next line only if there 
        // are parameters passed to the constructor
        if (isconstructorParamPresent) {
            constructorCode += `${this.N1}${this.T1}`;
        }
        // Close the constructor param list
        constructorCode += `)${this.N1}${this.T1}{${this.N1}`;

        // Add the constructor body
        // Setters of fields will be used to assign values to the field
        // else the field will be initialized directly
        for (const field of this.fieldsWithSettersOrInit) {

            // If the field is to be initialized in the constructor
            if (field.isConstructorParam)
                constructorCode += `${this.T2}this.${field.property.propertyName?.trim()} = ${field.name?.trim()};${this.N1}`;
        }

        // Add the fields that need to be initalized directly and 
        // those that are not in the fieldWithSetters
        for (const field of fields) {
            let fieldName = `${field.accessModifier == "public" ? field.name?.trim() : "_" + field.name?.trim()}`;

            if (field.isConstructorParam && !this.fieldsWithSettersOrInit.has(field)) {
                Logger.debug(`${this.className}::${functionName} DIRECTLY INITIALIZE FIELD : `, field);
                constructorCode += `${this.T2}this.${fieldName} = ${field.name?.trim()};${this.N1}`;
            }

        }

        // Close the constructor body
        constructorCode += `${this.T1}}${this.N1}`;

        return constructorCode;
    }

    generateHeaderComment() {
        let headerComment = `/**${this.N1}`;

        headerComment += ` * Auto Generated Class${this.N1}`;
        headerComment += ` *${this.N1} * Generated On : ${new Date().toString()}${this.N1} *${this.N1}`;
        headerComment += ` */${this.N1 + this.N1}`;

        return headerComment;
    }
}