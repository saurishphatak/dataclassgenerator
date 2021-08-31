import { ICaseConvertor } from "../Interfaces/ICaseConvertor";
import { ActionFailure } from "./ActionResult";

export default class DefaultCaseConverter implements ICaseConvertor {

	protected converterMap = new Map<string, (inputString: string, splitString: string) => string>();

	public constructor() {
		this.converterMap.set("proper", this.properCaseConverter.bind(this));
		this.converterMap.set("camel", this.camelCaseConverter.bind(this));
	}


	public convertString(caseString: string, inputString: string, splitString: string = "_"): string {
		let result = "";

		if (this.converterMap.has(caseString.toLowerCase())) {
			let converterMethod = this.converterMap.get(caseString.toLowerCase());

			if (converterMethod)
				result = converterMethod(inputString, splitString);

			else
				throw new ActionFailure(undefined, `No converter exists for case : ${caseString}!`);
		}

		return result;
	}


	public addCase(caseString: string, converterMethod: (inputString: string, splitString: string) => string): boolean {
		this.converterMap.set(caseString.toLowerCase(), converterMethod);
		return true;
	}


	public removeCase(caseString: string): boolean {
		return this.converterMap.delete(caseString.toLowerCase());
	}

	protected properCaseConverter(inputString: string, splitString: string): string {
		let result = "";

		let words = inputString.split(splitString.length > 0 ? splitString : "_");
		words = words.map(word => word.charAt(0).toUpperCase() + word.substring(1));

		result = words.reduce((result, word) => result + word);

		return result;
	}

	protected camelCaseConverter(inputString: string, splitString: string): string {
		let result = "";

		let words = inputString.split(splitString.length > 0 ? splitString : "_");
		words = words.map(word => word.charAt(0).toUpperCase() + word.substring(1));

		// Make the first letter of first word lowercase
		words[0] = words[0].charAt(0).toLowerCase() + words[0].substring(1);

		result = words.reduce((result, word) => result + word);

		return result;
	}
}