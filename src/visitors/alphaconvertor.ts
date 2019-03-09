import { ASTVisitor, NextAlpha, SingleAlpha } from ".";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
import { AST } from "../parser";
import { Token } from "../lexer";

export class AlphaConvertor implements ASTVisitor {
  public readonly conversions : Array<SingleAlpha>

  // Need to do this Nonsense Dance
  private converted : AST | null = null

  private oldName : string = ''
  private newName : string = ''
  
  constructor ({ conversions } : NextAlpha) {
    this.conversions = conversions

    for (const { tree, oldName, newName } of this.conversions) {
      this.oldName = oldName
      this.newName = newName



      tree.argument.visit(this)
      tree.argument = <Variable> this.converted

      tree.body.visit(this)
      tree.body = <AST> this.converted
    }
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
}