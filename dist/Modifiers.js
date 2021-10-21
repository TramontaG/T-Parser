"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = exports.repeat = exports.maybe = exports.atLeastOne = exports.maybeSome = void 0;
const ParserUtils_1 = require("./ParserUtils");
const maybeSome = (parser, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
    let oldState = parserState;
    let results = [];
    while (true) {
        const newState = parser(oldState);
        if (newState.isError)
            break;
        results.push(newState.result);
        oldState = newState;
    }
    return (0, ParserUtils_1.updateParserState)(oldState, Object.assign(Object.assign({}, oldState), { result: results }));
};
exports.maybeSome = maybeSome;
const atLeastOne = (parser, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
    let oldState = parserState;
    let results = [];
    while (true) {
        const newState = parser(oldState);
        if (newState.isError)
            break;
        results.push(newState.result);
        oldState = newState;
    }
    if (results.length === 0)
        return (0, ParserUtils_1.updateParserError)(parserState, `tried to capture at least one ${identifier || "unidentified structure"} but got none`);
    return (0, ParserUtils_1.updateParserState)(oldState, Object.assign(Object.assign({}, oldState), { result: results }));
};
exports.atLeastOne = atLeastOne;
const maybe = (parser, identifier) => (parserState) => {
    const tempState = parser(parserState);
    if (tempState.isError)
        return (0, ParserUtils_1.updateParserState)(parserState, Object.assign(Object.assign({}, parserState), { result: null }));
    return (0, ParserUtils_1.updateParserState)(tempState, Object.assign(Object.assign({}, tempState), { index: tempState.index, result: tempState.result }));
};
exports.maybe = maybe;
const repeat = (amount) => (parser, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
    let nextState = parserState;
    let results = [];
    for (let i = 0; i < amount; i++) {
        const tempState = parser(nextState);
        if (tempState.isError)
            return (0, ParserUtils_1.updateParserError)(tempState, `Tried to capture ${amount} ${identifier || "unidentified structure"} but found ${i}`);
        results.push(tempState.result);
        nextState = tempState;
    }
    return (0, ParserUtils_1.updateParserState)(nextState, Object.assign(Object.assign({}, nextState), { result: results }));
};
exports.repeat = repeat;
const transform = (parser, transformerFn) => (parserState) => {
    if (parserState.isError)
        return parserState;
    const newParserState = parser(parserState);
    if (newParserState.isError)
        return newParserState;
    return (0, ParserUtils_1.updateParserState)(newParserState, Object.assign(Object.assign({}, newParserState), { result: transformerFn(newParserState) }));
};
exports.transform = transform;
