import { preprocessLine, processLine } from "./assembler";

describe('processLine', () => {
    it('returns the correct binary representation for a valid instruction', () => {
        const set = new Set<number>();
        expect(processLine('@2', new Map(), set))
            .toBe('0000000000000010');

        expect(processLine('D=A', new Map(), set))
            .toBe('1110110000010000');

        expect(processLine('0;JMP', new Map(), set))
            .toBe('1110101010000111');
    });

    it('resolves A symbols', () => {
        const set = new Set<number>();
        const table = new Map<string, number>([['R0', 0], ['R1', 1], ['R15', 15]]);
        expect(processLine('@R0', table, set)).toBe('0000000000000000');
        expect(processLine('@R1', table, set)).toBe('0000000000000001');
        expect(processLine('@R15', table, set)).toBe('0000000000001111');

        processLine('@YIPPEE0', table, set);
        processLine('@YIPPEE1', table, set);
        const yippee0 = table.get('YIPPEE0');
        expect(yippee0).toBe(16);
        const yippee1 = table.get('YIPPEE1');
        expect(yippee1).toBe(17);

        expect(processLine('@YIPPEE0', table, set)).toBe(`${yippee0?.toString(2).padStart(16, '0')}`);
        expect(processLine('@YIPPEE1', table, set)).toBe(`${yippee1?.toString(2).padStart(16, '0')}`);
    })
});

describe('preprocessLine', () => {
    it('Maps L instructions based on their line number', () => {
        const table = new Map<string, number>();
        preprocessLine('(LOOP)', 0, table);
        expect(table.get('LOOP')).toBe(1);

        preprocessLine('(END)', 99, table);
        expect(table.get('END')).toBe(100);
    });

    it('throws an error for duplicate L instructions', () => {
        const table = new Map<string, number>();
        preprocessLine('(LOOP)', 0, table);
        expect(() => preprocessLine('(LOOP)', 100, table))
            .toThrow('Symbol LOOP already exists with address 1');
    });
});