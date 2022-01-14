import { ICaseConvertor } from "../Interfaces/ICaseConvertor";
import { IClassDescription } from "../Interfaces/IClassDescription";
import { IClassDescriptionV1 } from "../Interfaces/IClassDescriptionV1";
import { Logger } from "../Utils/Logger";
import TypescriptDataClassGeneratorV1 from "./TypescriptDataClassGeneratorV1";

var myLogger = console.log;
@Logger.log
export default class TypescriptDataClassGenerator extends TypescriptDataClassGeneratorV1 {
    protected _classSpecification!: IClassDescription;

    public set classDescription(newClassDescription: IClassDescription) {
        this._classSpecification = newClassDescription;
    }

    // Holds a map of functions that generate different type
    // of constructors
    protected _constructorCodeGenerators = new Map<string, () => string>
        (
            [
                ["parameterized", this.generateParameterizedConstructor.bind(this)],
                ["default", this.generateDefaultConstructor.bind(this)]
            ]
        );

    // Generates the data class
    @Logger.call()
    public generate(): any {
        // Holds the auto generated comment for the class
        let classCode = `/**${this.N1}* Auto Generated Abstract Data Class${this.N1}*${this.N1}* Generated on : ${new Date().toString()}${this.N1}*/${this.N1}`;

        // Extract the className
        let className = this._classSpecification.className;
        Logger.info(`Generating code for class : `, [className]);

        // Start adding the code for the class
        classCode += `export abstract class ${className}Abstract {${this.N1}`;

        // Holds the fields of the class
        const fields = this._classSpecification.fields;
        Logger.info(`Field names for class ${className} : `, [fields.keys()]);

        // Holds code for all the fields
        const fieldList: string[] = [];

        // Holds getter setter code for the fields
        const getterSetterCode: string[] = [];

        // Holds the constructors types that have to be generated for this class
        const constructorTypes = this._classSpecification.constructors;

        // Add fields to the class
        for (const fieldNameKey of fields.keys()) {
            // // Map<string, any> holding the field's properties
            // const fieldProperties: Map<string, any> = fields.get(fieldNameKey);

            // // Name of the field
            // let fieldName: string = fieldNameKey;

            // // Data type of the field
            // let dataType: string = fieldProperties.get("type");

            // // Access modifier for the field
            // let modifier: string = fieldProperties.get("modifier") ?? "public";

            // // Default value for the field 
            // let defaultValue: string = fieldProperties.get("defaultValue");

            // // Comment for the field
            // let comment: string = fieldProperties.get("comment");

            // // Decorators for the field
            // let decorators: string[] = fieldProperties.get("decorators");

            // // Add the field to the code
            // let fieldCode = comment.length ? `${this.N1 + this.T1 + comment + this.N1}` : "";

            // // Add the decorators to the field
            // decorators.forEach(decorator => fieldCode += `${this.T1 + decorator + this.N1}`);

            // // Add the fieldName and modifier
            // fieldCode += `${this.T1}${modifier} ${modifier == "public" ? `${fieldName}` : `_${fieldName}`}`;

            // // Add the field data type
            // fieldCode += `: ${dataType.length ? dataType : "any"}`;

            // // Add the defaultValue to the fieldCode
            // fieldCode += ` = ${defaultValue + this.N1}`;

            // Generate the getter and setter for this field
            getterSetterCode.push(this.generateGetter(fieldNameKey));
            getterSetterCode.push(this.generateSetter(fieldNameKey));

            // // Add the fieldCode to the fieldList
            // fieldList.push(fieldCode);
        }

        // Generate constructor(s) for this class
        for (const constructorType of constructorTypes.keys()) {
            // Get the generator for this constructor
            const constructorCodeGenerator = this._constructorCodeGenerators.get(constructorType) ?? (() => "");

            // Invoke the generator
            let constructorCode = constructorCodeGenerator();

            // Add it to the classCode
            classCode += constructorCode;

            // If the constructor is of type default then generate the fields too
            if (constructorType == "default") {
                for (const fieldNameKey of fields.keys()) {
                    fieldList.push(this.generateFieldCode(fieldNameKey));
                }
            }
        }

        fieldList.forEach(fieldCode => classCode += (fieldCode + `${this.N1}`));
        getterSetterCode.forEach(getterSetter => classCode += (getterSetter + `${this.N1}`));

        return classCode + `${this.N1}}`;
    }

    // Generates default constructor
    @Logger.call()
    public generateDefaultConstructor(): string {
        let constructorCode = `${this.N1 + this.T1}public constructor() { }${this.N1}`;

        return constructorCode;
    }

    // Generates positional (parameterized) constructor
    @Logger.call()
    public generateParameterizedConstructor(): string {

        // Holds the fields of this class
        const fields = this._classSpecification.fields;

        // Holds the constructor code
        let constructorCode = `${this.N1 + this.T1}public constructor (${this.N1}`;
        let fieldCount = 0;

        // Go over each field
        for (const fieldName of fields.keys()) {
            fieldCount++;

            // Holds the fieldProperties for this field
            const fieldProperties: Map<string, any> = fields.get(fieldName);

            // Holds the modifier of this field
            const modifier: string = fieldProperties.get("modifier") ?? "public";

            // Holds the data type of this field
            const dataType: string = fieldProperties.get("type") ?? "";

            // Holds the default value of this field
            const defaultValue: string = fieldProperties.get("defaultValue");

            // Holds the comment for this field
            const comment: string = fieldProperties.get("comment") ?? "";

            // Holds the decorators of this field
            const decorators: string[] = fieldProperties.get("decorators") ?? [];

            if (fieldCount == 1)
                constructorCode += `${this.T2 + comment + this.N1}`;

            constructorCode += `${this.T2}${modifier} ${modifier == "public" ? "" : "_"}${fieldName}: ${dataType}${defaultValue ? " = " + defaultValue : ""}${this.N1}`;

            if (fieldCount != fields.size)
                constructorCode += `,`;

            constructorCode += `${this.N1}`;
        }

        // Complete the constructor code
        constructorCode += `${this.T1}) { }${this.N1}`;

        return constructorCode;


    }

    // Generates the getter for the field
    public generateGetter(fieldName: string): string {
        let getterCode = "";

        // Get the properties for this field
        let fieldProperties: Map<string, any> = this._classSpecification.fields.get(fieldName);
        // Get the type of the field
        let dataType: string = fieldProperties.get("type") ?? "any";

        // Get the getter property map for this field
        let getterPropertyMap: Map<string, any> = fieldProperties.get("getter");
        myLogger(`Getter for ${fieldName}`, getterPropertyMap);

        // Return if there is no map found
        if (!getterPropertyMap)
            return getterCode;

        // If there is a getter property map, get the decorators
        let decorators: string[] = getterPropertyMap?.get("decorators");

        // Add the decorators to the getterCode
        getterCode = decorators.reduce((previousValue, decorator) => previousValue + `${this.T1}${decorator}${this.N1}`, "");

        getterCode += `${this.T1}public abstract get ${fieldName}(): ${dataType};${this.N1}`;

        return getterCode;
    }

    // Generates the setter code for the field
    public generateSetter(fieldName: string): string {
        let setterCode = "";

        // Get the properties for this field
        let fieldProperties: Map<string, any> = this._classSpecification.fields.get(fieldName);

        // Get the type of this field
        let dataType: string = fieldProperties.get("type") ?? "any";

        // Get the setter property map for this field
        let setterPropertyMap: Map<string, any> = fieldProperties.get("setter");
        myLogger(`Setter for ${fieldName}`, setterPropertyMap);

        // If there is no setter map, return
        if (!setterPropertyMap)
            return setterCode;

        // Get the decorators for this setter
        let decorators: string[] = setterPropertyMap?.get("decorators") ?? [];

        setterCode = decorators.reduce((previousValue, decorator) => previousValue + `${this.T1}${decorator}${this.N1}`, "");

        setterCode += `${this.T1}public abstract set ${fieldName}(newValue): ${dataType};${this.N1}`;

        return setterCode;
    }

    // Generates field code 
    public generateFieldCode(fieldName: string): string {
        let fieldCode = "";

        // Properties of this field
        let fieldProperties: Map<string, any> = this._classSpecification.fields.get(fieldName);

        // Data type of this field
        let dataType: string = fieldProperties.get("type") ?? "any";

        // Comment for this field
        let comment: string = fieldProperties.get("comment");

        // Holds the decorators for this field
        let decorators: string[] = fieldProperties.get("decorators") ?? [];

        // Modifier for this field
        let modifier: string = fieldProperties.get("modifier") ?? "public";

        // Default value for this field
        let defaultValue: string = fieldProperties.get("defaultValue");

        // Start adding code to the field
        fieldCode += `${this.N1 + this.T1}${comment ? "//" + comment : ""}${this.N1}`;

        // Add decorators to the code
        fieldCode += decorators.reduce((previousValue, decorator) => previousValue + `${this.T1}${decorator}${this.N1}`, "");

        fieldCode += `${this.T1}${modifier} ${modifier == "public" ? fieldName : "_" + fieldName}: ${dataType}${defaultValue ? " = " + defaultValue : ""};${this.N1}`;

        return fieldCode;
    }
}

// const answer = ["@some()", "@another"].reduce((prev, dec) => prev + `\t${dec}\n`, "");

// console.log(answer);
