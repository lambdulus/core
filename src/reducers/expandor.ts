import { CodeStyle } from "../lexer";
import { Lexer } from "..";
import { AST, Binary } from "../ast";
import { Reductions, Child, ASTVisitor } from "../visitors";
import { ChurchNumber } from "../ast/churchnumber";
import { parse } from "../parser";
import { Macro } from "../ast/macro";
// import { Reducer } from "./emptyreducer";

export class Expandor extends ASTVisitor {
  private expanded : AST | null = null
  public tree : AST

  private parent : Binary | null
  private treeSide : Child | null
  private target : AST

  constructor (
    { parent, treeSide, target } : Reductions.Expansion,
    tree : AST
  ) {
    super()
    this.parent = parent
    this.treeSide = treeSide
    this.target = target
    this.tree = tree
    // target.visit(this)

    // if (parent === null) {
    //   this.tree = <AST> this.expanded
    // }
    // else {
    //   parent[<Child> treeSide] = <AST> this.expanded
    //   this.tree = tree
    // }
  }

  // onApplication(application : Application) : void {
  //   // nothing
  // }

  // onLambda(lambda : Lambda) : void {
  //   // nothing
  // }

  onChurchNumber(churchNumber : ChurchNumber) : void {
    const codeStyle : CodeStyle = { singleLetterVars : true, lambdaLetters : [ 'λ' ] }
    const value : number = <number> churchNumber.token.value
    const churchLiteral : string = `(λ s z .${' (s'.repeat(value)} z)${')'.repeat(value)}`

    this.expanded = parse(Lexer.tokenize(churchLiteral, codeStyle))
  }

  onMacro(macro : Macro) : void {
    // TODO: here I lose token - useful for location and origin of macro - should solve this
    // also consider not clonning
    this.expanded = macro.definition.ast.clone()
  }

  // onVariable(variable : Variable) : void {
  //   // nothing
  // }

  perform () : void {
    this.target.visit(this)

    if (this.parent === null) {
      this.tree = <AST> this.expanded
    }
    else {
      this.parent[<Child> this.treeSide] = <AST> this.expanded
    }
  }
}