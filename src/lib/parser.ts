import { breakLines } from "./text";

export interface Parser {
    readonly lines: string[];
    readonly index: number;
    readonly instruction: string | null;
}

export type InstructionType = 'A_INSTRUCTION' | 'C_INSTRUCTION' | 'L_INSTRUCTION';

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
): InstructionType => {

    if (instruction.startsWith('@'))
        return 'A_INSTRUCTION';

    if (instruction.startsWith('(') && instruction.endsWith(')'))
        return 'L_INSTRUCTION';

    if (instruction.includes('='))
        return 'C_INSTRUCTION';

    throw new Error(`Unknown instruction type for provided instruction: ${instruction}`);
}

export const symbol = (instruction: string, instructionType: InstructionType): string => {

    switch (instructionType) {
        case 'A_INSTRUCTION':
            return instruction.slice(1);
        case 'L_INSTRUCTION':
            return instruction.slice(1, -1);
        case 'C_INSTRUCTION':
            throw new Error(`Symbol cannot be extracted from C instruction: ${instruction}`);
        default:
            throw new Error(`Unknown instruction type: ${instructionType}`);
    }
}

export const dest = (instruction: string): string | null => {
    const destPart = instruction.split('=')[0];
    return destPart ? destPart.trim() : null;
}

