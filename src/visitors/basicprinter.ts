import { AST, Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";
import { ASTVisitor } from ".";


export class BasicPrinter extends ASTVisitor {
  private expression : string = ''

  // TODO: this looks like nonsense
  // maybe solve it with another Visitor
  private printLambdaBody (lambda : Lambda) : void {
    if (lambda.body instanceof Lambda) {
      this.printLambdaBody(lambda.body)
    }
    else {
      lambda.body.visit(this)
    }
  }

  // TODO: this looks like nonsense
  // maybe solve it with another Visitor
  private printLambdaArguments (lambda : Lambda, accumulator : string) : void {
    if (lambda.body instanceof Lambda) {
      this.printLambdaArguments(lambda.body, `${ accumulator } ${ lambda.body.argument.name() }`)
    }
    else {
      this.expression += accumulator
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

  // TODO: this is ugly as hell
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
  
  // TODO: this is ugly as hell
  onLambda(lambda: Lambda): void {
    if (lambda.body instanceof Lambda) {
      this.expression += `(λ `
      this.printLambdaArguments(lambda, lambda.argument.name())
      this.expression += ` . `
      this.printLambdaBody(lambda)
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
  
  onChurchNumber(churchNumber: ChurchNumber): void {
    this.expression += churchNumber.name()
  }
  
  onMacro(macro: Macro): void {
    this.expression += macro.name()
  }
  
  onVariable(variable: Variable): void {
    this.expression += variable.name()
  }
}