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
export const string: ParserMaker;
export const regexMatch: ParserMaker;
export const letters: Parser;
export const digits: Parser;
export const lettersOrDigits: Parser;
export const whiteSpace: Parser;

//Modifiers
export const maybeSome: ParserModifier;
export const atLeastOne: ParserModifier;
export const maybe: ParserModifier;
export const repeat: ParserModifierFactory;
export const fullString: ParserModifier;

//Combinators
export const sequenceOf: ParserCombinator;
export const choice: ParserCombinator;

//utilities
export function transform(
    parser: Parser,
    transformerFn: (parserState: ParserState) => ParserState
): ParserState;

export function parse(
    targetString: string,
    parser: Parser,
    identifier?: string
): ParserState;

export function flatArgs(args: any[]): string;
