import * as parser from "./parser"
import * as code from "./code";

type SymbolTable = Map<string, number>;

interface ProcessedLine {
    binary: string;
    table: SymbolTable;
}

const validateAddressRange = (address: number): void => {
    if (isNaN(address) || address < 0 || address > 32767) {
        throw new Error(`Invalid address: ${address}. It must be an integer between 0 and 32767.`);
    }
}

const processInstructionTypeA = (
    instruction: string,
    lineCount: number,
    table: SymbolTable
): ProcessedLine => {

    const symbol: string = parser.symbol(instruction, 'A_INSTRUCTION');
    if (!isNaN(Number(symbol))) {
        // Symbol is a number, use it directly as address
        const address = Number(symbol);
        validateAddressRange(address);
        return {
            binary: address.toString(2).padStart(16, '0'),
            table,
        };
    } else {
        const { hit, address: resolvedAddr } = resolveSymbol(symbol, table);

        const address = hit
            ? resolvedAddr
            : registerSymbol(symbol, lineCount + 16, table); // it starts from 16;

        validateAddressRange(address);
        const body = address.toString(2).padStart(15, '0');
        return {
            binary: body.padStart(16, '0'),
            table,
        };
    }
}

const processInstructionTypeC = (
    instruction: string,
    table: SymbolTable
): ProcessedLine => {
    const destPart = parser.dest(instruction);
    const compPart = parser.comp(instruction);
    const jumpPart = parser.jump(instruction);

    const destCode = code.dest(destPart);
    const compCode = code.comp(compPart);
    const jumpCode = code.jump(jumpPart);

    const body = `${compCode}${destCode}${jumpCode}`;
    return {
        binary: body.padStart(16, '1'),
        table,
    };
}

/**
 * Assembler line processing module
 * @param instruction - The assembly instruction to process
 * @returns Binary representation of the instruction and an updated symbol table
 * @throws Error if the instruction is invalid
 */
export const processLine = (
    instruction: string,
    lineCount: number,
    table: SymbolTable
): ProcessedLine => {
    const iType = parser.instructionType(instruction);

    if (iType === 'A_INSTRUCTION') {
        return processInstructionTypeA(instruction, lineCount, table);
    }

    if (iType === 'L_INSTRUCTION') {
        throw new Error(`Unimplemented for L instruction`);
    }

    if (iType === 'C_INSTRUCTION') {
        return processInstructionTypeC(instruction, table);
    }

    throw new Error(`Unknown instruction type: ${iType}`);
}

interface ResolvedSymbol {
    hit: boolean;
    address: number;
}

export const resolveSymbol = (
    symbol: string,
    table: SymbolTable
): ResolvedSymbol => {
    const addr = table.get(symbol);
    if (addr === undefined) {
        return { hit: false, address: -1 };
    }

    return { hit: true, address: addr };
}

export const registerSymbol = (
    symbol: string,
    address: number,
    table: SymbolTable,
): number => {
    if (table.has(symbol)) {
        throw new Error(`Symbol ${symbol} already exists with address ${table.get(symbol)}`);
    }

    table.set(symbol, address);
    return address;
}