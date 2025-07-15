import { processLine, querySymbol, queryUsableAddress, registerSymbol, resolveSymbol } from "./assembler";

describe('processLine', () => {
    it('returns the correct binary representation for a valid instruction', () => {
        expect(processLine('@2', new Map()).binary)
            .toBe('0000000000000010');

        expect(processLine('D=A', new Map()).binary)
            .toBe('1110110000010000');

        expect(processLine('0;JMP', new Map()).binary)
            .toBe('1110101010000111');
    });
});

describe('querySymbol', () => {
    it('returns the address for a known symbol', () => {
        const table = new Map<string, number>([['R0', 0], ['R1', 1]]);
        expect(querySymbol('R0', table)).toBe(0);
        expect(querySymbol('R1', table)).toBe(1);
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
            const table = new Map<string, number>([['R0', 0], ['R1', 1]]);
            const address = queryUsableAddress(table);
            expect(address).toBe(2);
        }

        {
            const table = new Map<string, number>();
            const address = queryUsableAddress(table);
            expect(address).toBe(0);
        }

        {
            const table = new Map<string, number>([['R0', 0], ['R1', 1], ['R2', 8]]);
            const address = queryUsableAddress(table);
            expect(address).toBe(2);
        }
    });

    it('throws an error if no usable address is available', () => {
        const table = new Map<string, number>();
        for (let i = 0; i < 16384; i++) {
            registerSymbol(`R${i}`, i, table);
        }
        expect(() => queryUsableAddress(table))
            .toThrow('No usable address available');
    });
});