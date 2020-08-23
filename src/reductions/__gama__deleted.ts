// import { ASTReduction, ASTReductionType } from "."
// import { Binary, Child, AST, Macro, Application } from "../ast"


// export type arity = number

// export class Gama implements ASTReduction {
//   type : ASTReductionType = ASTReductionType.GAMA

//   constructor (
//     public readonly redexes : Array<Macro | Application>, // TODO: consider redexes : List<Application>
//     public readonly args : Array<AST>,
//     public parent : Binary | null,
//     public treeSide : Child | null, // na jaky strane pro parenta je redukovanej uzel
//     public readonly abstraction : [ string, arity ],
//     // public readonly target : AST, // EXPR ve kterem se provede nahrada
//   ) {}
// }