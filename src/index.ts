import { Parser } from "./models";

import * as T from "./AtomicParsers";
import * as C from "./Combinators";
import * as M from "./Modifiers";
import * as U from "./ParserUtils";

export const P = {
    ...T,
    ...C,
    ...M,
    ...U,
};