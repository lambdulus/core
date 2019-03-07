import { ASTVisitor, NextAlpha, Child } from ".";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
import { AST } from "../parser";
import { Token } from "../lexer";

export class AlphaConvertor implements ASTVisitor {
  public readonly tree : AST
  private readonly child : Child // not really needed
  private readonly oldName : string
  private readonly newName : string

  // Need to do this Nonsense Dance
  private converted : AST | null = null
  
  constructor ({ tree, child, oldName, newName } : NextAlpha) {
    this.tree = tree
    this.child = child
    this.oldName = oldName
    this.newName = newName

    tree[<Child> child].visit(this)
    tree[<Child> child] = <AST> this.converted // part of the Nonse Dance
  }

  onApplication(application : Application) : void {
    application.left.visit(this)

    const left : AST = <AST> this.converted

    application.right.visit(this)

    const right : AST = <AST> this.converted

    this.converted = new Application(left, right)
  }

  onLambda(lambda : Lambda) : void {
    lambda.argument.visit(this)

    const left : Variable = <Variable> this.converted

    lambda.body.visit(this)

    const right : AST = <AST> this.converted

    lambda.argument = left
    lambda.body = right

    this.converted = lambda
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