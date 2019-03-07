import { ASTVisitor, NextBeta, Child } from ".";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
import { Binary, AST } from "../parser";

export class BetaReducer implements ASTVisitor {
  private readonly parent : Binary | null
  private readonly treeSide : Child | null
  private readonly target : AST
  private readonly argName : string
  private readonly value : AST

  private substituted : AST | null = null
  public tree : AST

  constructor (
    { parent, treeSide, target, argName, value } : NextBeta,
    tree : AST,
  ) {
    this.parent = parent
    this.treeSide = treeSide
    this.target = target
    this.argName = argName
    this.value = value

    target.visit(this)

    if (parent === null) {
      this.tree = <AST> this.substituted
    }
    else {
      parent[<Child> treeSide] = <AST> this.substituted
      this.tree = tree
    }
  }

  onApplication(application : Application) : void {
    application.left.visit(this)
    
    const left : AST = <AST> this.substituted
    
    application.right.visit(this)

    const right : AST = <AST> this.substituted

    this.substituted = new Application(left, right)
  }

  onLambda(lambda : Lambda) : void {
    if (lambda.argument.name() === this.argName) {
      this.substituted = lambda
    }
    else {
      lambda.body.visit(this)
      
      const body : AST = <AST> this.substituted
      
      // TODO: clone or not clone ? i'd say CLONE but consider not clonning
      this.substituted = new Lambda(lambda.argument.clone(), body)
    }
  }

  onChurchNumber(churchNumber : ChurchNumber) : void {
    this.substituted = churchNumber
  }

  onMacro(macro : Macro) : void {
    this.substituted = macro
  }

  onVariable(variable : Variable) : void {
    if (variable.name() === this.argName) {
      this.substituted = this.value.clone()
    }
    else {
      this.substituted = variable
    }
  }
}