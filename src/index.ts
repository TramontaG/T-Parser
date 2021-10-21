import { Parser } from "./models";

import * as T from "./AtomicParsers";
import * as C from "./Combinators";
import * as M from "./Modifiers";

const parse = (targetString: string, parser: Parser) => {
    const parsingResult = C.parse(targetString || "", parser);
    return parsingResult;
};

export const P = {
    ...T,
    ...C,
    ...M,
};
