import { processLine } from "./assembler";

describe('processLine', () => {
    it('returns the correct binary representation for a valid instruction', () => {
        expect(processLine('@2'))
            .toBe('0000000000000010');

        expect(processLine('D=A'))
            .toBe('1110110000010000');

        expect(processLine('0;JMP'))
            .toBe('1110101010000111');
    });
});