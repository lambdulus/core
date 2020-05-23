import { AST, Application, Lambda, ChurchNumeral, Macro, Variable } from "./ast"


interface Plain {
  type : string
  left? : Plain
  right? : Plain
  token? : any
  macroTable? : any
}

// TODO: in the future - decode even nested members like Token and such
export function decode (tree : Plain) : AST | null {
  switch (tree.type) {
    case 'application': {
      const left : any = tree.left
      const right : any = tree.right

      const leftNode : AST | null = decode(left)
      const rightNode : AST | null = decode(right)

      if (leftNode !== null && rightNode !== null) {
        return new Application(leftNode, rightNode)      
      }
      return null
    }

    case 'lambda': {
      const left : any = tree.left
      const right : any = tree.right

      const leftNode : Variable | null = decode(left) as Variable
      const rightNode : AST | null = decode(right)

      if (left.type === 'variable' && leftNode !== null && rightNode !== null) {
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