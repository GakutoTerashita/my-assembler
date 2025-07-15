import { comp, dest, jump } from "./code";

describe('dest', () => {
    it('return the correct binary representation for the destination', () => {
        expect(dest('M')).toBe('001');
        expect(dest('D')).toBe('010');
        expect(dest('A')).toBe('100');
    });

    it('handle multiple destinations', () => {
        expect(dest('MD')).toBe('011');
        expect(dest('AM')).toBe('101');
        expect(dest('AD')).toBe('110');
        expect(dest('AMD')).toBe('111');
    });

    it('return 000 for empty destination', () => {
        expect(dest('')).toBe('000');
    });
});

describe('comp', () => {
    it('return the correct binary representation for comp', () => {
        expect(comp('0')).toBe('0101010');
        expect(comp('1')).toBe('0111111');
        expect(comp('-1')).toBe('0111010');
        expect(comp('D')).toBe('0001100');
        expect(comp('A')).toBe('0110000');
        expect(comp('M')).toBe('1110000');
        expect(comp('!D')).toBe('0001101');
        expect(comp('!A')).toBe('0110001');
        expect(comp('!M')).toBe('1110001');
        expect(comp('-D')).toBe('0001111');
        expect(comp('-A')).toBe('0110011');
        expect(comp('-M')).toBe('1110011');
    });

    it('handle complex comp expressions', () => {
        expect(comp('D+1')).toBe('0011111');
        expect(comp('A+1')).toBe('0110111');
        expect(comp('M+1')).toBe('1110111');
        expect(comp('D-1')).toBe('0001110');
        expect(comp('A-1')).toBe('0110010');
        expect(comp('M-1')).toBe('1110010');
        expect(comp('D+A')).toBe('0000010');
        expect(comp('D+M')).toBe('1000010');
        expect(comp('D-A')).toBe('0010011');
        expect(comp('D-M')).toBe('1010011');
        expect(comp('A-D')).toBe('0000111');
        expect(comp('M-D')).toBe('1000111');
        expect(comp('D&A')).toBe('0000000');
        expect(comp('D&M')).toBe('1000000');
        expect(comp('D|A')).toBe('0010101');
        expect(comp('D|M')).toBe('1010101');
    });

    it('throw an error for invalid comp expressions', () => {
        expect(() => comp('INVALID')).toThrow();
    });
});

describe('jump', () => {
    it('return the correct binary representation for jump', () => {
        expect(jump('')).toBe('000');
        expect(jump('JGT')).toBe('001');
        expect(jump('JEQ')).toBe('010');
        expect(jump('JGE')).toBe('011');
        expect(jump('JLT')).toBe('100');
        expect(jump('JNE')).toBe('101');
        expect(jump('JLE')).toBe('110');
        expect(jump('JMP')).toBe('111');
    });

    it('throw an error for invalid jump expressions', () => {
        expect(() => jump('INVALID')).toThrow();
    });
});