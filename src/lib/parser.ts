import { breakLines } from "./text";

export interface Parser {
    readonly lines: string[];
    readonly index: number;
    readonly instruction: string | null;
}

export const createParser = (content: string): Parser => ({
    lines: breakLines(content),
    index: 0,
    instruction: null,
});

export const hasMoreLines = (parser: Parser): boolean => (
    parser.index < parser.lines.length
);

export const advanceParser = (parser: Parser): Parser => {
    if (!hasMoreLines(parser)) {
        throw new Error("No more lines to advance.");
    }
    return {
        ...parser,
        index: parser.index + 1,
        instruction: parser.lines[parser.index],
    };
}