import { AST } from "./ast";
interface Plain {
    type: string;
    left?: Plain;
    right?: Plain;
    argument?: Plain;
    body?: Plain;
    token?: any;
    macroTable?: any;
}
export declare function decode(tree: Plain): AST | null;
export {};
