/// <reference path="../Namespace_IGenerator.ts">

import { IGeneratorV2 } from "./IGeneratorV2";

export interface IGeneratorV3 extends IGeneratorV2 {
    set classDescription(metadata: any);
}
