import { AST, Binary } from "../ast";
import { Application } from "../ast/application";
import { Lambda } from "../ast/lambda";
import { Macro } from "../ast/macro";
import { ChurchNumber } from "../ast/churchnumber";
import { Variable } from "../ast/variable";
import { Reductions, Child, ASTVisitor } from "../visitors";

export class BetaReducer extends ASTVisitor {
  private readonly argName : string
  private readonly value : AST

  private substituted : AST | null = null
  public tree : AST
  private parent : Binary | null
  private treeSide : Child | null
  private target : AST

  constructor (
    { parent, treeSide, target, argName, value } : Reductions.Beta,
    tree : AST,
  ) {
    super()
    this.parent = parent
    this.treeSide = treeSide
    this.target = target
    this.argName = argName
    this.value = value
    this.tree = tree
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

  perform () : void {
    this.target.visit(this)

    if (this.parent === null) {
      this.tree = <AST> this.substituted
    }
    else {
      this.parent[<Child> this.treeSide] = <AST> this.substituted
    }
  }
}