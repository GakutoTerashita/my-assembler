import { breakLines } from "./text";

export interface Parser {
    readonly lines: string[];
    readonly instruction: string;
}

export type InstructionType =
    'A_INSTRUCTION' |
    'C_INSTRUCTION' |
    'L_INSTRUCTION';

export const createParser = (content: string): Parser => ({
    lines: breakLines(content),
    instruction: "## START OF THE FILE ##",
});

export const hasMoreLines = (parser: Parser): boolean => (
    parser.lines.length > 0
);

export const advanceParser = (parser: Parser): Parser => {
    if (!hasMoreLines(parser)) {
        if (parser.instruction.trim() === '') {
            throw new Error("Final line cannot be an empty line.");
        }
        if (parser.instruction.startsWith('//')) {
            throw new Error("Final line cannot be a comment.");
        }
        throw new Error("No more lines to advance.");
    }

    const nextParser: Parser = {
        ...parser,
        instruction: parser.lines[0],
        lines: parser.lines.slice(1),
    };

    if (
        nextParser.instruction.startsWith('//')
        || nextParser.instruction.trim() === ''
    ) {
        return advanceParser(nextParser);
    }

    return nextParser;
}

export const instructionType = (
    instruction: string
): InstructionType => {

    if (instruction.startsWith('@'))
        return 'A_INSTRUCTION';

    if (instruction.startsWith('(') && instruction.endsWith(')'))
        return 'L_INSTRUCTION';

    return 'C_INSTRUCTION';
}

export const symbol = (
    instruction: string,
    instructionType: InstructionType,
): string => {

    switch (instructionType) {
        case 'A_INSTRUCTION': // @xxx
            return instruction.slice(1);
        case 'L_INSTRUCTION': // (xxx)
            return instruction.slice(1, -1);
        case 'C_INSTRUCTION': // D=M;JGT, D=M, 0
            throw new Error(`Symbol cannot be extracted from C instruction: ${instruction}`);
        default:
            throw new Error(`Unknown instruction type: ${instructionType}`);
    }
}

export const dest = (instruction: string): string => (
    instruction.includes('=')
        ? instruction.split('=')[0].trim()
        : ''
);

export const comp = (instruction: string): string => {
    const compPart = instruction.includes('=')
        ? instruction.split('=')[1]?.split(';')[0]
        : instruction.split(';')[0];
    if (!compPart) {
        throw new Error(`Comp part not found in instruction: ${instruction}`);
    }
    return compPart.trim();
}

export const jump = (instruction: string): string => (
    instruction.includes(';')
        ? instruction.split(';')[1].trim()
        : ''
);