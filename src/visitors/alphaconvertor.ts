import { ASTVisitor, NextAlpha, Child, SingleAlpha } from ".";
import { Application } from "../parser/ast/application";
import { Lambda } from "../parser/ast/lambda";
import { ChurchNumber } from "../parser/ast/churchnumber";
import { Macro } from "../parser/ast/macro";
import { Variable } from "../parser/ast/variable";
import { AST } from "../parser";
import { Token } from "../lexer";

export class AlphaConvertor implements ASTVisitor {
  public readonly conversions : Array<SingleAlpha>
  // public readonly tree : Application
  // private readonly child : Child // not really needed
  // private readonly toRename : AlphaMap
  // private readonly oldName : string
  // private readonly newName : string

  // Need to do this Nonsense Dance
  private converted : AST | null = null

  private oldName : string = ''
  private newName : string = ''
  
  // TODO: refactor
  constructor ({ conversions } : NextAlpha) {
    this.conversions = conversions
    // this.tree = tree
    // this.child = child
    // this.toRename = toRename
    // this.oldName = oldName
    // this.newName = newName

    for (const { tree, oldName, newName } of this.conversions) {
      this.oldName = oldName
      this.newName = newName



      tree.argument.visit(this)
      tree.argument = <Variable> this.converted

      tree.body.visit(this)
      tree.body = <AST> this.converted
    }

    // tree[<Child> child].visit(this)
    // tree[<Child> child] = <AST> this.converted // part of the Nonse Dance
  }

  onApplication(application : Application) : void {
    application.left.visit(this)

    const left : AST = <AST> this.converted

    application.right.visit(this)

    const right : AST = <AST> this.converted

    this.converted = new Application(left, right)
  }

  onLambda(lambda : Lambda) : void {
    // let shadowed : SingleAlpha | null = null

    // if (this.toRename.has(lambda.argument.name())) {
      // shadowed = <SingleAlpha> this.toRename.get(lambda.argument.name())
      // this.toRename.delete(lambda.argument.name())
    // }

    // lambda.argument.visit(this)

    // const left : Variable = <Variable> this.converted

    if (lambda.argument.name() !== this.oldName) {
      lambda.body.visit(this)
      const right : AST = <AST> this.converted
      lambda.body = right
      this.converted = lambda
    }
    else {
      this.converted = lambda
    }



    // if (shadowed !== null) {
    //   this.toRename.set(lambda.argument.name(), shadowed)
    // }

    // lambda.argument = left

  }

  onChurchNumber(churchNumber : ChurchNumber) : void {
    this.converted = churchNumber
  }

  onMacro(macro : Macro) : void {
    this.converted = macro
  }

  onVariable(variable : Variable) : void {
    // if (this.toRename.has(variable.name())) {
    //   const { newName } : SingleAlpha = <SingleAlpha> this.toRename.get(variable.name())
    if (variable.name() === this.oldName) {
      const token : Token = new Token(variable.token.type, this.newName, variable.token.position)
    
      this.converted = new Variable(token)
    }
    else {
      this.converted = variable
    }
  }
}