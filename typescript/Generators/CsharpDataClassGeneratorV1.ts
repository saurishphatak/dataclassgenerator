import { environment } from "../environment";
import { ICaseConvertor } from "../Interfaces/ICaseConvertor";
import { IGeneratorV3 } from "../Interfaces/IGeneratorV3";
import { ICharpClass } from "../Models/csharp/CsharpClass";
import { Logger } from "../Utils/Logger";

let debug = !environment.production ? console.log : () => { };

@Logger.log
export default class CsharpDataClassGeneratorV1 implements IGeneratorV3 {
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
        let namespace = this._classDescription.namespace;

        let classCode = ``;

        if (namespace.length > 0) {
            classCode += `namespace ${namespace} {${this.N1}`;
        }

        return classCode;
    }
}