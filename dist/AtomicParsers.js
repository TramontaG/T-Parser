"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whiteSpace = exports.lettersOrDigits = exports.digits = exports.letters = exports.regexMatch = exports.str = void 0;
const ParserUtils_1 = require("./ParserUtils");
const str = (target, identifier) => (parserState, supressErrors) => {
    if (parserState.isError)
        return parserState;
    const { index } = parserState;
    const supplied = parserState.stringToBeParsed;
    const slicedTarget = supplied.slice(index);
    if (slicedTarget.length === 0)
        return (0, ParserUtils_1.updateParserError)(parserState, `Tried to parse \"${target}\" but got unexpected end of input`);
    if (slicedTarget.startsWith(target))
        return (0, ParserUtils_1.updateParserState)(parserState, Object.assign(Object.assign({}, parserState), { index: parserState.index + target.length, result: target }));
    if (supressErrors)
        return (0, ParserUtils_1.updateSupressedParserError)(parserState, `Tried do parse ${identifier || target} but got ${supplied.slice(parserState.index, parserState.index + 10)} instead`);
    return (0, ParserUtils_1.updateParserError)(parserState, `Tried do parse \"${identifier || target}\" but got \"${supplied.slice(parserState.index, parserState.index + 10)}${parserState.stringToBeParsed.length > parserState.index + 10
        ? "..."
        : ""}\" instead`);
};
exports.str = str;
const regexMatch = (regex, identifier) => (parserState, supressErrors) => {
    if (parserState.isError)
        return parserState;
    const supplied = parserState.stringToBeParsed;
    const slicedTarget = supplied.slice(parserState.index);
    if (slicedTarget.length === 0)
        return (0, ParserUtils_1.updateParserError)(parserState, `Treid to match regex ${regex} but got unexpected end of input`);
    const matchedSting = slicedTarget.match(regex);
    if (matchedSting) {
        return (0, ParserUtils_1.updateParserState)(parserState, Object.assign(Object.assign({}, parserState), { index: parserState.index + matchedSting[0].length, result: matchedSting[0] }));
    }
    if (supressErrors)
        return (0, ParserUtils_1.updateSupressedParserError)(parserState, `Tried to match ${identifier || `Regex ${regex}`} but got ${supplied.split(" ")[0]} instead`);
    return (0, ParserUtils_1.updateParserError)(parserState, `Tried to match ${identifier || `Regex ${regex}`} but got ${supplied.split(" ")[0]} instead`);
};
exports.regexMatch = regexMatch;
exports.letters = (0, exports.regexMatch)(/^[A-Za-z]+/, "letters");
exports.digits = (0, exports.regexMatch)(/^[0-9]+/, "digits");
exports.lettersOrDigits = (0, exports.regexMatch)(/^[A-Za-z0-9]+/, "letters or digits");
exports.whiteSpace = (0, exports.str)(" ", "whitespace");
