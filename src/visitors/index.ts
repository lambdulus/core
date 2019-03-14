import { Lambda } from "../ast/lambda";
import { Binary, AST } from "../ast";
import { Application } from "../ast/application";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
import { Macro } from "../ast/macro";

export enum Child {
  Left = 'left',
  Right = 'right',
}

// TODO: decide which is prettier
// export type NextReduction = NextAlpha | NextBeta | NextExpansion | NextNone

// export interface NextReduction extends ReductionVisitable {}

// TODO: tohle je asi nejlepsi volba
// TODO: odstranit Next z nazvu
export type NextReduction = ReductionVisitable


// TODO: maybe find better name for it
// export interface SingleAlpha {
//   tree : Lambda,
//   oldName : string, // TODO: delete, budu si to brat primo z tree.argument.name()
//   newName : string, // TODO: delete, udela se in place
//   // references : Array<Variable> // TODO: references to AST to mutate directly and without further searching
// }

export class NextAlpha implements NextReduction {
  constructor (
    public readonly conversions : Set<Lambda>,
  ) {}

  public visit (visitor : ReductionVisitor) : void {
    visitor.onAlpha(this)
  }
}

// TODO: vyresit pro pripady kdy jde o multilambdu
// pak bude navic drzet mnozinu values a mnozinu arguments
// spis mnozinu tuples
export class NextBeta implements NextReduction {
  constructor (
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null, // na jaky strane pro parenta je redukovanej uzel
    public readonly target : AST, // EXPR ve kterem se provede nahrada
    public readonly argName : string,
    public readonly value : AST,
  ) {}

  visit (visitor : ReductionVisitor) : void {
    visitor.onBeta(this)
  }
}


export class NextExpansion implements NextReduction {
  constructor (
    public readonly parent : Binary | null,
    public readonly treeSide : Child | null,
    public readonly target : AST,
  ) {}

  visit (visitor : ReductionVisitor) : void {
    visitor.onExpansion(this)
  }
}

export class NextNone implements NextReduction {
  visit (visitor : ReductionVisitor) : void {
    visitor.onNone(this)
  }
}

// TODO: tohle klidne zrusit, rovnou interface AST tridy budou implementovat visit()
export interface ASTVisitable {
  visit (visitor : ASTVisitor) : void,
}
// TODO: tady to same
export interface ReductionVisitable {
  visit (visitor : ReductionVisitor) : void,
}


export interface ASTVisitor {
  onApplication (application : Application) : void,
  onLambda (lambda : Lambda) : void,
  onChurchNumber (churchNumber : ChurchNumber) : void,
  onMacro (macro : Macro) : void,
  onVariable (variable : Variable) : void,
}

// TODO: tohle jako materskou tridu, rovnou implementuje vsechny metody jako prazdny, 
// pak nemusim mit konkretni tridy prazdny 
export interface ReductionVisitor {
  onAlpha (alpha : NextAlpha) : void,
  onBeta (beta : NextBeta) : void,
  onExpansion (expansion : NextExpansion) : void,
  onNone (none : NextNone) : void,
}
