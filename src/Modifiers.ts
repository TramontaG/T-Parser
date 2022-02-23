import { str } from "./AtomicParsers";
import { sequenceOf } from "./Combinators";
import {
    Parser,
    ParserModifier,
    ParserModifierFactory,
    ParserState,
} from "./models";
import { updateParserError, updateParserState } from "./ParserUtils";

export const maybeSome: ParserModifier =
    (parser: Parser, identifier?: string) => (parserState: ParserState) => {
        if (parserState.isError) return parserState;
        let oldState = parserState;
        let results = [];

        while (true) {
            const newState = parser(oldState);
            if (newState.isError) break;
            results.push(newState.result);
            oldState = newState;
        }

        return updateParserState(oldState, {
            ...oldState,
            result: results,
        });
    };

export const atLeastOne: ParserModifier =
    (parser: Parser, identifier?: string) => (parserState: ParserState) => {
        if (parserState.isError) return parserState;
        let oldState = parserState;
        let results = [];

        while (true) {
            const newState = parser(oldState);
            if (newState.isError) break;
            results.push(newState.result);
            oldState = newState;
        }

        if (results.length === 0)
            return updateParserError(
                parserState,
                `tried to capture at least one ${
                    identifier || "unidentified structure"
                } but got none`
            );

        return updateParserState(oldState, {
            ...oldState,
            result: results,
        });
    };

export const maybe: ParserModifier =
    (parser: Parser, identifier?: string) => (parserState: ParserState) => {
        const tempState = parser(parserState);

        if (tempState.isError)
            return updateParserState(parserState, {
                ...parserState,
                result: null,
            });

        return updateParserState(tempState, {
            ...tempState,
            index: tempState.index,
            result: tempState.result,
        });
    };

export const repeat: ParserModifierFactory =
    (amount: number) =>
    (parser: Parser, identifier?: string) =>
    (parserState: ParserState) => {
        if (parserState.isError) return parserState;
        let nextState = parserState;
        let results = [];

        for (let i = 0; i < amount; i++) {
            const tempState = parser(nextState);
            if (tempState.isError)
                return updateParserError(
                    tempState,
                    `Tried to capture ${amount} ${
                        identifier || "unidentified structure"
                    } but found ${i}`
                );

            results.push(tempState.result);
            nextState = tempState;
        }
        return updateParserState(nextState, {
            ...nextState,
            result: results,
        });
    };

export const transform =
    (parser: Parser, transformerFn: (parserState: ParserState) => any) =>
    (parserState: ParserState) => {
        if (parserState.isError) return parserState;
        const newParserState = parser(parserState);
        if (newParserState.isError) return newParserState;

        return updateParserState(newParserState, {
            ...newParserState,
            result: transformerFn(newParserState),
        });
    };

export const times: ParserModifierFactory =
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
                        identifier || "unindentified structure"
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

export const between: (left: Parser, right: Parser) => ParserModifier =
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

export const betweenStrings: (left: string, right: string) => ParserModifier =
    (left: string, right: string) => (parser: Parser, identifier?: string) =>
        transform(
            sequenceOf([str(left), parser, str(right)], identifier),
            ({ result }) => result[1]
        );

export const lazy = (parser: Parser) => parser;

export const except: ParserModifierFactory =
    (wrongParser: Parser, identifierWrong?: string): ParserModifier =>
    (correctParser: Parser, identifierCorrect?: string): Parser =>
    (parserState: ParserState) => {
        const wrongParserState = wrongParser(parserState);
        if (!wrongParserState.isError) {
            return updateParserError(
                {
                    ...wrongParserState,
                    isError: true,
                    result: parserState.result,
                },
                `Parser found unintended ${
                    identifierWrong || "unindetified"
                } structure`
            );
        }

        const correctParserState = correctParser(parserState);
        if (correctParserState.isError) {
            console.log("was not able to parse correct structure");

            return updateParserError(
                {
                    ...correctParserState,
                    result: parserState.result,
                },
                `Parser could not match ${
                    identifierCorrect ?? "unindetified"
                } structure`
            );
        }

        console.log("was able to parse correct structure");

        return updateParserState(correctParserState, {
            ...correctParserState,
            result: correctParserState.result,
        });
    };
