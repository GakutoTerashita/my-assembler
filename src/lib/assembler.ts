import * as parser_module from "./parser"
import * as code_module from "./code";
import {
    createSymbolTable,
    SymbolTable,
    querySymbol,
    resolveSymbol,
    registerSymbol
} from "./symbol";

/**
 * Assemble the given assembly code into machine code.
 * @param assembly - The assembly code as a string
 * @returns An array of binary strings representing the machine code
 */
export const assemble = (assembly: string): string[] => {
    const symbolTable = createSymbolTable();

    registerLabelSymbols(assembly, symbolTable);

    console.log("");

    return collectBinary(assembly, symbolTable);
}

/**
 * Register label symbols from assembly code into the symbol table.
 * @param assembly - The assembly code as a string
 * @param table - The symbol table to register labels into
 */
export const registerLabelSymbols = (assembly: string, table: SymbolTable): void => {
    let parser = parser_module.createParser(assembly);
    let lineNumber = -1;

    while (parser_module.hasMoreLines(parser)) {

        const nextParser = parser_module.advanceParser(parser);

        if (parser_module.instructionType(nextParser.instruction) !== 'L_INSTRUCTION') {
            lineNumber++;
            console.log(`Preprocessing: ${nextParser.instruction} at line ${lineNumber}`);
        } else {
            console.log(`Preprocessing L instruction: ${nextParser.instruction}`);
        }

        preprocessLine(nextParser.instruction, lineNumber, table);

        parser = nextParser;

    }
}

/**
 * Collect binary representations of assembly instructions.
 * @param assembly - The assembly code as a string
 * @param table - The symbol table to use for resolving label symbols
 * @returns An array of binary strings representing the instructions
 */
export const collectBinary = (assembly: string, table: SymbolTable): string[] => {
    let parser = parser_module.createParser(assembly);

    const usedVariableSymbolAddr: Set<number> = new Set();
    const bins: string[] = [];

    while (parser_module.hasMoreLines(parser)) {

        const nextParser = parser_module.advanceParser(parser);

        if (parser_module.instructionType(nextParser.instruction) === 'L_INSTRUCTION') {
            parser = nextParser;
            continue;
        }

        const bin = processLine(
            nextParser.instruction,
            table,
            usedVariableSymbolAddr
        );
        console.log(`${bin} : ${nextParser.instruction}`);
        bins.push(bin);

        parser = nextParser;

    }

    return bins;
}

const validateAddressRange = (address: number): void => {
    if (isNaN(address) || address < 0 || address > 32767) {
        throw new Error(`Invalid address: ${address}. It must be an integer between 0 and 32767.`);
    }
}

/**
 * Process an A-instruction in assembly code.
 * @param instruction - Single assembly instruction to process
 * @param table - Symbol table to resolve label symbols
 * @param usedVariableSymbolAddr - Set to track addresses of used variable symbols
 * @returns Binary representation of the instruction
 */
const processInstructionTypeA = (
    instruction: string,
    table: SymbolTable,
    usedVariableSymbolAddr: Set<number>
): string => {

    const symbol: string = parser_module.symbol(instruction, 'A_INSTRUCTION');
    const address = (isNaN(Number(symbol)))
        ? querySymbol(symbol, table, usedVariableSymbolAddr)
        : Number(symbol);

    validateAddressRange(address);
    return address.toString(2).padStart(16, '0');
}

/**
 * Process a C-instruction in assembly code.
 * @param instruction - Single assembly instruction to process
 * @returns Binary representation of the instruction
 */
const processInstructionTypeC = (
    instruction: string
): string => {
    const destPart = parser_module.dest(instruction);
    const compPart = parser_module.comp(instruction);
    const jumpPart = parser_module.jump(instruction);

    const destCode = code_module.dest(destPart);
    const compCode = code_module.comp(compPart);
    const jumpCode = code_module.jump(jumpPart);

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
    table: SymbolTable,
    usedVariableSymbolAddr: Set<number>
): string => {
    const iType = parser_module.instructionType(instruction);

    if (iType === 'A_INSTRUCTION') {
        return processInstructionTypeA(instruction, table, usedVariableSymbolAddr);
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
    const iType = parser_module.instructionType(instruction);

    if (iType === 'L_INSTRUCTION') {
        const symbol = parser_module.symbol(instruction, iType);
        if (isNaN(Number(symbol))) {
            const { hit } = resolveSymbol(symbol, table);
            if (hit) {
                throw new Error(`Symbol ${symbol} already exists with address ${table.get(symbol)}`);
            }
            const addr = registerSymbol(symbol, lineNumber + 1, table);
            console.log(`Registered symbol: ${symbol} to address ${addr}`);
        }
    }
}