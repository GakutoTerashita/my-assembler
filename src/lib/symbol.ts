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