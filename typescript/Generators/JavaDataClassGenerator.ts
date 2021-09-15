import { ICaseConvertor } from "../Interfaces/ICaseConvertor";
import { IClassDescription } from "../Interfaces/IClassDescription";
import { IGenerator } from "../Interfaces/IGenerator";
import { Logger } from "../Utils/Logger";

@Logger.log
export default class JavaDataClassGenerator implements IGenerator {

	protected T1 = "\t";
	protected T2 = "\t\t";
	protected T3 = "\t\t\t";
	protected N1 = "\n";

	protected _metadata!: IClassDescription;
	protected _caseConverter!: ICaseConvertor;

	set classDescription(metadata: IClassDescription) {
		this._metadata = metadata;
	}

	set caseConverter(caseConverter: ICaseConvertor) {
		this._caseConverter = caseConverter;
	}

	@Logger.call()
	public generate(): string {
		// Holds the auto generated comment
		let classCode = `/**${this.N1}* Auto Generated Data Class${this.N1}*${this.N1}* Generated on : ${new Date().toString()}${this.N1}*/${this.N1}`;

		// Holds the code for the data class
		classCode += `public class ${this._metadata.className} {${this.N1}`;

		// Go over each field and add it to the code
		for (const field of this._metadata.fields) {
			classCode += `${this.T1}private ${field[1]} ${field[0]};${this.N1}`;
		}

		// Generate the constructor
		classCode += `${this.N1 + this.T1}public ${this._metadata.className}(${this.N1}`;
		for (const field of this._metadata.fields) {
			classCode += `${this.T2}${field[1]} ${field[0]},${this.N1}`;
		}

		// Complete the constructor
		classCode = classCode.substring(0, classCode.length - 2);
		classCode += `) {${this.N1}`;

		for (const field of this._metadata.fields) {
			classCode += `${this.T2}this.${field[0]} = ${field[0]};${this.N1}`
		}
		classCode += `${this.T1}}${this.N1}`;

		// Generate getter and setter methods for the fields
		for (const field of this._metadata.fields) {
			// console.log(field[0]);
			// Change the case of the fieldName
			const fieldName = this._caseConverter.convertString("proper", field[0]);

			classCode += `${this.N1 + this.T1}public ${field[1]} get${fieldName}() {${this.N1 + this.T2}return this.${field[0]};${this.N1}${this.T1}}${this.N1}`;

			classCode += `${this.N1 + this.T1}public void set${fieldName}(${field[1]} ${field[0]}) {${this.N1 + this.T2}this.${field[0]} = ${field[0]}; ${this.N1}${this.T1}}${this.N1}`;
		}

		// Complete the braces and return
		return classCode + `${this.N1}}`;
	}
}