import * as Parser from "./parser"
import * as Code from "./code";
import {
    createSymbolTable,
    SymbolTable,
    querySymbol,
    resolveSymbol,
    registerSymbol
} from "./symbol";

export const assemble = (assembly: string): string[] => {
    const symbolTable = createSymbolTable();
    const collectBins = (
        parser: ReturnType<typeof Parser.createParser>,
        bins: string[] = []
    ): string[] => {

        if (!Parser.hasMoreLines(parser)) return bins;
        const nextParser = Parser.advanceParser(parser);
        const bin = processLine(nextParser.instruction, symbolTable);
        console.log(`${bin} : ${nextParser.instruction}`);
        return collectBins(nextParser, [...bins, bin]);
    };

    const parser0 = Parser.createParser(assembly);
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

    const symbol: string = Parser.symbol(instruction, 'A_INSTRUCTION');
    const address = (isNaN(Number(symbol)))
        ? querySymbol(symbol, table)
        : Number(symbol);

    validateAddressRange(address);
    return address.toString(2).padStart(16, '0');
}

const processInstructionTypeC = (
    instruction: string
): string => {
    const destPart = Parser.dest(instruction);
    const compPart = Parser.comp(instruction);
    const jumpPart = Parser.jump(instruction);

    const destCode = Code.dest(destPart);
    const compCode = Code.comp(compPart);
    const jumpCode = Code.jump(jumpPart);

    const body = `${compCode}${destCode}${jumpCode}`;
    return body.padStart(16, '1');
}

/**
 * Assembler line processing module
 * @param instruction - The assembly instruction to process
 * @param table - The symbol table to use for resolving symbols
 * @returns Binary representation of the instruction and an updated symbol table
 * @throws Error if the instruction is invalid
 */
export const processLine = (
    instruction: string,
    table: SymbolTable
): string => {
    const iType = Parser.instructionType(instruction);

    if (iType === 'A_INSTRUCTION') {
        return processInstructionTypeA(instruction, table);
    }

    if (iType === 'L_INSTRUCTION') {
        throw new Error(`L instruction should not be processed here: ${instruction}`);
    }

    if (iType === 'C_INSTRUCTION') {
        return processInstructionTypeC(instruction);
    }

    throw new Error(`Unknown instruction type: ${iType}`);
}

/**
 * Preprocess a line of assembly code for symbol resolution.
 * @param instruction - The assembly instruction to preprocess
 * @param lineNumber - The line number of the instruction
 * @param table - The symbol table to use for resolving symbols
 */
export const preprocessLine = (
    instruction: string,
    lineNumber: number,
    table: SymbolTable
): void => {
    const iType = Parser.instructionType(instruction);

    if (iType === 'L_INSTRUCTION') {
        const symbol = Parser.symbol(instruction, iType);
        if (isNaN(Number(symbol))) {
            const { hit } = resolveSymbol(symbol, table);
            if (hit) {
                throw new Error(`Symbol ${symbol} already exists with address ${table.get(symbol)}`);
            }
            registerSymbol(symbol, lineNumber + 1, table);
        }
    }
}