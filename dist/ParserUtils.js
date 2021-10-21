"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatArgs = exports.updateParserState = exports.updateSupressedParserError = exports.updateParserError = void 0;
const updateParserError = (previousState, errorMsg) => {
    previousState.errorStack.unshift(errorMsg);
    const stringLeft = previousState.stringToBeParsed.slice(previousState.index);
    return Object.assign(Object.assign({}, previousState), { isError: true, stringLeft });
};
exports.updateParserError = updateParserError;
const updateSupressedParserError = (previousState, errorMsg) => {
    return Object.assign(Object.assign({}, previousState), { isError: true, stringLeft: previousState.stringToBeParsed.slice(previousState.index) });
};
exports.updateSupressedParserError = updateSupressedParserError;
const updateParserState = (previousState, newState) => {
    return Object.assign(Object.assign(Object.assign({}, previousState), newState), { errorStack: [] });
};
exports.updateParserState = updateParserState;
const flatArgs = (args) => {
    return args.reduce((acc, obj) => {
        const key = Object.keys(obj)[0];
        const value = obj[key];
        return Object.assign(Object.assign({}, acc), { [key]: value });
    }, {});
};
exports.flatArgs = flatArgs;
