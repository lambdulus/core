import { Token, TokenType, BLANK_POSITION, tokenize } from "../lexer"
import { AST, Binary, Child, ChurchNumeral, Macro, Application, Variable, Lambda } from "../ast"
import { ASTVisitor } from "../visitors"
import { Expansion } from "../reductions"
import { parse } from "../parser";
import { Parser } from "../parser/parser"


export class Expander extends ASTVisitor {
  private expanded : AST | null = null

  private parent : Binary | null
  private treeSide : Child | null
  private target : AST

  constructor (
    { parent, treeSide, target } : Expansion,
    public tree : AST
  ) {
    super()
    this.parent = parent
    this.treeSide = treeSide
    this.target = target
  }

  onChurchNumeralBody (n : number) : AST {
    if (n === 0) {
      return new Variable(new Token(TokenType.Identifier, 'z', BLANK_POSITION))
    }

    const left : Variable = new Variable(new Token(TokenType.Identifier, 's', BLANK_POSITION))
    const right : AST = this.onChurchNumeralBody(n - 1)
    return new Application(left, right)
  }

  // TODO: creating dummy token, there should be something like NoPosition
  onChurchNumeralHeader (tree : AST) : AST {
    const s : Variable = new Variable(new Token(TokenType.Identifier, 's', BLANK_POSITION))
    const z : Variable = new Variable(new Token(TokenType.Identifier, 'z', BLANK_POSITION))
    
    const body : Lambda = new Lambda(z, tree)
    return new Lambda(s, body)
  }

  onChurchNumeral (churchNumeral : ChurchNumeral) : void {
    const value : number = <number> churchNumeral.token.value
    const churchLiteral : AST = this.onChurchNumeralHeader(this.onChurchNumeralBody(value))

    this.expanded = churchLiteral
  }

  onMacro (macro : Macro) : void {
    // TODO: @dynamic-macros

    // TODO: here I lose token - useful for location and origin of macro - should solve this
    // also consider not clonning - not good idea because of breakpoints - right?
    // this.expanded = macro.definition.ast.clone() // TODO: commented out in @dynamic-macros

    const value : string = <string> macro.token.value
    const definition : string = macro.macroTable[value]
    // TODO: I dont really like that lambdaLetters part
    // macros should be lexed and parsed in parsing time
    // not completely though - if there is macro in macro definition
    // let it be - I will just parse its definition and - oh!
    // now this IS a problem - I can not do that - it would be infinite!
    // if I am parsing macro definition of the same macro I just found in that definition
    // then I have infinite recursion right? - prolly
    // so I wont parse it - for now!

    const parser : Parser = new Parser(tokenize(definition, { lambdaLetters : [ '\\', 'λ' ], singleLetterVars : false }), macro.macroTable)

    const expression : AST = parser.parse(null)
    this.expanded = expression
  }

  perform () : void {
    this.target.visit(this)

    if (this.parent === null) {
      this.tree = <AST> this.expanded
    }
    else {
      this.parent[<Child> this.treeSide] = <AST> this.expanded
    }
  }
}