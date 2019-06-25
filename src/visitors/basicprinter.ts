import { AST, Application, Lambda, ChurchNumeral, Macro, Variable } from "../ast";
import { ASTVisitor } from ".";


export class BasicPrinter extends ASTVisitor {
  private expression : string = ''

  private printMultilambda (lambda : Lambda, accumulator : string) : void {
    if (lambda.body instanceof Lambda) {
      this.printMultilambda(lambda.body, `${ accumulator } ${ lambda.body.argument.name() }`)
    }
    else {
      this.expression += accumulator + ` . `
      lambda.body.visit(this)
    }
  }

  constructor (
    public readonly tree : AST,
  ) {
    super()
    this.tree.visit(this)
  }

  print () : string {
    return this.expression
  }

  // TODO: try to refactor this
  onApplication(application: Application): void {
    if (application.right instanceof Application) {
      application.left.visit(this)
      this.expression += ` (`
      application.right.visit(this)
      this.expression += `)`
    }
    else {
      application.left.visit(this)
      this.expression += ` `
      application.right.visit(this)
    }
  }

  // TODO: try to refactor this
  onLambda(lambda: Lambda): void {
    if (lambda.body instanceof Lambda) {
      this.expression += `(λ `
      this.printMultilambda(lambda, lambda.argument.name())
      this.expression += `)`
    }
    else {
      this.expression += `(λ `
      lambda.argument.visit(this)
      this.expression += ` . `
      lambda.body.visit(this)
      this.expression += `)`
    }
  }
  
  onChurchNumeral (churchNumeral: ChurchNumeral): void {
    this.expression += churchNumeral.name()
  }
  
  onMacro (macro: Macro): void {
    this.expression += macro.name()
  }
  
  onVariable (variable: Variable): void {
    this.expression += variable.name()
  }
}