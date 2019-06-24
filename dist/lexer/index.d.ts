export { tokenize } from './lexer';
export { Token, TokenType } from './token';
export { InvalidIdentifier, InvalidNumber, InvalidOperator, InvalidCharacter, hintOperator, } from './errors';
export { BLANK_POSITION } from './postion';
export declare type CodeStyle = {
    singleLetterVars: boolean;
    lambdaLetters: Array<string>;
};
