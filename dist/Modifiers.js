"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.except = exports.lazy = exports.betweenStrings = exports.between = exports.times = exports.transform = exports.repeat = exports.maybe = exports.atLeastOne = exports.maybeSome = void 0;
const AtomicParsers_1 = require("./AtomicParsers");
const Combinators_1 = require("./Combinators");
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
const times = (amount) => (parser, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
    const result = [];
    let currentParserState = parserState;
    for (let i = 0; i < amount; i++) {
        const tempParserState = parser(currentParserState);
        if (tempParserState.isError)
            return (0, ParserUtils_1.updateParserError)(tempParserState, `Tried to parse ${amount} ${identifier || "unindentified structure"} but got ${i || "none"}`);
        result.push(tempParserState.result);
        currentParserState = tempParserState;
    }
    return (0, ParserUtils_1.updateParserState)(currentParserState, Object.assign(Object.assign({}, currentParserState), { result }));
};
exports.times = times;
const between = (left, right) => (parser, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
    const leftParserState = left(parserState);
    if (leftParserState.isError)
        return (0, ParserUtils_1.updateParserError)(Object.assign(Object.assign({}, leftParserState), { result: parserState.result }), `error while tried to parse left hand part of ${identifier || "unindentified structure"}`);
    const middleParserState = parser(leftParserState);
    if (middleParserState.isError)
        return (0, ParserUtils_1.updateParserError)(Object.assign(Object.assign({}, middleParserState), { result: parserState.result }), `error while tried to parse middle part of ${identifier || "unindentified structure"}`);
    const rightParserState = right(middleParserState);
    if (rightParserState.isError)
        return (0, ParserUtils_1.updateParserError)(Object.assign(Object.assign({}, rightParserState), { result: parserState.result }), `error while tried to parse right hand part of ${identifier || "unindentified structure"}`);
    return (0, ParserUtils_1.updateParserState)(rightParserState, Object.assign(Object.assign({}, rightParserState), { result: middleParserState.result }));
};
exports.between = between;
const betweenStrings = (left, right) => (parser, identifier) => (0, exports.transform)((0, Combinators_1.sequenceOf)([(0, AtomicParsers_1.str)(left), parser, (0, AtomicParsers_1.str)(right)], identifier), ({ result }) => result[1]);
exports.betweenStrings = betweenStrings;
const lazy = (parser) => parser;
exports.lazy = lazy;
const except = (wrongParser, identifierWrong) => (correctParser, identifierCorrect) => (parserState) => {
    const wrongParserState = wrongParser(parserState);
    if (!wrongParserState.isError) {
        return (0, ParserUtils_1.updateParserError)(Object.assign(Object.assign({}, wrongParserState), { isError: true, result: parserState.result }), `Parser found unintended ${identifierWrong || "unindetified"} structure`);
    }
    const correctParserState = correctParser(parserState);
    if (correctParserState.isError) {
        console.log("was not able to parse correct structure");
        return (0, ParserUtils_1.updateParserError)(Object.assign(Object.assign({}, correctParserState), { result: parserState.result }), `Parser could not match ${identifierCorrect !== null && identifierCorrect !== void 0 ? identifierCorrect : "unindetified"} structure`);
    }
    console.log("was able to parse correct structure");
    return (0, ParserUtils_1.updateParserState)(correctParserState, Object.assign(Object.assign({}, correctParserState), { result: correctParserState.result }));
};
exports.except = except;
