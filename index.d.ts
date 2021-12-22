export type ParserState = {
    index: number;
    result: any;
    isError: boolean;
    error: string;
    stringToBeParsed: string;
    errorStack: string[];
    stringLeft: string;
};

//General types
export type Parser = (
    parserState: ParserState,
    supressErrors?: boolean
) => ParserState;
export type ParserMaker = (target: any, identifier?: string) => Parser;
export type ParserCombinator = (
    parsers: Parser[],
    identifier?: string
) => Parser;
export type ParserModifier = (parser: Parser, identifier?: string) => Parser;
export type ParserModifierFactory = (target: any) => ParserModifier;

//Atomic parsers
export const str: ParserMaker;
export const regexMatch: ParserMaker;
export const digits: Parser;
export const digit: Parser;
export const lettersOrDigits: Parser;
export const whiteSpace: Parser;
export const tab: Parser;
export const letters: Parser;
export const letter: Parser;
export const upperCaseLetter: Parser;
export const lowerCaseLetter: Parser;
export const upperCaseLetters: Parser;
export const lowerCaseLetters: Parser;

//Modifiers
export const maybeSome: ParserModifier;
export const atLeastOne: ParserModifier;
export const maybe: ParserModifier;
export const repeat: ParserModifierFactory;
export const fullString: ParserModifier;
export const times: ParserModifierFactory;
export const between: (left: Parser, right: Parser) => ParserModifier;
export const betweenStrings: (left: string, right: string) => ParserModifier;

//Combinators
export const sequenceOf: ParserCombinator;
export const choice: ParserCombinator;

//ParserModifierFactories
export const repeat: ParserModifierFactory;

//Combinated
export const anySpace: Parser;
export const betweenParenthesis: ParserModifier;
export const preceededByString: ParserModifierFactory;
export const suceededByString: ParserModifierFactory;
export const preceededBy: ParserModifierFactory;
export const suceededBy: ParserModifierFactory;

//utilities
export function transform(
    parser: Parser,
    transformerFn: (parserState: ParserState) => any
): Parser;

export function parse(
    targetString: string,
    parser: Parser,
    identifier?: string
): ParserState;

export function flatArgs(parserState: ParserState): string;
