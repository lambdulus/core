import { ASTVisitor, NextExpansion, Child } from ".";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
import { Binary, AST } from "../parser";
import { CodeStyle } from "../lexer";
import { parse } from "../parser";
import { Lexer } from "..";

export class Expandor implements ASTVisitor {
  private readonly parent : Binary | null
  private readonly treeSide : Child | null
  private readonly target : AST

  private expanded : AST | null = null
  public tree : AST

  constructor (
    { parent, treeSide, target } : NextExpansion,
    tree : AST
  ) {
    this.parent = parent
    this.treeSide = treeSide
    this.target = target

    target.visit(this)

    if (parent === null) {
      this.tree = <AST> this.expanded
    }
    else {
      parent[<Child> treeSide] = <AST> this.expanded
      this.tree = tree
    }
  }

  onApplication(application : Application) : void {
    // nothing
  }

  onLambda(lambda : Lambda) : void {
    // nothing
  }

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

  onVariable(variable : Variable) : void {
    // nothing
  }
}