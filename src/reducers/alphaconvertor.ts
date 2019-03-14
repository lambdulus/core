import { Token } from "../lexer";
import { AST, Application, Lambda, ChurchNumber, Macro, Variable } from "../ast";
import { ASTVisitor } from "../visitors";
import { Alpha } from "../reductions";

export class AlphaConvertor extends ASTVisitor {
  public readonly conversions : Set<Lambda>

  // Need to do this Nonsense Dance
  private converted : AST | null = null

  private oldName : string = ''
  private newName : string = ''
  
  constructor (
    { conversions } : Alpha,
    public tree : AST
  ) {
    super()
    this.conversions = conversions
  }

  onApplication(application : Application) : void {
    application.left.visit(this)

    const left : AST = <AST> this.converted

    application.right.visit(this)

    const right : AST = <AST> this.converted

    this.converted = new Application(left, right)
  }

  onLambda(lambda : Lambda) : void {
    if (lambda.argument.name() !== this.oldName) {
      lambda.body.visit(this)
      
      const right : AST = <AST> this.converted
      
      lambda.body = right
      this.converted = lambda
    }
    else {
      this.converted = lambda
    }
  }

  onChurchNumber(churchNumber : ChurchNumber) : void {
    this.converted = churchNumber
  }

  onMacro(macro : Macro) : void {
    this.converted = macro
  }

  onVariable(variable : Variable) : void {
    if (variable.name() === this.oldName) {
      const token : Token = new Token(variable.token.type, this.newName, variable.token.position)
    
      this.converted = new Variable(token)
    }
    else {
      this.converted = variable
    }
  }

  perform () : void {
    for (const lambda of this.conversions) {
      this.oldName = lambda.argument.name()
      this.newName = `_${this.oldName}` // TODO: create original name

      lambda.argument.visit(this)
      lambda.argument = <Variable> this.converted

      lambda.body.visit(this)
      lambda.body = <AST> this.converted
    }
  }
}