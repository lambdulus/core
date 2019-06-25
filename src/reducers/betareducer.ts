import { AST, Binary, Child, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast";
import { ASTVisitor } from "../visitors";
import { Beta } from "../reductions";


export class BetaReducer extends ASTVisitor {
  private substituted : AST | null = null

  private parent : Binary | null
  private treeSide : Child | null
  private target : AST
  private readonly argName : string
  private readonly value : AST
  
  constructor (
    { parent, treeSide, target, argName, value } : Beta,
    public tree : AST,
  ) {
    super()
    this.parent = parent
    this.treeSide = treeSide
    this.target = target
    this.argName = argName
    this.value = value
    this.tree = tree
  }

  onApplication (application : Application) : void {
    application.left.visit(this)
    
    const left : AST = <AST> this.substituted
    
    application.right.visit(this)

    const right : AST = <AST> this.substituted

    this.substituted = new Application(left, right, application.identifier)
  }

  onLambda (lambda : Lambda) : void {
    if (lambda.argument.name() === this.argName) {
      this.substituted = lambda
    }
    else {
      lambda.body.visit(this)
      
      const body : AST = <AST> this.substituted

      lambda.body = body
      
      this.substituted = lambda
      // TODO: clone or not clone ? i'd say CLONE but consider not clonning
      // this.substituted = new Lambda(lambda.argument.clone(), body, lambda.identifier)
    }
  }

  onChurchNumeral (churchNumeral : ChurchNumeral) : void {
    this.substituted = churchNumeral
  }

  onMacro (macro : Macro) : void {
    this.substituted = macro
  }

  onVariable (variable : Variable) : void {
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