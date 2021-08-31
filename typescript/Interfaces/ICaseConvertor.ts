export interface ICaseConvertor {
    convertString(caseString: string, inputString: string, splitString?: string): string;
    addCase(caseString: string, converterMethod: (inputString: string, splitString?: string) => string): boolean;
    removeCase(caseString: string): boolean;
}