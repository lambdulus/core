export { tokenize } from './lexer';
export { Token, TokenType } from './token';
export { InvalidIdentifier, InvalidNumber, InvalidOperator } from './errors';
export declare type CodeStyle = {
    singleLetterVars: boolean;
    lambdaLetters: Array<string>;
};
