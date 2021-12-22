"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suceededBy = exports.preceededBy = exports.suceededByString = exports.preceededByString = exports.betweenParenthesis = exports.anySpace = void 0;
const __1 = require("..");
const AtomicParsers_1 = require("./AtomicParsers");
const Combinators_1 = require("./Combinators");
const Modifiers_1 = require("./Modifiers");
const ParserUtils_1 = require("./ParserUtils");
exports.anySpace = (0, Combinators_1.choice)([AtomicParsers_1.whiteSpace, AtomicParsers_1.tab], "space");
exports.betweenParenthesis = (0, Modifiers_1.betweenStrings)("(", ")");
const preceededByString = (predecessor) => (parser) => (0, Modifiers_1.transform)((0, __1.sequenceOf)([(0, AtomicParsers_1.str)(predecessor), parser]), ({ result }) => result[1]);
exports.preceededByString = preceededByString;
const suceededByString = (successor) => (parser) => (0, Modifiers_1.transform)((0, __1.sequenceOf)([parser, (0, AtomicParsers_1.str)(successor)]), ({ result }) => result[0]);
exports.suceededByString = suceededByString;
const preceededBy = (predecessor) => (parser, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
    const predecessorParserState = predecessor(parserState);
    if (predecessorParserState.isError)
        return (0, ParserUtils_1.updateParserError)(predecessorParserState, `error while trying to parse predecessor of ${identifier || "unidentified structure"}`);
    const resultParserState = parser(predecessorParserState);
    if (resultParserState.isError)
        return (0, ParserUtils_1.updateParserError)(resultParserState, `error while trying to parse ${identifier || "unindentified structure"}`);
    return (0, ParserUtils_1.updateParserState)(resultParserState, Object.assign(Object.assign({}, resultParserState), { result: resultParserState.result }));
};
exports.preceededBy = preceededBy;
const suceededBy = (sucessor) => (parser, identifier) => (parserState) => {
    if (parserState.isError)
        return parserState;
    const resultParserState = parser(parserState);
    if (resultParserState.isError)
        return (0, ParserUtils_1.updateParserError)(resultParserState, `error while trying to parse ${identifier || "unidentified structure"}`);
    const successorParserState = sucessor(resultParserState);
    if (resultParserState.isError)
        return (0, ParserUtils_1.updateParserError)(resultParserState, `error while trying to parse sucessor of ${identifier || "unindentified structure"}`);
    return (0, ParserUtils_1.updateParserState)(successorParserState, Object.assign(Object.assign({}, successorParserState), { result: resultParserState.result }));
};
exports.suceededBy = suceededBy;
