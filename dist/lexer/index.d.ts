import { MacroMap } from '../parser';
export { tokenize } from './lexer';
export { Token, TokenType } from './token';
export { InvalidIdentifier, InvalidNumber, InvalidOperator, InvalidCharacter, hintOperator, } from './errors';
export { BLANK_POSITION } from './position';
export declare type CodeStyle = {
    singleLetterVars: boolean;
    lambdaLetters: Array<string>;
    macromap: MacroMap;
};
