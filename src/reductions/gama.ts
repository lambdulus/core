import { ASTReduction } from "."
import { Binary, Child, AST, Macro, Application, Variable, ChurchNumeral, Lambda } from "../ast"


export type arity = number
export type GamaArg = Macro | Variable | ChurchNumeral | Lambda

export class Gama implements ASTReduction {
  constructor (
    public readonly redexes : Array<Macro | Application>, // TODO: consider redexes : List<Application>
    public readonly args : Array<GamaArg>,
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null, // na jaky strane pro parenta je redukovanej uzel
    public readonly abstraction : [ string, arity ]
    // public readonly target : AST, // EXPR ve kterem se provede nahrada
  ) {}
}