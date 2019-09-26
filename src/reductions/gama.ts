import { ASTReduction } from "."
import { Binary, Child, AST, Macro, Application, Variable, ChurchNumeral, Lambda } from "../ast"


export type arity = number

export class Gama implements ASTReduction {
  constructor (
    public readonly redexes : Array<Macro | Application>, // TODO: consider redexes : List<Application>
    public readonly args : Array<AST>,
    public parent : Binary | null,
    public treeSide : Child | null, // na jaky strane pro parenta je redukovanej uzel
    public readonly abstraction : [ string, arity ],
    // public readonly target : AST, // EXPR ve kterem se provede nahrada
  ) {}
}