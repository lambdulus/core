import Parser, { AST, Binary } from '../parser'
import { Application } from '../parser/ast/application'
import { Lambda } from '../parser/ast/lambda'
import { ChurchNumber } from '../parser/ast/churchnumber'
import { Macro } from '../parser/ast/macro'
import { Variable } from '../parser/ast/variable'

export enum Child {
  Left = 'left',
  Right = 'right',
}

// TODO: decide which is prettier
// export type NextReduction = NextAlpha | NextBeta | NextExpansion | NextNone

export interface NextReduction extends ReductionVisitable {}

export class NextAlpha implements NextReduction {
  constructor (
    public readonly tree : Application,
    public readonly child : Child,
    public readonly oldName : string,
    public readonly newName : string,
    // TODO:
    // taky mnozinu referenci na vyskyty promennych tam, kde se budou nahrazovat
    // at to nemusi implementace hledat, proste doslova jenom prohazi ??? -> zvazit
  ) {}

  public visit (visitor : ReductionVisitor) : void {
    visitor.onAlpha(this)
  }
}

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

// TODO: vyresit pro pripady kdy jde o multilambdu
// pak bude navic drzet mnozinu values a mnozinu arguments
// spis mnozinu tuples

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


export interface ASTVisitable {
  visit (visitor : ASTVisitor) : void,
}

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

export interface ReductionVisitor {
  onAlpha (alpha : NextAlpha) : void,
  onBeta (beta : NextBeta) : void,
  onExpansion (expansion : NextExpansion) : void,
  onNone (none : NextNone) : void,
}
