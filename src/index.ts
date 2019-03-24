export { Token, TokenType, CodeStyle, tokenize } from './lexer'
export { MacroDef, MacroTable, parse, builtinMacros, MacroMap } from './parser'
export { AST, Application, Lambda, ChurchNumber, Macro, Variable } from './ast'
export { ASTReduction, Alpha, Beta, Expansion, None } from './reductions'
export { AlphaConvertor, BetaReducer, Expandor, EmptyReducer, constructFor } from './reducers'

// TODO: tohle pujde do svejch ruznejch souboru
export { ASTVisitor } from './visitors'
export { BasicPrinter } from './visitors/basicprinter'
export { BoundingFinder } from './visitors/boundingfinder'
export { FreeVarsFinder } from './visitors/freevarsfinder'
export { NormalEvaluator, Reducer } from './visitors/normalevaluator'

export { VarBindFinder } from './visitors/varbindfinder' // TODO: tohle asi neni potreba