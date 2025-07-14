import { breakLines } from "./text";

describe('breakLines', () => {
    it('breaks text into lines', () => {
        const input = "Line 1\nLine 2\nLine 3";
        const expected = ["Line 1", "Line 2", "Line 3"];
        expect(breakLines(input)).toEqual(expected);
    });
});