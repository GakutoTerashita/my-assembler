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

export const instructionType = (
    instruction: string
): 'A_INSTRUCTION' | 'C_INSTRUCTION' | 'L_INSTRUCTION' => {

    if (instruction.startsWith('@'))
        return 'A_INSTRUCTION';

    if (instruction.startsWith('(') && instruction.endsWith(')'))
        return 'L_INSTRUCTION';

    if (instruction.includes('='))
        return 'C_INSTRUCTION';

    throw new Error(`Unknown instruction type for provided instruction: ${instruction}`);
}