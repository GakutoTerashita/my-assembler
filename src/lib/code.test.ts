import { dest } from "./code";

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
