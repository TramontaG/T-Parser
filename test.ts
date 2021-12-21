import T from "./src/index";

const string = "-{{value}}";

const openBrackets = T.repeat(2)(T.str("{"), "open brackets");
const closeBrackets = T.repeat(2)(T.str("}"), "close brackets");
const betweenBrackets = T.between(openBrackets, closeBrackets);
const stringParser = T.sequenceOf(
    [T.str("-"), betweenBrackets(T.letters, "variable usage")],
    "test input"
);

const parserResult = T.parse(string, stringParser);

console.log(parserResult);
