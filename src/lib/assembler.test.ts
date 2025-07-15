import { processLine, registerSymbol, resolveSymbol } from "./assembler";

describe('processLine', () => {
    it('returns the correct binary representation for a valid instruction', () => {
        expect(processLine('@2', 0, new Map()).binary)
            .toBe('0000000000000010');

        expect(processLine('D=A', 1, new Map()).binary)
            .toBe('1110110000010000');

        expect(processLine('0;JMP', 2, new Map()).binary)
            .toBe('1110101010000111');
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