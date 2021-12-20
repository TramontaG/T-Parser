import { ParserMaker, ParserState } from "./models";
import {
    updateParserError,
    updateParserState,
    updateSupressedParserError,
} from "./ParserUtils";

export const str: ParserMaker =
    (target: string, identifier?: string) =>
    (parserState: ParserState, supressErrors?: boolean) => {
        if (parserState.isError) return parserState;

        const { index } = parserState;
        const supplied = parserState.stringToBeParsed;
        const slicedTarget = supplied.slice(index);

        if (slicedTarget.length === 0)
            return updateParserError(
                parserState,
                `Tried to parse \"${target}\" but got unexpected end of input`
            );

        if (slicedTarget.startsWith(target))
            return updateParserState(parserState, {
                ...parserState,
                index: parserState.index + target.length,
                result: target,
            });

        if (supressErrors)
            return updateSupressedParserError(
                parserState,
                `Tried do parse ${
                    identifier || target
                } but got ${supplied.slice(
                    parserState.index,
                    parserState.index + 10
                )} instead`
            );

        return updateParserError(
            parserState,
            `Tried do parse \"${
                identifier || target
            }\" but got \"${supplied.slice(
                parserState.index,
                parserState.index + 10
            )}${
                parserState.stringToBeParsed.length > parserState.index + 10
                    ? "..."
                    : ""
            }\" instead`
        );
    };

export const regexMatch: ParserMaker =
    (regex: RegExp, identifier?: string) =>
    (parserState: ParserState, supressErrors?: boolean) => {
        if (parserState.isError) return parserState;
        const supplied = parserState.stringToBeParsed;
        const slicedTarget = supplied.slice(parserState.index);

        if (slicedTarget.length === 0)
            return updateParserError(
                parserState,
                `Treid to match regex ${regex} but got unexpected end of input`
            );

        const matchedSting = slicedTarget.match(regex);

        if (matchedSting) {
            return updateParserState(parserState, {
                ...parserState,
                index: parserState.index + matchedSting[0].length,
                result: matchedSting[0],
            });
        }

        if (supressErrors)
            return updateSupressedParserError(
                parserState,
                `Tried to match ${identifier || `Regex ${regex}`} but got ${
                    supplied.split(" ")[0]
                } instead`
            );

        return updateParserError(
            parserState,
            `Tried to match ${identifier || `Regex ${regex}`} but got ${
                supplied.split(" ")[0]
            } instead`
        );
    };

export const letters = regexMatch(/^[A-Za-z]+/, "letters");
export const digits = regexMatch(/^[0-9]+/, "digits");
export const lettersOrDigits = regexMatch(/^[A-Za-z0-9]+/, "letters or digits");
export const whiteSpace = str(" ", "whitespace");
