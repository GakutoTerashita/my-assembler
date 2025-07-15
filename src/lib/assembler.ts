import * as parser from "./parser"
import * as code from "./code";

/**
 * Assembler line processing module
 * @param instruction - The assembly instruction to process
 * @returns Binary representation of the instruction
 * @throws Error if the instruction is invalid
 */
export const processLine = (instruction: string): string => {
    const iType = parser.instructionType(instruction);

    if (iType === 'A_INSTRUCTION') {
        const address = parseInt(instruction.slice(1), 10);
        if (isNaN(address) || address < 0 || address > 32767) {
            throw new Error(`Invalid A instruction: ${instruction}`);
        }
        const body = address.toString(2).padStart(15, '0');
        return body.padStart(16, '0');
    }

    if (iType === 'L_INSTRUCTION') {
        throw new Error(`Unimplemented for L instruction`);
    }

    if (iType === 'C_INSTRUCTION') {
        const destPart = parser.dest(instruction);
        const compPart = parser.comp(instruction);
        const jumpPart = parser.jump(instruction);

        const destCode = code.dest(destPart);
        const compCode = code.comp(compPart);
        const jumpCode = code.jump(jumpPart);

        const body = `${compCode}${destCode}${jumpCode}`;
        return body.padStart(16, '1');
    }

    throw new Error(`Unknown instruction type: ${iType}`);
}