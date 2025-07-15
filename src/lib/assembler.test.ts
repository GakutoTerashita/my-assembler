import { processLine } from "./assembler";

describe('processLine', () => {
    it('returns the correct binary representation for a valid instruction', () => {
        expect(processLine('@2', new Map()))
            .toBe('0000000000000010');

        expect(processLine('D=A', new Map()))
            .toBe('1110110000010000');

        expect(processLine('0;JMP', new Map()))
            .toBe('1110101010000111');
    });

    it('resolves A symbols', () => {
        const table = new Map<string, number>([['R0', 0], ['R1', 1], ['R15', 15]]);
        expect(processLine('@R0', table)).toBe('0000000000000000');
        expect(processLine('@R1', table)).toBe('0000000000000001');
        expect(processLine('@R15', table)).toBe('0000000000001111');

        processLine('@YIPPEE', table);
        const yippee = table.get('YIPPEE');
        expect(yippee).toBe(2);

        expect(processLine('@YIPPEE', table)).toBe(`${yippee?.toString(2).padStart(16, '0')}`);
    })
});
