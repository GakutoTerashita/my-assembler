import * as parser from "./parser"
import * as code from "./code";
import { advanceParser, createParser, hasMoreLines } from "./parser";

export const assemble = (assembly: string): string[] => {
    const symbolTable = createSymbolTable();
    const collectBins = (
        parser: ReturnType<typeof createParser>,
        bins: string[] = []
    ): string[] => {

        if (!hasMoreLines(parser)) return bins;
        const nextParser = advanceParser(parser);
        const bin = processLine(nextParser.instruction, symbolTable);
        console.log(`${bin} : ${nextParser.instruction}`);
        return collectBins(nextParser, [...bins, bin]);
    };

    const parser0 = createParser(assembly);
    return collectBins(parser0);
}

const validateAddressRange = (address: number): void => {
    if (isNaN(address) || address < 0 || address > 32767) {
        throw new Error(`Invalid address: ${address}. It must be an integer between 0 and 32767.`);
    }
}

const processInstructionTypeA = (
    instruction: string,
    table: SymbolTable
): string => {

    const symbol: string = parser.symbol(instruction, 'A_INSTRUCTION');
    const address = (isNaN(Number(symbol)))
        ? querySymbol(symbol, table)
        : Number(symbol);

    validateAddressRange(address);
    return address.toString(2).padStart(16, '0');
}

const processInstructionTypeC = (
    instruction: string
): string => {
    const destPart = parser.dest(instruction);
    const compPart = parser.comp(instruction);
    const jumpPart = parser.jump(instruction);

    const destCode = code.dest(destPart);
    const compCode = code.comp(compPart);
    const jumpCode = code.jump(jumpPart);

    const body = `${compCode}${destCode}${jumpCode}`;
    return body.padStart(16, '1');
}

/**
 * Assembler line processing module
 * @param instruction - The assembly instruction to process
 * @returns Binary representation of the instruction and an updated symbol table
 * @throws Error if the instruction is invalid
 */
export const processLine = (
    instruction: string,
    table: SymbolTable
): string => {
    const iType = parser.instructionType(instruction);

    if (iType === 'A_INSTRUCTION') {
        return processInstructionTypeA(instruction, table);
    }

    if (iType === 'L_INSTRUCTION') {
        throw new Error(`Unimplemented for L instruction`);
    }

    if (iType === 'C_INSTRUCTION') {
        return processInstructionTypeC(instruction);
    }

    throw new Error(`Unknown instruction type: ${iType}`);
}

export type SymbolTable = Map<string, number>;

export const createSymbolTable = (): SymbolTable => {
    const table = new Map<string, number>();
    // Predefined symbols
    for (let i = 0; i < 16; i++) {
        registerSymbol(`R${i}`, i, table);
    }
    registerSymbol('SCREEN', 16384, table);
    registerSymbol('KBD', 24576, table);
    return table;
}

export const querySymbol = (
    symbol: string,
    table: SymbolTable
): number => {
    const { hit, address: resolvedAddr } = resolveSymbol(symbol, table);

    return hit
        ? resolvedAddr
        : registerSymbol(symbol, queryUsableAddress(table), table);
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

export const queryUsableAddress = (table: SymbolTable): number => {
    const used = new Set(Array.from(table.values()));
    let addr = 0;
    while (used.has(addr)) {
        addr++;
    }

    if (addr > 16_383) {
        throw new Error('No usable address available');
    }
    return addr;
}
