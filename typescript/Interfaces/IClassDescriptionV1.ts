export interface IClassDescriptionV1 {
    language: string;
    classFilePath: string;
    className: string;
    fields: Map<string, string>;
}