import { str } from "./AtomicParsers";
import {
    Parser,
    ParserCombinator,
    ParserModifier,
    ParserState,
} from "./models";
import { transform } from "./Modifiers";
import { updateParserError, updateParserState } from "./ParserUtils";

export const fullString: ParserModifier =
    (parser: Parser, identifier?: string) => (parserState: ParserState) => {
        if (parserState.isError) return parserState;
        const nextParserState = parser(parserState);

        if (nextParserState.isError) return nextParserState;

        if (nextParserState.index < nextParserState.stringToBeParsed.length)
            return updateParserError(
                nextParserState,
                `There is still unmatched contents`
            );

        return updateParserState(nextParserState, {
            ...nextParserState,
            index: nextParserState.index,
            result: nextParserState.result,
        });
    };

export const sequenceOf: ParserCombinator =
    (parsers: Parser[], identifier?: string) => (parserState: ParserState) => {
        if (parserState.isError) return parserState;
        let results: any[] = [];
        let oldState = parserState;

        for (let parser of parsers) {
            const newState = parser(oldState);
            if (newState.isError)
                return updateParserError(
                    newState,
                    `Error while trying to parse ${
                        identifier || "unindentified data structure"
                    }`
                );
            results.push(newState.result);
            oldState = newState;
        }

        return updateParserState(oldState, {
            ...oldState,
            result: results,
        });
    };

export const choice: ParserCombinator =
    (parsers: Parser[], identifier?: string) => (parserState: ParserState) => {
        if (parserState.isError) return parserState;

        let nextState = parserState;
        let result;

        for (let parser of parsers) {
            const tempState = parser(nextState, true);
            if (!tempState.isError) {
                result = tempState.result;
                nextState = tempState;
                break;
            }
        }

        if (!result)
            return updateParserError(
                nextState,
                `No valid ${identifier || "unidentified structure"} was found`
            );

        return updateParserState(nextState, {
            ...nextState,
            result: result,
        });
    };

export const times =
    (amount: number) =>
    (parser: Parser, identifier?: string) =>
    (parserState: ParserState) => {
        if (parserState.isError) return parserState;
        const result = [];
        let currentParserState = parserState;

        for (let i = 0; i < amount; i++) {
            const tempParserState = parser(currentParserState);
            if (tempParserState.isError)
                return updateParserError(
                    tempParserState,
                    `Tried to parse ${amount} ${
                        identifier ?? "unindentified structure"
                    } but got ${i || "none"}`
                );
            result.push(tempParserState.result);
            currentParserState = tempParserState;
        }

        return updateParserState(currentParserState, {
            ...currentParserState,
            result,
        });
    };

export const between =
    (left: Parser, right: Parser) =>
    (parser: Parser, identifier?: string) =>
    (parserState: ParserState) => {
        if (parserState.isError) return parserState;

        const leftParserState = left(parserState);
        if (leftParserState.isError)
            return updateParserError(
                { ...leftParserState, result: parserState.result },

                `error while tried to parse left hand part of ${
                    identifier || "unindentified structure"
                }`
            );

        const middleParserState = parser(leftParserState);
        if (middleParserState.isError)
            return updateParserError(
                { ...middleParserState, result: parserState.result },
                `error while tried to parse middle part of ${
                    identifier || "unindentified structure"
                }`
            );

        const rightParserState = right(middleParserState);
        if (rightParserState.isError)
            return updateParserError(
                { ...rightParserState, result: parserState.result },
                `error while tried to parse right hand part of ${
                    identifier || "unindentified structure"
                }`
            );

        return updateParserState(rightParserState, {
            ...rightParserState,
            result: middleParserState.result,
        });
    };

export const betweenStrings =
    (left: string, right: string) => (parser: Parser, identifier?: string) =>
        transform(
            sequenceOf([str(left), parser, str(right)], identifier),
            ({ result }) => result[1]
        );

export const parse = (string: string, parser: Parser, identifier?: string) => {
    const parserState = {
        index: 0,
        result: null,
        isError: false,
        error: "",
        stringToBeParsed: string,
        errorStack: [],
        stringLeft: "",
    };

    const fullParser = fullString(parser, identifier);

    return fullParser(parserState);
};
