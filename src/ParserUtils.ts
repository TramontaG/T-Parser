import { Parser, ParserState } from "./models";

export const updateParserError = (
    previousState: ParserState,
    errorMsg: string
): ParserState => {
    previousState.errorStack.unshift(errorMsg);
    const stringLeft = previousState.stringToBeParsed.slice(
        previousState.index
    );
    return {
        ...previousState,
        isError: true,
        stringLeft,
    };
};

export const updateSupressedParserError = (
    previousState: ParserState,
    errorMsg: string
): ParserState => {
    return {
        ...previousState,
        isError: true,
        stringLeft: previousState.stringToBeParsed.slice(previousState.index),
    };
};

export const updateParserState = (
    previousState: ParserState,
    newState: ParserState
) => {
    return {
        ...previousState,
        ...newState,
        errorStack: [],
    };
};

export const flatArgs = (args: any[]) => {
    return args.reduce((acc, obj) => {
        const key = Object.keys(obj)[0];
        const value = obj[key];
        return { ...acc, [key]: value };
    }, {});
};
