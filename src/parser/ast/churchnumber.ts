import Lexer, { Token, CodeStyle } from '../../lexer'
import { AST, parse, Expandable } from '..'
import { ASTVisitor } from '../../visitors';

export class ChurchNumber implements AST, Expandable {
  public readonly identifier : symbol = Symbol()

  name () : string {
    return `${ this.token.value }`
  }

  constructor (
    public readonly token : Token,
  ) {}
  
  clone () : ChurchNumber {
    return new ChurchNumber(this.token)
  }

  visit (visitor : ASTVisitor) : void {
    visitor.onChurchNumber(this)
  }

  expand () : AST {
    const codeStyle : CodeStyle = { singleLetterVars : true, lambdaLetters : [ 'λ' ] }
    const value : number = <number> this.token.value
    const churchLiteral : string = `(λ s z .${' (s'.repeat(value)} z)${')'.repeat(value)}`

    return parse(Lexer.tokenize(churchLiteral, codeStyle))
  }
  
  // alphaConvert (oldName : string, newName : string) : AST {
  //   return this
  // }
  
  // betaReduce (argName : string, value : AST) : AST {
  //   return this
  // }
  
  // etaConvert () : AST {
  //   throw new Error("Method not implemented.");
  // }

  freeVarName (bound : Array<string>) : string | null {
    return null
  }
}