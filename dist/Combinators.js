"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.times = exports.choice = exports.sequenceOf = exports.fullString = void 0;
const ParserUtils_1 = require("./ParserUtils");
const fullString = (parser, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
    const nextParserState = parser(parserState);
    if (nextParserState.isError)
        return nextParserState;
    if (nextParserState.index < nextParserState.stringToBeParsed.length)
        return (0, ParserUtils_1.updateParserError)(nextParserState, `There is still unmatched contents`);
    return (0, ParserUtils_1.updateParserState)(nextParserState, Object.assign(Object.assign({}, nextParserState), { index: nextParserState.index, result: nextParserState.result }));
};
exports.fullString = fullString;
const sequenceOf = (parsers, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
    let results = [];
    let oldState = parserState;
    for (let parser of parsers) {
        const newState = parser(oldState);
        if (newState.isError)
            return (0, ParserUtils_1.updateParserError)(newState, `Error while trying to parse ${identifier || "unindentified data structure"}`);
        results.push(newState.result);
        oldState = newState;
    }
    return (0, ParserUtils_1.updateParserState)(oldState, Object.assign(Object.assign({}, oldState), { result: results }));
};
exports.sequenceOf = sequenceOf;
const choice = (parsers, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
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
        return (0, ParserUtils_1.updateParserError)(nextState, `No valid ${identifier || "unidentified structure"} was found`);
    return (0, ParserUtils_1.updateParserState)(nextState, Object.assign(Object.assign({}, nextState), { result: result }));
};
exports.choice = choice;
const times = (amount) => (parser, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
    const result = [];
    let currentParserState = parserState;
    for (let i = 0; i < amount; i++) {
        const tempParserState = parser(currentParserState);
        if (tempParserState.isError)
            return (0, ParserUtils_1.updateParserError)(tempParserState, `Tried to parse ${amount} ${identifier !== null && identifier !== void 0 ? identifier : "unindentified structure"} but got ${i || "none"}`);
        result.push(tempParserState.result);
        currentParserState = tempParserState;
    }
    return (0, ParserUtils_1.updateParserState)(currentParserState, Object.assign(Object.assign({}, currentParserState), { result }));
};
exports.times = times;
const parse = (string, parser, identifier) => {
    const parserState = {
        index: 0,
        result: null,
        isError: false,
        error: "",
        stringToBeParsed: string,
        errorStack: [],
        stringLeft: "",
    };
    const fullParser = (0, exports.fullString)(parser, identifier);
    return fullParser(parserState);
};
exports.parse = parse;
