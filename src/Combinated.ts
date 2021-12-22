import { ParserModifierFactory, ParserState, sequenceOf } from "..";
import { str, tab, whiteSpace } from "./AtomicParsers";
import { choice } from "./Combinators";
import { Parser, ParserCombinator, ParserModifier } from "./models";
import { betweenStrings, transform } from "./Modifiers";
import { updateParserError, updateParserState } from "./ParserUtils";

export const anySpace: Parser = choice([whiteSpace, tab], "space");
export const betweenParenthesis: ParserModifier = betweenStrings("(", ")");

export const preceededByString: ParserModifierFactory =
    (predecessor: string) => (parser: Parser) =>
        transform(
            sequenceOf([str(predecessor), parser]),
            ({ result }) => result[1]
        );

export const suceededByString: ParserModifierFactory =
    (successor: string) => (parser: Parser) =>
        transform(
            sequenceOf([parser, str(successor)]),
            ({ result }) => result[0]
        );

export const preceededBy: ParserModifierFactory =
    (predecessor: Parser) =>
    (parser: Parser, identifier?: string) =>
    (parserState: ParserState) => {
        if (parserState.isError) return parserState;

        const predecessorParserState = predecessor(parserState);
        if (predecessorParserState.isError)
            return updateParserError(
                predecessorParserState,
                `error while trying to parse predecessor of ${
                    identifier || "unidentified structure"
                }`
            );

        const resultParserState = parser(predecessorParserState);
        if (resultParserState.isError)
            return updateParserError(
                resultParserState,
                `error while trying to parse ${
                    identifier || "unindentified structure"
                }`
            );

        return updateParserState(resultParserState, {
            ...resultParserState,
            result: resultParserState.result,
        });
    };

export const suceededBy: ParserModifierFactory =
    (sucessor: Parser) =>
    (parser: Parser, identifier?: string) =>
    (parserState: ParserState) => {
        if (parserState.isError) return parserState;

        const resultParserState = parser(parserState);
        if (resultParserState.isError)
            return updateParserError(
                resultParserState,
                `error while trying to parse ${
                    identifier || "unidentified structure"
                }`
            );

        const successorParserState = sucessor(resultParserState);
        if (resultParserState.isError)
            return updateParserError(
                resultParserState,
                `error while trying to parse sucessor of ${
                    identifier || "unindentified structure"
                }`
            );

        return updateParserState(successorParserState, {
            ...successorParserState,
            result: resultParserState.result,
        });
    };
