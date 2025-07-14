import { advanceParser, createParser, hasMoreLines, Parser } from "./parser";

describe('Parser', () => {

    describe('createParser', () => {

        it('createParser initializes with lines from content', () => {
            const content = "Line 1\nLine 2";
            const parser = createParser(content);
            expect(parser.lines).toEqual(["Line 1", "Line 2"]);
        });

        it('createParser initializes with currentIndex 0', () => {
            const content = "Line 1\nLine 2";
            const parser = createParser(content);
            expect(parser.index).toBe(0);
        });

    });

    describe('hasMoreLines', () => {

        it('returns true when there are more lines', () => {
            const parser: Parser = {
                lines: ["Line 1", "Line 2"],
                index: 0,
                instruction: null,
            }
            expect(hasMoreLines(parser)).toBe(true);
        });

        it('returns false when no more lines', () => {
            const parser: Parser = {
                lines: ["Line 1", "Line 2"],
                index: 2,
                instruction: null,
            }
            expect(hasMoreLines(parser)).toBe(false);
        });

    });

    describe('advanceParser', () => {

        it('increments the index and sets the instruction', () => {
            const initialParser = {
                lines: ["Line 1", "Line 2"],
                index: 0,
                instruction: null
            };
            const nextParser = advanceParser(initialParser);
            expect(nextParser.index).toBe(1);
            expect(nextParser.instruction).toBe("Line 1");
        });

        it('throws an error if there are no more lines', () => {
            const parser = {
                lines: ["Line 1"],
                index: 1,
                instruction: "Line 1"
            };
            expect(() => advanceParser(parser)).toThrow("No more lines to advance.");
        });

    });

});