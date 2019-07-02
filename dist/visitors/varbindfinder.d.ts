import { Application, Lambda } from "../ast";
import { ASTVisitor } from ".";
export declare class VarBindFinder extends ASTVisitor {
    tree: Lambda;
    varName: string;
    lambda: Lambda | null;
    constructor(tree: Lambda, varName: string);
    onApplication(application: Application): void;
    onLambda(lambda: Lambda): void;
}
