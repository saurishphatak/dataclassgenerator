import { ICaseConvertor } from "../Interfaces/ICaseConvertor";
import { IClassDescriptionV1 } from "../Interfaces/IClassDescriptionV1";
import { IGeneratorV1 } from "../Interfaces/IGeneratorV1";
import { Logger } from "../Utils/Logger";

@Logger.log
export default class TypescriptDataClassGeneratorV1 implements IGeneratorV1 {
    protected T1 = "\t";
    protected T2 = "\t\t";
    protected T3 = "\t\t\t";
    protected N1 = "\n";

    protected _classSpecification!: IClassDescriptionV1;
    protected _caseConverter!: ICaseConvertor;

    public set classDescription(metadata: IClassDescriptionV1) {
        this._classSpecification = metadata;
    }

    public set caseConverter(caseConverter: ICaseConvertor) {
        this._caseConverter = caseConverter;
    }

    @Logger.call()
    public generate(): string {
        // Holds the auto generated comment
        let classCode = `/**${this.N1}* Auto Generated Data Class${this.N1}*${this.N1}* Generated on : ${new Date().toString()}${this.N1}*/${this.N1}`;

        // Holds the code for the class
        classCode += `export class ${this._classSpecification.className} {${this.N1}`;

        // Add all the fields
        for (const field of this._classSpecification.fields) {
            classCode += `${this.T1}private _${field[0]}: ${field[1]};${this.N1}`;
        }

        // Add the code for the constructor now
        classCode += `${this.T1}public constructor(${this.N1}`;

        for (const field of this._classSpecification.fields) {
            classCode += `${this.T2}${field[0]}: ${field[1]},${this.N1}`;
        }

        // Remove the last comma
        classCode = classCode.substring(0, classCode.length - 2);

        classCode += `${this.N1 + this.T1}) {${this.N1}`;

        // Initialize the fields
        for (const field of this._classSpecification.fields) {
            classCode += `${this.T2}this._${field[0]} = ${field[0]};${this.N1}`;
        }

        // Complete the constructor code
        classCode += `${this.T1}}${this.N1 + this.N1}`

        // Add the getter and setters now
        for (const field of this._classSpecification.fields) {
            // Code for set property
            classCode += `${this.T1}public set ${field[0]}(${field[0]}Param: ${field[1]}) {${this.N1}`;
            classCode += `${this.T2}this._${field[0]} = ${field[0]}Param;${this.N1}${this.T1}}${this.N1 + this.N1}`;

            // Code for get property
            classCode += `${this.T1}public get ${field[0]}() {${this.N1}${this.T2}return this._${field[0]};${this.N1}${this.T1}}${this.N1 + this.N1}`;
        }


        // Complete the code and return
        classCode += `}`;

        return classCode;
    }

}