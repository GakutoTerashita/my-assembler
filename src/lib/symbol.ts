export type SymbolTable = Map<string, number>;

export const createSymbolTable = (): SymbolTable => {
    const table = new Map<string, number>();
    // Predefined symbols
    for (let i = 0; i < 16; i++) {
        registerSymbol(`R${i}`, i, table);
    }
    registerSymbol('SP', 0, table);
    registerSymbol('LCL', 1, table);
    registerSymbol('ARG', 2, table);
    registerSymbol('THIS', 3, table);
    registerSymbol('THAT', 4, table);
    registerSymbol('SCREEN', 16384, table);
    registerSymbol('KBD', 24576, table);
    return table;
}

export const querySymbol = (
    symbol: string,
    table: SymbolTable,
    usedVariableSymbolAddr: Set<number>,
): number => {
    const { hit, address: resolvedAddr } = resolveSymbol(symbol, table);

    return hit
        ? resolvedAddr
        : registerSymbol(symbol, queryUsableAddress(usedVariableSymbolAddr), table);
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

export const queryUsableAddress = (usedVariableSymbolAddr: Set<number>): number => {
    let addr = 16;
    while (usedVariableSymbolAddr.has(addr)) {
        addr++;
    }

    if (addr > 16_383) {
        throw new Error('No usable address available');
    }

    usedVariableSymbolAddr.add(addr);
    return addr;
}