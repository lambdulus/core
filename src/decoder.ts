import { AST, Application, Lambda, ChurchNumeral, Macro, Variable } from "./ast"
import { Token, TokenType } from "./lexer"


export function decodeFast (tree : any) : AST | null {
  switch (tree.type) {
    case 'application': {
      const left : any = tree.left
      const right : any = tree.right

      const leftNode : AST | null = decodeFast(left)
      const rightNode : AST | null = decodeFast(right)

      if (leftNode !== null && rightNode !== null) {
        return new Application(leftNode, rightNode)      
      }
      return null
    }

    case 'lambda': {
      const argument : any = tree.argument
      const body : any = tree.body

      const leftNode : Variable | null = decodeFast(argument) as Variable
      const rightNode : AST | null = decodeFast(body)

      if (argument.type === 'variable' && leftNode !== null && rightNode !== null) {
        return new Lambda(leftNode, rightNode)      
      }
      return null
    }

    case 'churchnumeral': {
      if ('token' in tree) {
        return new ChurchNumeral(tree.token)
      }
      return null
    }

    case 'macro': {
      if ('token' in tree && 'macroTable' in tree) {
        return new Macro(tree.token, tree.macroTable)
      }
      return null
    }

    case 'variable': {
      if ('token' in tree) {
        return new Variable(tree.token)
      }
      return null
    }

    default:
      return null
  }
}


export function decodeSafe (tree : any) : AST | null {
  if (! 
    (typeof tree === 'object'
    &&
    'type' in tree
    &&
    typeof tree.type === 'string'
    )) {
    return null
  }

  switch (tree.type) {
    case 'application': {
      if (! ('left' in tree && 'right' in tree)) {
        return null
      }

      const left : any = tree.left
      const right : any = tree.right

      const leftNode : AST | null = decodeSafe(left)
      const rightNode : AST | null = decodeSafe(right)

      if (leftNode !== null && rightNode !== null) {
        return new Application(leftNode, rightNode)      
      }
      return null
    }

    case 'lambda': {
      if (! ('argument' in tree && 'body' in tree)) {
        return null
      }

      const argument : any = tree.argument
      const body : any = tree.body

      const leftNode : AST | null = decodeSafe(argument) as Variable
      const rightNode : AST | null = decodeSafe(body)

      if (leftNode !== null && rightNode !== null && leftNode instanceof Variable) {
        return new Lambda(leftNode, rightNode)      
      }
      return null
    }

    case 'churchnumeral': {
      if ('token' in tree) {
        const token : Token | null = decodeToken(tree.token)

        if (token === null) return null

        return new ChurchNumeral(token)
      }
      return null
    }

    case 'macro': {
      if ('token' in tree && 'macroTable' in tree) {
        const token : Token | null = decodeToken(tree.token)

        if (token === null || isValidMacroTable(tree.macroTable)) return null

        return new Macro(token, tree.macroTable)
      }
      return null
    }

    case 'variable': {
      if ('token' in tree) {
        const token : Token | null = decodeToken(tree.token)
        
        if (token === null) return null

        return new Variable(token)
      }
      return null
    }

    default:
      return null
  }
}

function decodeToken (maybeToken : any) : Token | null {
  if (typeof maybeToken === 'object'
      &&
      'type' in maybeToken
      &&
      'value' in maybeToken
      &&
      'position' in maybeToken
      &&
      isValidTokenType(maybeToken.type)
      &&
      (typeof maybeToken.value === 'string' || typeof maybeToken.value === 'number')
      &&
      isValidPosition(maybeToken.position)
  ) {
    return new Token(maybeToken.type, maybeToken.value, maybeToken.position)
  }
  return null
}

function isValidTokenType (maybeType : any) : boolean {
  return (
    typeof maybeType === 'string'
    &&
    Object.values(TokenType).some((val : TokenType) => maybeType === val)
  )
}

function isValidPosition (maybePosition : any) : boolean {
  return (
    typeof maybePosition === 'object'
    &&
    'column' in maybePosition
    &&
    typeof maybePosition.column === 'number'
    &&
    'row' in maybePosition
    &&
    typeof maybePosition.row === 'number'
    &&
    'position' in maybePosition
    &&
    typeof maybePosition.position === 'number'
  )
}

function isValidMacroTable (maybeMacroTable : any) : boolean {
  if (typeof maybeMacroTable !== 'object') {
    return false
  }

  return Object.entries(maybeMacroTable).every(([key, value] : [string, any]) => typeof value === 'string')
}