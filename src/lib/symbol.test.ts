import {
    querySymbol,
    registerSymbol,
    resolveSymbol,
    queryUsableAddress,
    createSymbolTable
} from "./symbol";

describe('createSymbolTable', () => {
    it('creates a symbol table with predefined symbols', () => {
        const table = createSymbolTable();

        for (let i = 0; i < 16; i++) {
            expect(table.get(`R${i}`)).toBe(i);
        }

        expect(table.get('SP')).toBe(0);
        expect(table.get('LCL')).toBe(1);
        expect(table.get('ARG')).toBe(2);
        expect(table.get('THIS')).toBe(3);
        expect(table.get('THAT')).toBe(4);
        expect(table.get('SCREEN')).toBe(16384);
        expect(table.get('KBD')).toBe(24576);
    });
});

describe('querySymbol', () => {
    it('returns the address for a known symbol', () => {
        const table = new Map<string, number>([['R0', 0], ['R1', 1]]);
        expect(querySymbol('R0', table, new Set())).toBe(0);
        expect(querySymbol('R1', table, new Set())).toBe(1);
    });

    it('registers a new symbol if it does not exist', () => {
        const table = new Map<string, number>();
        const address = registerSymbol('R2', 2, table);
        expect(address).toBe(2);
        expect(table.get('R2')).toBe(2);
    });
});

describe('resolveSymbol', () => {
    it('returns the address for a known symbol', () => {
        const table = new Map<string, number>([['R0', 0], ['R1', 1]]);
        const result = resolveSymbol('R0', table);
        expect(result.hit).toBe(true);
        expect(result.address).toBe(0);
    });

    it('returns false for an unknown symbol', () => {
        const table = new Map<string, number>();
        const result = resolveSymbol('UNKNOWN', table);
        expect(result.hit).toBe(false);
    });
});

describe('registerSymbol', () => {
    it('adds a new symbol to the table', () => {
        const table = new Map<string, number>();
        registerSymbol('R2', 2, table);
        expect(table.get('R2')).toBe(2);
    });

    it('throws an error if the symbol already exists', () => {
        const table = new Map<string, number>([['R0', 0]]);
        expect(() => registerSymbol('R0', 1, table)).toThrow('Symbol R0 already exists with address 0');
    });
});

describe('queryUsableAddress', () => {
    it('returns the next available address', () => {
        {
            const set = new Set<number>();
            const address = queryUsableAddress(set);
            expect(address).toBe(16);
        }

        {
            const set = new Set<number>([16, 17]);
            const address = queryUsableAddress(set);
            expect(address).toBe(18);
        }
    });

    it('throws an error if no usable address is available', () => {
        const set = new Set<number>();
        for (let i = 0; i < 16384; i++) {
            set.add(i);
        }
        expect(() => queryUsableAddress(set))
            .toThrow('No usable address available');
    });
});